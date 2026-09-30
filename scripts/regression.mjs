// Explicit structural tests using the canonical parser and walkers.
// The small expansion oracle below is an isolated fixture, NOT a production
// SQL generator, PostgreSQL SQL parser, or database execution test.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {
    root, parserRevision, parser, SNFParser, NodeType,
    normalized, significant, visit, pureLoopOptionals, checkDocument,
} from './check-snf.mjs';

let checks = 0;
const check = (label, run) => { try { run(); checks++; } catch (error) { throw new Error(`${label}: ${error.message}`, { cause: error }); } };
const source = file => fs.readFileSync(path.join(root, file), 'utf8');
const cache = new Map();
function document(file) {
    if (!cache.has(file)) cache.set(file, checkDocument(file, source(file)));
    return cache.get(file);
}
function production(file, name = null) {
    const found = document(file).productions.find(item => name === null ? item.kind === 'IMPLICIT' : item.names.includes(name));
    assert.ok(found, `${file}: missing production ${name ?? '<implicit>'}`);
    return found;
}
const prodSource = (file, name) => production(file, name).content.join('\n\n');
function has(file, expression, label) { check(`${file}: ${label}`, () => assert.match(source(file), expression)); }
function prodHas(file, name, expression) { check(`${file}:${name}`, () => assert.match(prodSource(file, name), expression)); }
function prodLacks(file, name, expression) { check(`${file}:${name}`, () => assert.doesNotMatch(prodSource(file, name), expression)); }
function boundLoops(file, name) {
    const loops = [];
    for (const block of production(file, name).blocks) visit(normalized(block.ast), node => {
        if (node.type === NodeType.LOOP) loops.push(node);
    });
    return loops;
}
function repeats(file, name, expected, separator = ',') {
    check(`${file}:${name ?? '<implicit>'} whole-item binding ${expected}`, () => {
        const loop = boundLoops(file, name).find(node => expected.test(significant(node.children)[0]?.raw ?? ''));
        assert.ok(loop, 'expected whole item is not a canonical walker LOOP child');
        assert.equal(significant(loop.children).length, 1);
        assert.ok(Array.isArray(loop.ast), 'canonical walker retains original marker in ast');
        assert.equal(significant(loop.ast).filter(node => node.type !== NodeType.REPEAT).map(node => node.content).join(' '), separator);
    });
}

