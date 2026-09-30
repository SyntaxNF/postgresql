// Explicitly invoked checks over the canonical SNF parser; never executes SQL.
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';

export const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const parserRevision = 'bcf2c3ac58b45e7d5391716393586b00b11e0c1a';
export const defaultDiffBase = '75d7ec80383dea9ceafe4bf6e324515daaa7e877';
const entry = process.env.SNF_PARSER_MODULE;
if (!entry) throw new Error('Set SNF_PARSER_MODULE to the pinned built parser; see docs/validation.md');
const parserEntry = fs.realpathSync(path.resolve(entry));
const git = (cwd, ...args) => execFileSync('git', ['-C', cwd, ...args], { encoding: 'utf8' }).trim();
const parserRoot = git(path.dirname(parserEntry), 'rev-parse', '--show-toplevel');
if (git(parserRoot, 'rev-parse', 'HEAD') !== parserRevision) throw new Error(`Parser source must be at ${parserRevision}`);
if (parserEntry !== path.join(parserRoot, 'dist/esm/index.mjs')) throw new Error('Use the pinned checkout’s dist/esm/index.mjs entry');
if (JSON.parse(fs.readFileSync(path.join(parserRoot, 'package.json'), 'utf8')).name !== 'snf-parser') throw new Error('Unexpected parser package');
// Ignore unrelated untracked environment files, but reject edits to build inputs.
if (git(parserRoot, 'diff', 'HEAD', '--', 'src', 'package.json', 'pnpm-lock.yaml', 'tsconfig.json', 'vite.config.ts')) throw new Error('Parser build inputs differ from the pinned revision');
if (git(parserRoot, 'ls-files', '--others', '--exclude-standard', '--', 'src')) throw new Error('Untracked parser source found');
export const { SNFDocumentParser, SNFParser, NodeType, exchangeQuoteNode, exchangeLoopNode } = await import(pathToFileURL(parserEntry).href);
export const parser = new SNFDocumentParser();
const trivia = new Set([NodeType.BLANK, NodeType.WRAP]);
export const significant = nodes => (nodes ?? []).filter(node => !trivia.has(node.type));
export const normalized = ast => exchangeLoopNode(exchangeQuoteNode(ast));
export function visit(node, callback, parent) {
    callback(node, parent);
    node.children?.forEach(child => visit(child, callback, node));
}

// OPTIONAL introduces an ENUM/GROUP layer. Unwrap only single choices, never
// keywords or punctuation: [ ORDER BY item [, ...] ] and [ (arg [, ...]) ] stay.
function unwrapSingleChoice(node) {
    while ([NodeType.ENUM, NodeType.GROUP].includes(node?.type)) {
        const children = significant(node.children);
        if (children.length !== 1) break;
        node = children[0];
    }
    return node;
}
export function pureLoopOptionals(ast) {
    const found = [];
    visit(normalized(ast), node => {
        if (node.type !== NodeType.OPTIONAL) return;
        const children = significant(node.children);
        if (children.length === 1 && unwrapSingleChoice(children[0])?.type === NodeType.LOOP) found.push(node);
    });
    return found;
}

