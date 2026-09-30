// Opt-in real-parser + repository structure check; never executes PostgreSQL.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const entry = process.env.SNF_PARSER_MODULE;
if (!entry) throw new Error('Set SNF_PARSER_MODULE to the pinned built parser; see docs/validation.md');
const { SNFDocumentParser, NodeType, exchangeQuoteNode } = await import(pathToFileURL(path.resolve(entry)).href);
const parser = new SNFDocumentParser();
const errors = [], files = {};
const families = ['alter', 'auth', 'create', 'drop', 'other', 'query', 'transaction'];
for (const family of families) for (const filename of fs.readdirSync(path.join(root, family)).filter(f => f.endsWith('.snf')).sort()) {
    const file = `${family}/${filename}`, source = fs.readFileSync(path.join(root, file), 'utf8');
    const fail = text => errors.push(`${file}: ${text}`);
    if (!/^# https:\/\/www\.postgresql\.org\/docs\/18\/sql-[a-z-]+\.html\n/.test(source)) fail('missing version-scoped first-line source');
    if (/\t| +$/m.test(source)) fail('tabs or trailing whitespace');
    source.split('\n').forEach((line, i) => { if (line.match(/^ */)[0].length % 4) fail(`indentation not a multiple of four at line ${i+1}`); });
    if (!/^[a-z]+(?:-[a-z]+)*\.snf$/.test(filename)) fail('invalid filename');
    let document;
    try { document = parser.parse(source); } catch (error) { fail(`parse: ${error.message}`); continue; }
    if (document.content !== source || document.lines.map(l => l.content + l.ending).join('') !== source) fail('physical round-trip mismatch');
    const declarations = new Map(), cases = new Set(), roots = [], statements = [];
    let active;
    let nodeCount = 0;
    for (const block of document.blocks) {
        if (!block.content && /^# https:/.test(block.comment)) continue;
        const directives = [...block.comment.matchAll(/^# (CASE|WHERE|ONEOFIS|PARTOFIS|STATEMENT) (.+)$/gm)];
        if (directives.length > 1) fail(`multiple directives at line ${block.startLine}`);
        if (block.comment && !directives.length) fail(`unknown directive at line ${block.startLine}`);
        if (directives.length) {
            const [, kind, names] = directives[0];
            active = { kind, names: names.split(/\s*,\s*/), variables: [], content: [] };
            for (const name of active.names) {
                if (!(kind === 'CASE' ? /^[A-Z][A-Z0-9_]*$/ : /^[a-z][a-z0-9_]*$/).test(name)) fail(`invalid ${kind} name ${name}`);
                if (kind === 'CASE') { if (cases.has(name)) fail(`duplicate CASE ${name}`); cases.add(name); }
                else { if (declarations.has(name)) fail(`duplicate helper ${name}`); declarations.set(name, active); }
            }
            if (kind === 'CASE') roots.push(active);
        } else if (!active && !roots.length) { active = { kind: 'IMPLICIT', variables: [], content: [] }; roots.push(active); }
        else if (!active || !['PARTOFIS', 'ONEOFIS'].includes(active.kind)) fail(`unowned continuation at line ${block.startLine}`);
        if (!block.content.trim() && active?.kind !== 'STATEMENT') fail(`empty production at line ${block.startLine}`);
        if (active) active.content.push(block.content);
        if (active?.kind === 'STATEMENT') {
            for (const line of block.content.split('\n').filter(Boolean)) {
                if (!/^[A-Z][A-Z0-9_]*(?: [A-Z][A-Z0-9_]*)*$/.test(line)) fail(`invalid STATEMENT category ${line}`);
                statements.push(line);
            }
        }
        if (active?.kind === 'ONEOFIS') for (const line of block.content.split('\n')) {
            try { parser.parse(line); } catch { fail(`multiline ONEOFIS candidate at line ${block.startLine}`); }
        }
        const visit = (node, parent) => {
            nodeCount++;
            if (block.content.slice(node.start, node.end) !== node.raw) fail(`AST span mismatch at line ${block.startLine}`);
            if (node.type === NodeType.VARIABLE && active) active.variables.push(node.content);
            if (node.type === NodeType.SPLIT) fail(`alternative separator outside braces at line ${block.startLine}`);
            if (node.type === NodeType.REPEAT && parent?.type !== NodeType.LOOP) fail(`orphan repetition at line ${block.startLine}`);
            if (node.type === NodeType.GROUP && !node.content.trim()) fail(`empty alternative at line ${block.startLine}`);
            node.children?.forEach(child => visit(child, node));
        };
        visit(block.ast);
        const checkLoops = node => {
            const children = node.children ?? [];
            children.forEach((child, i) => {
                if (child.type === NodeType.LOOP) {
                    const prior = children.slice(0,i).findLast(x => ![NodeType.BLANK,NodeType.WRAP].includes(x.type));
                    if (![NodeType.ENUM,NodeType.OPTIONAL,NodeType.VARIABLE].includes(prior?.type)) fail(`postfix loop does not bind a repeatable item at line ${block.startLine}`);
                }
                checkLoops(child);
            });
        };
        checkLoops(exchangeQuoteNode(block.ast));
    }
    if (!roots.length) fail('no entry point');
    const reachable = new Set();
    function follow(name) { if (!declarations.has(name) || reachable.has(name)) return; reachable.add(name); declarations.get(name).variables.forEach(follow); }
    roots.forEach(r => r.variables.forEach(follow));
    for (const name of declarations.keys()) if (!reachable.has(name)) fail(`unreachable helper ${name}`);
    const leaves = [...new Set([...roots, ...declarations.values()].flatMap(x => x.variables).filter(x => !declarations.has(x)))].sort();
    files[file] = { cases: [...cases], helpers: [...declarations.keys()], statements: [...new Set(statements)], externalStatements: [...declarations].filter(([,v]) => v.kind === 'STATEMENT' && !v.content.join('').trim()).map(([k]) => k), leaves, blocks: document.blocks.length, astNodes: nodeCount };
}
const inventoryPath = path.join(root, 'docs/inventory.json');
if (!fs.existsSync(inventoryPath)) throw new Error('Required docs/inventory.json is missing');
{
    const inventory = JSON.parse(fs.readFileSync(inventoryPath));
    const commands = new Set(inventory.map(x => x.command)); commands.add('TABLE');
    if (inventory.length !== 183 || commands.size !== 184) errors.push('official inventory is not 183 distinct commands');
    for (const row of inventory) {
        if (!files[row.file]) errors.push(`inventory missing ${row.file}`);
        else if (!fs.readFileSync(path.join(root, row.file), 'utf8').startsWith(`# ${row.source}\n`)) errors.push(`source mismatch ${row.file}`);
    }
    for (const [file, record] of Object.entries(files)) {
        if (!inventory.some(x => x.file === file)) errors.push(`unlisted ${file}`);
        for (const target of record.statements) if (!commands.has(target)) errors.push(`${file}: unknown nested statement category ${target}`);
    }
}
const contractPath = path.join(root, 'docs/input-contracts.json');
if (!fs.existsSync(contractPath)) throw new Error('Required docs/input-contracts.json is missing');
{
    const contract = JSON.parse(fs.readFileSync(contractPath));
    for (const [file, record] of Object.entries(files)) {
        const actual = record.leaves, expected = Object.keys(contract[file] ?? {}).sort();
        const kinds = new Set(['opaque-code-literal','quoted-string-content','opaque-expression','external-parameter-name','opaque-data-type','scalar-or-enum-value','identifier-or-domain-name']);
        for (const [name, kind] of Object.entries(contract[file] ?? {})) if (!kinds.has(kind)) errors.push(`${file}: unknown leaf classification ${name}:${kind}`);
        if (JSON.stringify(actual) !== JSON.stringify(expected)) errors.push(`${file}: leaf contract mismatch; review unknown/removed placeholders`);
    }
    for (const file of Object.keys(contract)) if (!files[file]) errors.push(`stale input contract ${file}`);
}
const report = { scope: 'SNF parsing, exact source round-trip, directive ownership, local-reference reachability, official entry inventory and explicit input contracts; not SQL execution/semantic validation', documents: Object.keys(files).length, blocks: Object.values(files).reduce((n,x)=>n+x.blocks,0), astNodes: Object.values(files).reduce((n,x)=>n+x.astNodes,0), errors, files };
if (process.argv[2]) fs.writeFileSync(process.argv[2], JSON.stringify(report, null, 2)+'\n');
console.log(JSON.stringify({...report, files: undefined}, null, 2));
if (errors.length) process.exitCode = 1;
