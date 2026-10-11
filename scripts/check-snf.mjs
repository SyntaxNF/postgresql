// Explicitly invoked checks over the canonical SNF parser; never executes SQL.
import { inspectContract } from './snf-contract.mjs';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parser as parserModule, parserRevision, parserInput } from './parser-runtime.mjs';
export { parserRevision } from './parser-runtime.mjs';

export const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const { SNFDocumentParser, SNFParser, NodeType } = parserModule;
export const parser = new SNFDocumentParser();
export const document = file => parser.parse(fs.readFileSync(path.join(root, file), 'utf8'));
const trivia = new Set([NodeType.BLANK, NodeType.WRAP]);
export const significant = nodes => (nodes ?? []).filter(node => !trivia.has(node.type));
export function visit(node, callback, parent) {
    callback(node, parent);
    node.children?.forEach(child => visit(child, callback, node));
}

// OPTIONAL directly owns its sequence. Explicit single-choice ENUM/GROUP
// wrappers can also enclose a loop; never unwrap keywords or punctuation.
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
    visit(ast, node => {
        if (node.type !== NodeType.OPTIONAL) return;
        const children = significant(node.children);
        if (children.length === 1 && unwrapSingleChoice(children[0])?.type === NodeType.LOOP) found.push(node);
    });
    return found;
}

export function checkDocument(file, source) {
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
    errors.push(...inspectContract(document, parserModule).map(error => `${file}: ${error}`));
    const productions = [
        ...document.entries.map(entry => ({ ...entry, kind: entry.name ? 'CASE' : 'IMPLICIT', names: entry.name ? [entry.name] : [] })),
        ...document.definitions,
    ].map(item => ({ ...item, content: item.blocks.map(index => document.blocks[index].content), blocks: item.blocks.map(index => document.blocks[index]) }));
    const declarations = new Map(document.definitions.flatMap(d => d.names.map(name => [name, d])));
    const reachable = new Set();
    function follow(name) {
        if (!declarations.has(name) || reachable.has(name)) return;
        const definition = declarations.get(name);
        definition.names.forEach(name => reachable.add(name));
        definition.dependencies.forEach(follow);
    }
    document.entries.forEach(entry => entry.dependencies.forEach(follow));
    for (const name of declarations.keys()) if (!reachable.has(name)) fail(`unreachable helper ${name}`);
    if (!document.entries.length) fail('no entry point');
    if (document.entries.filter(entry => !entry.name).length > 1) fail('unowned continuation');
    let astNodes = 0, loops = 0;
    const leaves = new Set(), redundantOptionals = [];
    for (const production of productions) {
        visit(production.ast, node => { astNodes++; if (node.type === NodeType.LOOP) loops++; if (node.type === NodeType.VARIABLE) leaves.add(node.content); });
        for (const node of pureLoopOptionals(production.ast)) redundantOptionals.push({ line: document.blocks[node.sourceBlock].startLine, raw: node.raw });
    }
    const record = {
        cases: document.entries.map(entry => entry.name).filter(Boolean), helpers: [...declarations.keys()], leaves: [...leaves].sort(),
        externalStatements: document.definitions.filter(d => d.kind === 'STATEMENT' && !d.ast.categories.length).flatMap(d => d.names),
        blocks: document.blocks.length, astNodes, loops, redundantOptionals,
    };
    return { errors, record, productions, document };
}

export function checkRepository() {
    const errors = [], files = {};
    for (const family of ['alter', 'auth', 'create', 'drop', 'other', 'query', 'transaction']) {
        for (const filename of fs.readdirSync(path.join(root, family)).filter(name => name.endsWith('.snf')).sort()) {
            const file = `${family}/${filename}`;
            const result = checkDocument(file, fs.readFileSync(path.join(root, file), 'utf8'));
            errors.push(...result.errors);
            if (result.record) files[file] = result.record;
        }
    }
    if (Object.keys(files).length !== 183) errors.push(`expected 183 parsed SNF documents, got ${Object.keys(files).length}`);
    return {
        scope: 'Canonical SNF parsing, physical round-trip, raw AST spans, directive ownership, local-reference reachability, actual loop binding, and pure-LOOP optional checks on every file. Not database validation.',
        parserRevision, parserInput,
        documents: Object.keys(files).length,
        blocks: Object.values(files).reduce((sum, file) => sum + file.blocks, 0),
        astNodes: Object.values(files).reduce((sum, file) => sum + file.astNodes, 0),
        loops: Object.values(files).reduce((sum, file) => sum + file.loops, 0),
        errors, files,
    };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
    const report = checkRepository();
    if (process.argv[2]) fs.writeFileSync(process.argv[2], JSON.stringify(report, null, 2) + '\n');
    console.log(JSON.stringify({ ...report, files: undefined }, null, 2));
    if (report.errors.length) process.exitCode = 1;
}
