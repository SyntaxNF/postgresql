// Structural regression assertions over the real parser's production blocks.
// These are NOT a PostgreSQL SQL parser or database execution tests.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
if (!process.env.SNF_PARSER_MODULE) throw new Error('Set SNF_PARSER_MODULE; see docs/validation.md');
const { SNFDocumentParser, exchangeQuoteNode, exchangeLoopNode } = await import(pathToFileURL(path.resolve(process.env.SNF_PARSER_MODULE)).href);
const parser = new SNFDocumentParser();
let checks = 0;
const source = file => fs.readFileSync(path.join(root, file), 'utf8');
function has(file, expression, label) { assert.match(source(file), expression, `${file}: ${label}`); checks++; }
function lacks(file, expression, label) { assert.doesNotMatch(source(file), expression, `${file}: ${label}`); checks++; }
function production(file, name) {
    const document = parser.parse(source(file)); let active = false, contents = [];
    for (const block of document.blocks) {
        const match = /^# (?:CASE|WHERE|ONEOFIS|PARTOFIS|STATEMENT) (.+)$/m.exec(block.comment);
        if (match) active = match[1].split(/\s*,\s*/).includes(name);
        if (active) contents.push(block.content);
    }
    assert.ok(contents.length, `${file}: missing ${name}`); return contents.join('\n\n');
}
function prodHas(file, name, expression) { assert.match(production(file,name),expression,`${file}: ${name}`); checks++; }
function prodLacks(file, name, expression) { assert.doesNotMatch(production(file,name),expression,`${file}: ${name}`); checks++; }
for (const file of ['create/function.snf','create/procedure.snf']) {
    has(file,/\(\n    \[ argument_definition \[, \.\.\.\] \]/,'zero parameters');
    prodHas(file,'routine_body_clause',/AS 'definition'/);
    prodHas(file,'routine_body_clause',/AS 'object_file', 'link_symbol'/);
    prodHas(file,'routine_body_clause',/BEGIN ATOMIC\n    sql_statement \[; \.\.\.\] ;\nEND/);
    has(file,/# STATEMENT sql_statement\s*$/,'explicit opaque body statement contract');
    lacks(file,/\[ AS pg_definition \]/,'removed ambiguous independent bodies');
}
prodHas('create/function.snf','routine_body_clause',/RETURN value_expression/);
for (const file of ['alter/function.snf','alter/procedure.snf','alter/routine.snf','drop/function.snf','drop/procedure.snf','drop/routine.snf']) has(file,/\[ \( \[ arg \[, \.\.\.\] \] \) \]/,'explicit empty signature');
for (const file of ['alter/function.snf','alter/procedure.snf','alter/routine.snf']) {
    has(file,/set_parameter_clause \[\.\.\.\]/,'SET repeats without SQL commas');
    lacks(file,/SET config_parameter.*\[, \.\.\.\]/,'no comma-separated SET actions');
}
for (const file of ['create/table.snf','create/foreign-table.snf']) prodHas(file,'NORMAL',/\(\n    \[ \{/);
prodHas('create/type.snf','ENUM',/\[ 'label' \[, \.\.\.\] \]/);
prodHas('create/type.snf','COMPOSITE',/\[ attribute_definition \[, \.\.\.\] \]/);
prodHas('create/aggregate.snf','NORMAL',/\{ \* \| argument_definition/);
for (const file of ['alter/aggregate.snf','alter/extension.snf','drop/aggregate.snf','other/comment.snf','other/security-label.snf']) has(file,/\[ arg \[, \.\.\.\] \]\nORDER BY/,'ordered set permits zero direct args');
for (const name of ['NAMED_IF_NOT_EXISTS','AUTHORIZATION_IF_NOT_EXISTS']) prodLacks('create/schema.snf',name,/create_statement/);
prodHas('create/schema.snf','NAMED',/\[ create_statement \[\.\.\.\] \]/);
prodHas('create/schema.snf','AUTHORIZATION',/CREATE SCHEMA AUTHORIZATION role/);
for (const name of ['FROM_SQL','TO_SQL','BOTH']) assert.ok(production('create/transform.snf',name)),checks++;
has('create/operator-class.snf',/\{ operator_definition \| function_definition \| STORAGE type \} \[, \.\.\.\]/,'STORAGE comma-list member');
prodLacks('alter/publication.snf','publication_drop_object',/WHERE|colname/);
prodHas('alter/publication.snf','table_target',/^\[ ONLY \] table \[ \* \]$/);
prodHas('create/publication.snf','table_definition',/table \[ \* \] \[ \( colname/);
prodHas('alter/subscription.snf','publication_options',/COPY_DATA/);
prodHas('alter/table.snf','action',/\[ column_constraint_definition \[\.\.\.\] \]/);
prodHas('alter/table.snf','action',/DISABLE TRIGGER \{ trigger \| ALL \| USER \}/);
prodLacks('alter/table.snf','on_update_action',/colname/);
prodHas('alter/table.snf','identity_option',/INCREMENT \[ BY \] increment/);
for (const file of ['alter/foreign-data.snf','alter/server.snf','alter/user-mapping.snf']) {
    prodHas(file,'option_action',/\[ ADD \| SET \] option 'value'/);
    prodHas(file,'option_action',/DROP option$/);
}
has('drop/database.snf',/\[ \[ WITH \] \( FORCE \) \]/,'FORCE requires parentheses');
for (const file of ['other/analyze.snf','other/vacuum.snf']) has(file,/\[ table_expression \[, \.\.\.\] \]/,'whole database supported');
has('other/call.snf',/\[ value_expression \[, \.\.\.\] \]/,'zero args');
for (const file of ['auth/grant.snf','auth/revoke.snf']) {
    prodHas(file,'routine_definition',/\{ FUNCTION \| PROCEDURE \| ROUTINE \}\n    \{ routine \[ \( \[ arg/);
}
for (const file of ['other/lock.snf','other/truncate.snf']) has(file,/\{ \[ ONLY \] name \[ \* \] \} \[, \.\.\.\s*\]/,'ONLY belongs to each target');
prodLacks('other/copy.snf','copy_from_options',/FORCE_QUOTE/);
prodLacks('other/copy.snf','copy_to_options',/FREEZE|FORCE_NOT_NULL|FORCE_NULL|ON_ERROR|REJECT_LIMIT|MATCH/);
prodHas('other/copy.snf','copy_from_options',/ON_ERROR \{ STOP \| IGNORE \}/);
prodHas('other/copy.snf','copy_from_options',/LOG_VERBOSITY \{ DEFAULT \| VERBOSE \| SILENT \}/);
prodHas('other/explain.snf','explainable_statement',/CREATE TABLE AS/);
has('other/do.snf',/code_literal/,'DO takes quoted code rather than an executable statement');
has('other/set.snf',/\{ value \| 'value' \} \[, \.\.\.\]/,'SET lists');
for (const file of ['query/select.snf','query/select-into.snf','query/delete.snf','query/update.snf']) {
    prodLacks(file,'from_expression',/colname \[ type \]/);
    prodHas(file,'from_expression',/colname type \[ COLLATE collate \]/);
    prodLacks(file,'joined_expression',/^table$|^function/m);
    prodLacks(file,'from_expression',/\( from_expression \)/);
    prodHas(file,'from_expression',/\( joined_expression \)/);
    prodHas(file,'joined_expression',/from_expression CROSS JOIN from_expression/);
}
for (const file of ['query/select.snf','query/select-into.snf']) {
    prodLacks(file,'frame_start',/UNBOUNDED FOLLOWING/);
    prodLacks(file,'frame_end',/UNBOUNDED PRECEDING/);
    prodHas(file,'frame_expression',/\{ UNBOUNDED PRECEDING \| offset PRECEDING \| CURRENT ROW \}/);
}
for (const file of ['transaction/begin.snf','transaction/start-transaction.snf','transaction/set-transaction.snf']) prodHas(file,'transaction_mode',/\{ READ WRITE \| READ ONLY \}/);
// Use the real optional walkers to verify each composite list repeats the whole item.
function repeats(file, name, expression) {
    const document = parser.parse(production(file,name)); const repeated = [];
    const visit = node => { if (node.type === 'lo') repeated.push(node.children?.[0]?.raw ?? ''); node.children?.forEach(visit); };
    for (const block of document.blocks) visit(exchangeLoopNode(exchangeQuoteNode(block.ast)));
    assert.ok(repeated.some(raw => expression.test(raw)),`${file}:${name} lacks whole-item loop ${expression}`); checks++;
}
for (const file of ['auth/grant.snf','auth/revoke.snf']) repeats(file,'COLUMN',/SELECT.*colname/s);
for (const file of ['query/select.snf','query/select-into.snf']) {
    const entry = file.includes('select-into') ? null : 'SELECT';
    if (entry) repeats(file,entry,/window AS/);
    else has(file,/WINDOW \{ window AS \( window_expression \) \} \[, \.\.\.\]/,'repeat complete window definition');
}
for (const file of ['query/insert.snf','query/update.snf','query/delete.snf','query/merge.snf']) has(file,/\{ \{ OLD \| NEW \} AS output_alias \} \[, \.\.\.\]/,'repeat complete RETURNING alias assignment');
prodHas('query/insert.snf','conflict_target',/\{ \{ colname \| \( col_expression \) \} \[ COLLATE collate \] \[ opclass \] \} \[, \.\.\.\]/);
has('query/values.snf',/VALUES \{ \( value_expression \[, \.\.\.\] \) \} \[, \.\.\.\]/,'repeat complete VALUES row');
has('query/insert.snf',/VALUES \{ \( \{ value_expression \| DEFAULT \} \[, \.\.\.\] \) \} \[, \.\.\.\]/,'repeat complete INSERT row');
repeats('create/table.snf','table_constraint_definition',/COLLATE.*WITH operator/s);
repeats('alter/table.snf','table_constraint_definition',/exclude_column_expression WITH operator/);
repeats('alter/table.snf','action',/attribute_parameter = value/);
repeats('alter/table.snf','unique_index_options',/storage_parameter \[= value\]/);
repeats('alter/table.snf','exclude_column_expression',/opclass_parameter = value/);
for (const bad of ['SELECT [ value','SELECT { A | B','SELECT value [....]']) {
    assert.throws(()=>parser.parse(bad),undefined,`actual parser rejects ${bad}`);checks++;
}
for (const ending of ['\n','\r\n','\r']) {
    const input=['# source','# CASE A','SELECT [ value ]',''].join(ending);
    const result=parser.parse(input);
    assert.equal(result.lines.map(l=>l.content+l.ending).join(''),input);checks++;
}
console.log(JSON.stringify({checks,passed:true,scope:'Production-shape regressions and real-parser malformed/round-trip fixtures; no SQL execution'},null,2));