// Focus on retained output fixes, rather than semantic eligibility or complete
// input definitions. Ordinary expression/body/reused-statement leaves are valid.
for (const file of ['create/function.snf', 'create/procedure.snf']) {
    repeats(file, null, /^argument_definition$/);
    repeats(file, null, /^set_parameter_clause$/, '');
    prodHas(file, 'argument_definition', /\[ IN \| OUT \| INOUT \| VARIADIC \]/);
    has(file, /\[ AS pg_definition \]/, 'caller-supplied body stays supported');
    has(file, /\[ sql_definition \]/, 'reused SQL body stays supported');
}
has('create/function.snf', /RETURNS \[ SETOF \] type/, 'SETOF return form');
for (const file of ['alter/function.snf', 'alter/procedure.snf', 'alter/routine.snf']) {
    repeats(file, 'action', /^set_parameter_clause$/, '');
    repeats(file, 'action', /^reset_parameter_clause$/, '');
    prodHas(file, 'set_parameter_clause', /^SET config_parameter/);
    prodHas(file, 'reset_parameter_clause', /^RESET config_parameter$/);
}
for (const file of ['alter/foreign-data.snf', 'alter/server.snf', 'alter/user-mapping.snf']) {
    prodHas(file, 'option_action', /\[ ADD \| SET \] option 'value'/);
    prodHas(file, 'option_action', /DROP option$/);
}
for (const file of ['alter/user-mapping.snf', 'create/user-mapping.snf', 'drop/user-mapping.snf']) prodHas(file, 'role_public', /(?:\{|\|)\s*USER\s*(?:\||\})/);
has('create/access-method.snf', /TYPE \{ TABLE \| INDEX \}/, 'access method kinds');
has('create/database.snf', /COLLATION_VERSION = /, 'required assignment token');
for (const file of ['alter/tablespace.snf', 'create/tablespace.snf']) has(file, /tablespace_parameter = value/, 'parameter assignment');
prodHas('create/aggregate.snf', 'NORMAL', /\{ \* \| argument_definition/);
prodHas('drop/aggregate.snf', 'signature', /ORDER BY order \[, \.\.\.\]/);
prodHas('drop/aggregate.snf', 'order', /\[ argmode \] \[ argname \] argtype/);
for (const name of ['FROM_SQL', 'TO_SQL', 'BOTH']) check(`create/transform.snf:${name}`, () => assert.ok(production('create/transform.snf', name)));
prodHas('create/transform.snf', 'BOTH', /FROM SQL[\s\S]*\],\n\s+TO SQL/);
prodLacks('create/transform.snf', 'FROM_SQL', /TO SQL/);
prodLacks('create/transform.snf', 'TO_SQL', /FROM SQL/);
repeats('create/event-trigger.snf', null, /^filter_definition$/, 'AND');
prodHas('create/event-trigger.snf', 'filter_definition', /^TAG IN \( 'filter_value' \[, \.\.\.\] \)$/);
repeats('create/operator-class.snf', null, /^\{ operator_definition \| function_definition \| STORAGE type \}$/);
repeats('create/statistics.snf', 'KIND', /^statistics_expression$/);
prodLacks('create/statistics.snf', 'KIND', /statistics_expression\s*,\s*statistics_expression/);
prodHas('create/statistics.snf', 'kind', /^NDISTINCT\nDEPENDENCIES\nMCV$/);
for (const file of ['create/publication.snf', 'alter/publication.snf']) {
    prodHas(file, 'table_definition', /^\[ ONLY \] table \[ \* \] \[ \( colname/);
    prodHas(file, 'publication_object', /TABLE table_definition \[, \.\.\.\]/);
    prodHas(file, 'publication_object', /TABLES IN SCHEMA \{ schema \| CURRENT_SCHEMA \} \[, \.\.\.\]/);
}
prodHas('alter/subscription.snf', 'publication_options', /COPY_DATA/);
prodHas('alter/table.snf', 'action', /DISABLE TRIGGER \{ trigger \| ALL \| USER \}/);
prodHas('alter/table.snf', 'identity_option', /INCREMENT \[ BY \] increment/);
has('drop/database.snf', /\[ \[ WITH \] \( FORCE \) \]/, 'FORCE parentheses');
for (const file of ['create/table.snf', 'create/table-as.snf']) has(file, /GLOBAL \| LOCAL/, 'GLOBAL/LOCAL temporary syntax');
has('create/table.snf', /WITHOUT OIDS/, 'WITHOUT OIDS option');
for (const file of ['other/lock.snf', 'other/truncate.snf']) repeats(file, null, /^\{ \[ ONLY \] name \[ \* \] \}$/);
for (const name of ['FROM', 'TO']) prodHas('other/copy.snf', name, /\[ \[ WITH \] \( copy_options \) \]/);
prodHas('other/copy.snf', 'copy_options', /FORMAT \{ TEXT \| CSV \| BINARY \}/);
prodHas('other/copy.snf', 'copy_options', /ON_ERROR \{ STOP \| IGNORE \}/);
prodHas('other/copy.snf', 'copy_options', /LOG_VERBOSITY \{ DEFAULT \| VERBOSE \| SILENT \}/);
prodHas('other/copy.snf', 'TO', /\( query_statement \)/);
prodHas('other/set.snf', 'PARAMETER', /\{ value \| 'value' \} \[, \.\.\.\]/);
prodHas('other/set.snf', 'SCHEMA', /SCHEMA 'schema'/);
prodHas('other/set.snf', 'NAMES', /NAMES 'encoding'/);
for (const file of ['transaction/begin.snf', 'transaction/start-transaction.snf', 'transaction/set-transaction.snf']) prodHas(file, 'transaction_mode', /\{ READ WRITE \| READ ONLY \}/);

// These assertions examine the real exchangeLoopNode result, not just brackets.
for (const file of ['auth/grant.snf', 'auth/revoke.snf']) {
    repeats(file, 'COLUMN', /^\{ \{ SELECT \| INSERT \| UPDATE \| REFERENCES \} \( colname \[, \.\.\.\] \) \}$/);
    repeats(file, 'routine_definition', /^\{ routine \[ \( arg \[, \.\.\.\] \) \] \}$/);
    prodHas(file, 'routine_definition', /^\{ FUNCTION \| PROCEDURE \| ROUTINE \}\n/);
}
for (const file of ['query/select.snf', 'query/select-into.snf']) repeats(file, file.endsWith('/select.snf') ? 'SELECT' : null, /^\{ window AS \( window_expression \) \}$/);
for (const file of ['query/insert.snf', 'query/update.snf', 'query/delete.snf', 'query/merge.snf']) repeats(file, null, /^\{ \{ OLD \| NEW \} AS output_alias \}$/);
repeats('query/insert.snf', 'conflict_target', /^\{ \{ colname \| \( col_expression \) \} \[ COLLATE collate \] \[ opclass \] \}$/);
repeats('query/values.snf', null, /^\{ \( value_expression \[, \.\.\.\] \) \}$/);
repeats('query/insert.snf', null, /^\{ \( \{ value_expression \| DEFAULT \} \[, \.\.\.\] \) \}$/);
repeats('create/table.snf', 'table_constraint_definition', /COLLATE[\s\S]*WITH operator/);
repeats('alter/table.snf', 'table_constraint_definition', /^\{ exclude_column_expression WITH operator \}$/);
repeats('alter/table.snf', 'action', /^\{ attribute_parameter = value \}$/);
repeats('alter/table.snf', 'unique_index_options', /^\{ storage_parameter \[= value\] \}$/);
repeats('alter/table.snf', 'exclude_column_expression', /^\{ opclass_parameter = value \}$/);
for (const file of ['query/select.snf', 'query/select-into.snf', 'query/delete.snf', 'query/update.snf']) {
    prodHas(file, 'from_expression', /colname type \[ COLLATE collate \]/);
    prodHas(file, 'from_expression', /\( joined_expression \)/);
    prodHas(file, 'joined_expression', /from_expression CROSS JOIN from_expression/);
}

// Demonstrate 0/1/2 repetitions against the actual normalized AST. This intentionally
// limited test-only interpreter chooses the first ENUM alternative, omits OPTIONAL
// nodes unless requested, substitutes fixture values, and joins LOOP members using
// the canonical marker ast. It has no grammar references, DB connection, production
// integration, or general SQL validity checks. Zero is allowed even where SQL needs
// at least one item: caller selection/semantic eligibility is outside this test.
function fixtureExpansion(input, { count, value = name => name, optional = false, nestedCount = 1 }) {
    const ast = normalized(new SNFParser().parse(input));
    function render(node, context = { depth: 0, index: 0 }) {
        if (node.type === NodeType.LOOP) {
            const amount = context.depth === 0 ? count : nestedCount;
            const separator = (node.ast ?? []).filter(child => child.type !== NodeType.REPEAT).flatMap(child => render(child, context));
            const output = [];
            for (let index = 0; index < amount; index++) {
                if (index) output.push(...separator);
                output.push(...node.children.flatMap(child => render(child, { depth: context.depth + 1, index })));
            }
            return output;
        }
        if (node.type === NodeType.OPTIONAL && !optional) return [];
        if (node.type === NodeType.ENUM) return render(significant(node.children)[0], context);
        if (node.children) return node.children.flatMap(child => render(child, context));
        if ([NodeType.BLANK, NodeType.WRAP].includes(node.type)) return [];
        assert.notEqual(node.type, NodeType.REPEAT, 'fixture encountered an unbound repeat marker');
        const text = node.type === NodeType.VARIABLE ? value(node.content, context) : node.content;
        return [node.quote ? `${node.quote}${text}${node.quote}` : text];
    }
    return render(ast).join(' ').replace(/\(\s+/g, '(').replace(/\s+\)/g, ')').replace(/\s+([,;])/g, '$1').trim();
}
const fixtures = [
    { label: 'comma values', input: 'item [, ...]', value: (_, { index }) => `v${index + 1}`, expected: ['', 'v1', 'v1, v2'] },
    { label: 'whole WINDOW definition', input: '{ window AS ( window_expression ) } [, ...]', value: (name, { index }) => name === 'window' ? `w${index + 1}` : `x${index + 1}`, expected: ['', 'w1 AS (x1)', 'w1 AS (x1), w2 AS (x2)'] },
    { label: 'parenthesized VALUES row', input: '{ ( value_expression [, ...] ) } [, ...]', value: () => '7', nestedCount: 2, expected: ['', '(7, 7)', '(7, 7), (7, 7)'] },
    { label: 'complete RETURNING alias', input: '{ { OLD | NEW } AS output_alias } [, ...]', value: (_, { index }) => `o${index + 1}`, expected: ['', 'OLD AS o1', 'OLD AS o1, OLD AS o2'] },
    { label: 'SET uses no comma', input: '{ SET config_parameter TO value } [...]', value: (name, { index }) => name === 'config_parameter' ? `p${index + 1}` : `${index + 1}`, expected: ['', 'SET p1 TO 1', 'SET p1 TO 1 SET p2 TO 2'] },
    { label: 'AND-separated filter', input: "{ TAG IN ( 'filter_value' [, ...] ) } [ AND ... ]", value: () => 'CREATE TABLE', expected: ['', "TAG IN ('CREATE TABLE')", "TAG IN ('CREATE TABLE') AND TAG IN ('CREATE TABLE')"] },
    { label: 'semicolon statements', input: 'sql_statement [; ...]', value: (_, { index }) => `s${index + 1}`, expected: ['', 's1', 's1; s2'] },
    { label: 'optional punctuation preserved', input: '[ ( arg [, ...] ) ]', optional: true, value: (_, { index }) => `a${index + 1}`, expected: ['()', '(a1)', '(a1, a2)'] },
];
for (const fixture of fixtures) for (const count of [0, 1, 2]) {
    check(`isolated 0/1/2 oracle: ${fixture.label}, count=${count}`, () => assert.equal(fixtureExpansion(fixture.input, { ...fixture, count }), fixture.expected[count]));
}
for (const input of ['[ item [, ...] ]', '[ { keyword value } [...] ]', "[ 'label' [, ...] ]"]) {
    check(`detect redundant pure-LOOP optional: ${input}`, () => assert.equal(pureLoopOptionals(new SNFParser().parse(input)).length, 1));
}
for (const input of ['[ ORDER BY item [, ...] ]', '[ ( arg [, ...] ) ]', '[ WITH ( option [, ...] ) ]', '[ AS body ]']) {
    check(`keep meaningful optional: ${input}`, () => assert.equal(pureLoopOptionals(new SNFParser().parse(input)).length, 0));
}
for (const bad of ['SELECT [ value', 'SELECT { A | B', 'SELECT value [....]']) {
    check(`canonical parser rejects malformed input: ${bad}`, () => assert.throws(() => parser.parse(bad)));
}
for (const ending of ['\n', '\r\n', '\r']) {
    const input = ['# source', '# CASE A', 'SELECT [ value ]', ''].join(ending);
    check(`physical round-trip ${JSON.stringify(ending)}`, () => assert.equal(parser.parse(input).lines.map(line => line.content + line.ending).join(''), input));
}
const header = '# https://www.postgresql.org/docs/18/sql-select.html\n\n';
check('ordinary inputs and external statement declarations need no inventory', () => {
    const result = checkDocument('fixture.snf', `${header}SELECT value_expression body query_statement\n\n# STATEMENT query_statement\n`);
    assert.deepEqual(result.errors, []);
    assert.deepEqual(result.record.externalStatements, ['query_statement']);
});
check('unreachable declared helper fails', () => assert.ok(checkDocument('fixture.snf', `${header}SELECT input\n\n# WHERE unused\nvalue\n`).errors.some(error => error.includes('unreachable helper'))));
check('unowned continuation fails', () => assert.ok(checkDocument('fixture.snf', `${header}SELECT input\n\nSELECT another\n`).errors.some(error => error.includes('unowned continuation'))));
check('raw parentheses cannot stand in for a grouped repeated member', () => assert.ok(checkDocument('fixture.snf', `${header}VALUES ( value_expression [, ...] ) [, ...]\n`).errors.some(error => error.includes('no single bound member'))));
check('pure optional gate is explicitly scoped to changed files', () => {
    const input = `${header}SELECT [ item [, ...] ]\n`;
    assert.deepEqual(checkDocument('fixture.snf', input).errors, []);
    assert.ok(checkDocument('fixture.snf', input, { checkPureLoopOptionals: true }).errors.some(error => error.includes('redundant pure-LOOP optional')));
});
console.log(JSON.stringify({ checks, passed: true, parserRevision, oracleFixtures: fixtures.length, oracleExpansions: fixtures.length * 3, scope: 'Retained production shapes, actual walker binding, isolated 0/1/2 expansion fixtures, and validator/parser negative cases. No production SQL generator or database execution.' }, null, 2));