export function checkDocument(file, source, { checkPureLoopOptionals = false } = {}) {
    const errors = [];
    const fail = message => errors.push(`${file}: ${message}`);
    if (!/^# https:\/\/www\.postgresql\.org\/docs\/18\/sql-[a-z-]+\.html\r?\n/.test(source)) fail('missing version-scoped first-line source');
    if (/\t| +$/m.test(source)) fail('tabs or trailing whitespace');
    source.split('\n').forEach((line, index) => {
        if (line.match(/^ */)[0].length % 4) fail(`indentation not a multiple of four at line ${index + 1}`);
    });
    if (!/^[a-z]+(?:-[a-z]+)*\.snf$/.test(path.basename(file))) fail('invalid filename');
    let document;
    try { document = parser.parse(source); } catch (error) { fail(`parse: ${error.message}`); return { errors }; }
    if (document.content !== source || document.lines.map(line => line.content + line.ending).join('') !== source) fail('physical round-trip mismatch');
    for (const [index, line] of document.lines.entries()) {
        if (source.slice(line.start, line.end) !== line.content + line.ending || line.line !== index + 1) fail(`physical line span mismatch at line ${index + 1}`);
    }
    const declarations = new Map(), cases = new Set(), roots = [], productions = [];
    let active, astNodes = 0, loops = 0;
    const redundantOptionals = [];
    for (const block of document.blocks) {
        if (!block.content && /^# https:/.test(block.comment)) {
            // The source-comment block still has a real (empty) ROOT AST.
            visit(block.ast, node => {
                astNodes++;
                if (block.content.slice(node.start, node.end) !== node.raw) fail(`AST raw/span mismatch at line ${block.startLine}`);
            });
            continue;
        }
        if (source.slice(block.start, block.end) !== block.lines.map(line => line.content + line.ending).join('')) fail(`block span mismatch at line ${block.startLine}`);
        const directives = [...block.comment.matchAll(/^# (CASE|WHERE|ONEOFIS|PARTOFIS|STATEMENT) (.+)$/gm)];
        if (directives.length > 1) fail(`multiple directives at line ${block.startLine}`);
        const otherComments = block.comment.split('\n').filter(line => line && !/^# (CASE|WHERE|ONEOFIS|PARTOFIS|STATEMENT) .+$/.test(line));
        if (otherComments.length) fail(`unknown directive at line ${block.startLine}`);
        if (directives.length) {
            const [, kind, names] = directives[0];
            active = { kind, names: names.split(/\s*,\s*/), variables: [], content: [], blocks: [] };
            productions.push(active);
            for (const name of active.names) {
                if (!(kind === 'CASE' ? /^[A-Z][A-Z0-9_]*$/ : /^[a-z][a-z0-9_]*$/).test(name)) fail(`invalid ${kind} name ${name}`);
                if (kind === 'CASE') {
                    if (cases.has(name)) fail(`duplicate CASE ${name}`);
                    cases.add(name);
                } else {
                    if (declarations.has(name)) fail(`duplicate helper ${name}`);
                    declarations.set(name, active);
                }
            }
            if (kind === 'CASE') roots.push(active);
        } else if (!active && !roots.length) {
            active = { kind: 'IMPLICIT', names: [], variables: [], content: [], blocks: [] };
            roots.push(active); productions.push(active);
        } else if (!active || !['PARTOFIS', 'ONEOFIS'].includes(active.kind)) fail(`unowned continuation at line ${block.startLine}`);
        if (!block.content.trim() && active?.kind !== 'STATEMENT') fail(`empty production at line ${block.startLine}`);
        if (active) { active.content.push(block.content); active.blocks.push(block); }
        if (active?.kind === 'STATEMENT') {
            for (const line of block.content.split('\n').filter(Boolean)) {
                if (!/^[A-Z][A-Z0-9_]*(?: [A-Z][A-Z0-9_]*)*$/.test(line)) fail(`invalid STATEMENT category ${line}`);
            }
        }
        if (active?.kind === 'ONEOFIS') {
            for (const line of block.content.split('\n')) {
                try { new SNFParser().parse(line); } catch { fail(`multiline ONEOFIS candidate at line ${block.startLine}`); }
            }
        }
        visit(block.ast, (node, parent) => {
            astNodes++;
            if (!Number.isInteger(node.start) || !Number.isInteger(node.end) || node.start < 0 || node.end < node.start || node.end > block.content.length || block.content.slice(node.start, node.end) !== node.raw) fail(`AST raw/span mismatch at line ${block.startLine}`);
            if (parent && (node.start < parent.start || node.end > parent.end)) fail(`AST child escapes parent span at line ${block.startLine}`);
            if (node.type === NodeType.VARIABLE && active) active.variables.push(node.content);
            if (node.type === NodeType.SPLIT) fail(`alternative separator outside braces at line ${block.startLine}`);
            if (node.type === NodeType.REPEAT && parent?.type !== NodeType.LOOP) fail(`orphan repetition at line ${block.startLine}`);
            if (node.type === NodeType.GROUP && !node.content.trim()) fail(`empty alternative at line ${block.startLine}`);
            if (node.type === NodeType.LOOP) loops++;
        });
        // A parsed postfix marker must actually absorb its preceding repeatable
        // member in the canonical walker. Parsing success alone does not prove it.
        visit(normalized(block.ast), node => {
            if (node.type !== NodeType.LOOP) return;
            const members = significant(node.children);
            if (!Array.isArray(node.ast) || members.length !== 1 || ![NodeType.ENUM, NodeType.OPTIONAL, NodeType.VARIABLE].includes(members[0]?.type)) fail(`postfix loop has no single bound member at line ${block.startLine}`);
        });
        for (const node of pureLoopOptionals(block.ast)) {
            const contentLineIndex = block.content.slice(0, node.start).split('\n').length - 1;
            const line = block.lines.filter(item => item.type === 'content')[contentLineIndex].line;
            redundantOptionals.push({ line, raw: node.raw });
            if (checkPureLoopOptionals) fail(`redundant pure-LOOP optional at block line ${block.startLine}: ${node.raw.replace(/\s+/g, ' ')}`);
        }
    }
    if (!roots.length) fail('no entry point');
    if (cases.size && roots.some(production => production.kind === 'IMPLICIT')) fail('mixed implicit and CASE entry points');
    const reachable = new Set();
    function follow(name) {
        if (!declarations.has(name) || reachable.has(name)) return;
        reachable.add(name);
        declarations.get(name).variables.forEach(follow);
    }
    roots.forEach(production => production.variables.forEach(follow));
    for (const name of declarations.keys()) if (!reachable.has(name)) fail(`unreachable helper ${name}`);
    // Unbound names are ordinary caller inputs, expressions, bodies, identifiers,
    // or reused statements. No closed-world input inventory is required.
    const leaves = [...new Set(productions.flatMap(production => production.variables).filter(name => !declarations.has(name)))].sort();
    const record = {
        cases: [...cases], helpers: [...declarations.keys()], leaves,
        externalStatements: [...declarations].filter(([, production]) => production.kind === 'STATEMENT' && !production.content.join('').trim()).map(([name]) => name),
        blocks: document.blocks.length, astNodes, loops, redundantOptionals,
    };
    return { errors, record, productions, document };
}

export function checkRepository() {
    const errors = [], files = {};
    const diffBase = process.env.SNF_DIFF_BASE || defaultDiffBase;
    git(root, 'rev-parse', '--verify', `${diffBase}^{commit}`);
    const changed = new Set([
        ...git(root, 'diff', '--name-only', diffBase, '--', '*.snf').split('\n'),
        ...git(root, 'ls-files', '--others', '--exclude-standard', '--', '*.snf').split('\n'),
    ].filter(Boolean));
    for (const family of ['alter', 'auth', 'create', 'drop', 'other', 'query', 'transaction']) {
        for (const filename of fs.readdirSync(path.join(root, family)).filter(name => name.endsWith('.snf')).sort()) {
            const file = `${family}/${filename}`;
            const result = checkDocument(file, fs.readFileSync(path.join(root, file), 'utf8'), { checkPureLoopOptionals: changed.has(file) });
            errors.push(...result.errors);
            if (result.record) files[file] = result.record;
        }
    }
    if (Object.keys(files).length !== 183) errors.push(`expected 183 parsed SNF documents, got ${Object.keys(files).length}`);
    return {
        scope: 'Canonical SNF parsing, physical round-trip, raw AST spans, directive ownership, local-reference reachability, and actual loop binding; pure-LOOP optional gate only for changed files. Not SQL generation or database validation.',
        parserRevision, diffBase, changedFiles: [...changed].sort(),
        documents: Object.keys(files).length,
        blocks: Object.values(files).reduce((sum, file) => sum + file.blocks, 0),
        astNodes: Object.values(files).reduce((sum, file) => sum + file.astNodes, 0),
        loops: Object.values(files).reduce((sum, file) => sum + file.loops, 0),
        untouchedPureLoopOptionals: Object.entries(files).filter(([file]) => !changed.has(file)).reduce((sum, [, file]) => sum + file.redundantOptionals.length, 0),
        errors, files,
    };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
    const report = checkRepository();
    if (process.argv[2]) fs.writeFileSync(process.argv[2], JSON.stringify(report, null, 2) + '\n');
    console.log(JSON.stringify({ ...report, files: undefined }, null, 2));
    if (report.errors.length) process.exitCode = 1;
}
