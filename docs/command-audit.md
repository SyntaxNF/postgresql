# 逐命令结构审阅表

基线 PostgreSQL 18；日期 2026-09-30。状态口径及统一输入边界见 [coverage](coverage.md)。每一项均核对主 synopsis；本表不等同于完整 SQL 或执行验证。

## ABORT

- 文件：[transaction/abort.snf](../transaction/abort.snf)；[官方来源](https://www.postgresql.org/docs/18/sql-abort.html)
- 状态：`synopsis-structured`；分支：`IMPLICIT`
- 修正：本轮未发现主 synopsis 结构差异
- 边界：Identifiers, literals, data types and parameter values are caller-supplied leaves; this row certifies command synopsis structure, not catalog/permission/execution validity.

## ALTER AGGREGATE

- 文件：[alter/aggregate.snf](../alter/aggregate.snf)；[官方来源](https://www.postgresql.org/docs/18/sql-alteraggregate.html)
- 状态：`synopsis-structured`；分支：`RENAME`, `OWNER`, `SCHEMA`
- 修正：Fix ordered-set signature optional direct arguments and undefined orders node
- 边界：Identifiers, literals, data types and parameter values are caller-supplied leaves; this row certifies command synopsis structure, not catalog/permission/execution validity.

## ALTER COLLATION

- 文件：[alter/collation.snf](../alter/collation.snf)；[官方来源](https://www.postgresql.org/docs/18/sql-altercollation.html)
- 状态：`synopsis-structured`；分支：`REFRESH`, `RENAME`, `OWNER`, `SCHEMA`
- 修正：本轮未发现主 synopsis 结构差异
- 边界：Identifiers, literals, data types and parameter values are caller-supplied leaves; this row certifies command synopsis structure, not catalog/permission/execution validity.

## ALTER CONVERSION

- 文件：[alter/conversion.snf](../alter/conversion.snf)；[官方来源](https://www.postgresql.org/docs/18/sql-alterconversion.html)
- 状态：`synopsis-structured`；分支：`RENAME`, `OWNER`, `SCHEMA`
- 修正：本轮未发现主 synopsis 结构差异
- 边界：Identifiers, literals, data types and parameter values are caller-supplied leaves; this row certifies command synopsis structure, not catalog/permission/execution validity.

## ALTER DATABASE

- 文件：[alter/database.snf](../alter/database.snf)；[官方来源](https://www.postgresql.org/docs/18/sql-alterdatabase.html)
- 状态：`synopsis-structured`；分支：`OPTIONS`, `REFRESH_COLLATION`, `SET_CURRENT`, `SET`, `RESET`, `RESET_ALL`, `RENAME`, `OWNER`, `TABLESPACE`
- 修正：本轮未发现主 synopsis 结构差异
- 边界：Identifiers, literals, data types and parameter values are caller-supplied leaves; this row certifies command synopsis structure, not catalog/permission/execution validity.

## ALTER DEFAULT PRIVILEGES

- 文件：[alter/privileges.snf](../alter/privileges.snf)；[官方来源](https://www.postgresql.org/docs/18/sql-alterdefaultprivileges.html)
- 状态：`partial-context`；分支：`IMPLICIT`
- 修正：本轮未发现主 synopsis 结构差异
- 边界：Privilege/object-kind restrictions, PUBLIC versus role membership/grant option, grantor authority and inherited membership require semantic validation.

## ALTER DOMAIN

- 文件：[alter/domain.snf](../alter/domain.snf)；[官方来源](https://www.postgresql.org/docs/18/sql-alterdomain.html)
- 状态：`synopsis-structured`；分支：`ADD_CONSTRAINT`, `DROP_DEFAULT`, `DROP_NOT_NULL`, `DROP_CONSTRAINT`, `RENAME_CONSTRAINT`, `VALIDATE_CONSTRAINT`, `SET_DEFAULT`, `SET_NOT_NULL`, `RENAME`, `OWNER`, `SCHEMA`
- 修正：本轮未发现主 synopsis 结构差异
- 边界：Identifiers, literals, data types and parameter values are caller-supplied leaves; this row certifies command synopsis structure, not catalog/permission/execution validity.

## ALTER EVENT TRIGGER

- 文件：[alter/event-trigger.snf](../alter/event-trigger.snf)；[官方来源](https://www.postgresql.org/docs/18/sql-altereventtrigger.html)
- 状态：`synopsis-structured`；分支：`ENABLE`, `DISABLE`, `RENAME`, `OWNER`
- 修正：本轮未发现主 synopsis 结构差异
- 边界：Identifiers, literals, data types and parameter values are caller-supplied leaves; this row certifies command synopsis structure, not catalog/permission/execution validity.

## ALTER EXTENSION

- 文件：[alter/extension.snf](../alter/extension.snf)；[官方来源](https://www.postgresql.org/docs/18/sql-alterextension.html)
- 状态：`synopsis-structured`；分支：`ADD`, `DROP`, `UPDATE`, `SCHEMA`
- 修正：Fix ordered-set signature optional direct arguments and undefined orders node; Represent explicit empty argument signature separately from omitted signature
- 边界：Identifiers, literals, data types and parameter values are caller-supplied leaves; this row certifies command synopsis structure, not catalog/permission/execution validity.

## ALTER FOREIGN DATA WRAPPER

- 文件：[alter/foreign-data.snf](../alter/foreign-data.snf)；[官方来源](https://www.postgresql.org/docs/18/sql-alterforeigndatawrapper.html)
- 状态：`synopsis-structured`；分支：`OPTIONS`, `RENAME`, `OWNER`
- 修正：Separate value-bearing ADD/SET from valueless DROP
- 边界：Identifiers, literals, data types and parameter values are caller-supplied leaves; this row certifies command synopsis structure, not catalog/permission/execution validity.

## ALTER FOREIGN TABLE

- 文件：[alter/foreign-table.snf](../alter/foreign-table.snf)；[官方来源](https://www.postgresql.org/docs/18/sql-alterforeigntable.html)
- 状态：`partial-context`；分支：`ACTIONS`, `ADD_COLUMN`, `DROP_COLUMN`, `SET_OPTIONS`, `RENAME_COLUMN`, `RENAME`, `SET_SCHEMA`
- 修正：Normalize continuation indentation to four-space multiples
- 边界：Constraint applicability/enforcement, partition bounds, temporal PERIOD/WITHOUT OVERLAPS and identity/sequence rules are not a complete semantic model.

## ALTER FUNCTION

- 文件：[alter/function.snf](../alter/function.snf)；[官方来源](https://www.postgresql.org/docs/18/sql-alterfunction.html)
- 状态：`partial-context`；分支：`OPTIONS`, `RENAME`, `OWNER`, `SCHEMA`, `DEPENDS_EXTENSION`
- 修正：Represent explicit empty argument signature separately from omitted signature; Correct multiple SET clause separators; Correct multiple RESET clause separators; Provide structured repeated configuration actions
- 边界：At least one action must be selected; type/language-specific attributes and duplicate/reset parameter interactions are context restrictions.

## ALTER GROUP

- 文件：[alter/group.snf](../alter/group.snf)；[官方来源](https://www.postgresql.org/docs/18/sql-altergroup.html)
- 状态：`synopsis-structured`；分支：`ADD_USER`, `DROP_USER`, `RENAME`
- 修正：本轮未发现主 synopsis 结构差异
- 边界：Identifiers, literals, data types and parameter values are caller-supplied leaves; this row certifies command synopsis structure, not catalog/permission/execution validity.

## ALTER INDEX

- 文件：[alter/index.snf](../alter/index.snf)；[官方来源](https://www.postgresql.org/docs/18/sql-alterindex.html)
- 状态：`synopsis-structured`；分支：`SET_STATISTICS`, `RENAME`, `SET_OPTIONS`, `RESET_OPTIONS`, `TABLESPACE`, `ALL_TABLESPACE`, `ATTACH_PARTITION`, `DEPENDS_EXTENSION`
- 修正：本轮未发现主 synopsis 结构差异
- 边界：Identifiers, literals, data types and parameter values are caller-supplied leaves; this row certifies command synopsis structure, not catalog/permission/execution validity.

## ALTER LANGUAGE

- 文件：[alter/language.snf](../alter/language.snf)；[官方来源](https://www.postgresql.org/docs/18/sql-alterlanguage.html)
- 状态：`synopsis-structured`；分支：`RENAME`, `OWNER`
- 修正：本轮未发现主 synopsis 结构差异
- 边界：Identifiers, literals, data types and parameter values are caller-supplied leaves; this row certifies command synopsis structure, not catalog/permission/execution validity.

## ALTER LARGE OBJECT

- 文件：[alter/large-object.snf](../alter/large-object.snf)；[官方来源](https://www.postgresql.org/docs/18/sql-alterlargeobject.html)
- 状态：`synopsis-structured`；分支：`IMPLICIT`
- 修正：本轮未发现主 synopsis 结构差异
- 边界：Identifiers, literals, data types and parameter values are caller-supplied leaves; this row certifies command synopsis structure, not catalog/permission/execution validity.

## ALTER MATERIALIZED VIEW

- 文件：[alter/materialized-view.snf](../alter/materialized-view.snf)；[官方来源](https://www.postgresql.org/docs/18/sql-altermaterializedview.html)
- 状态：`synopsis-structured`；分支：`OPTIONS`, `RENAME_COLUMN`, `RENAME`, `SCHEMA`, `ALL_TABLESPACE`, `DEPENDS_EXTENSION`
- 修正：本轮未发现主 synopsis 结构差异
- 边界：Identifiers, literals, data types and parameter values are caller-supplied leaves; this row certifies command synopsis structure, not catalog/permission/execution validity.

## ALTER OPERATOR

- 文件：[alter/operator.snf](../alter/operator.snf)；[官方来源](https://www.postgresql.org/docs/18/sql-alteroperator.html)
- 状态：`synopsis-structured`；分支：`OPTIONS`, `OWNER`, `SCHEMA`
- 修正：本轮未发现主 synopsis 结构差异
- 边界：Identifiers, literals, data types and parameter values are caller-supplied leaves; this row certifies command synopsis structure, not catalog/permission/execution validity.

## ALTER OPERATOR CLASS

- 文件：[alter/operator-class.snf](../alter/operator-class.snf)；[官方来源](https://www.postgresql.org/docs/18/sql-alteropclass.html)
- 状态：`synopsis-structured`；分支：`RENAME`, `OWNER`, `SCHEMA`
- 修正：本轮未发现主 synopsis 结构差异
- 边界：Identifiers, literals, data types and parameter values are caller-supplied leaves; this row certifies command synopsis structure, not catalog/permission/execution validity.

## ALTER OPERATOR FAMILY

- 文件：[alter/operator-family.snf](../alter/operator-family.snf)；[官方来源](https://www.postgresql.org/docs/18/sql-alteropfamily.html)
- 状态：`synopsis-structured`；分支：`ADD`, `DROP`, `RENAME`, `OWNER`, `SCHEMA`
- 修正：本轮未发现主 synopsis 结构差异
- 边界：Identifiers, literals, data types and parameter values are caller-supplied leaves; this row certifies command synopsis structure, not catalog/permission/execution validity.

## ALTER POLICY

- 文件：[alter/policy.snf](../alter/policy.snf)；[官方来源](https://www.postgresql.org/docs/18/sql-alterpolicy.html)
- 状态：`synopsis-structured`；分支：`OPTIONS`, `RENAME`
- 修正：本轮未发现主 synopsis 结构差异
- 边界：Identifiers, literals, data types and parameter values are caller-supplied leaves; this row certifies command synopsis structure, not catalog/permission/execution validity.

## ALTER PROCEDURE

- 文件：[alter/procedure.snf](../alter/procedure.snf)；[官方来源](https://www.postgresql.org/docs/18/sql-alterprocedure.html)
- 状态：`partial-context`；分支：`OPTIONS`, `RENAME`, `OWNER`, `SCHEMA`, `DEPENDS_EXTENSION`
- 修正：Represent explicit empty argument signature separately from omitted signature; Correct multiple SET clause separators; Correct multiple RESET clause separators; Provide structured repeated configuration actions
- 边界：At least one action must be selected; type/language-specific attributes and duplicate/reset parameter interactions are context restrictions.

## ALTER PUBLICATION

- 文件：[alter/publication.snf](../alter/publication.snf)；[官方来源](https://www.postgresql.org/docs/18/sql-alterpublication.html)
- 状态：`partial-context`；分支：`ADD`, `DROP`, `RENAME`, `SET_TABLES`, `SET_OPTIONS`, `OWNER`
- 修正：Remove recursive table identifier helper; support grouped tables/schema lists; DROP excludes row filters/column lists
- 边界：Object kind, clause combination, column lists, nested statement context and catalog-dependent restrictions require caller/PostgreSQL checks.

## ALTER ROLE

- 文件：[alter/role.snf](../alter/role.snf)；[官方来源](https://www.postgresql.org/docs/18/sql-alterrole.html)
- 状态：`synopsis-structured`；分支：`OPTIONS`, `RENAME`, `SET_CURRENT`, `SET`, `RESET`, `RESET_ALL`
- 修正：本轮未发现主 synopsis 结构差异
- 边界：Identifiers, literals, data types and parameter values are caller-supplied leaves; this row certifies command synopsis structure, not catalog/permission/execution validity.

## ALTER ROUTINE

- 文件：[alter/routine.snf](../alter/routine.snf)；[官方来源](https://www.postgresql.org/docs/18/sql-alterroutine.html)
- 状态：`partial-context`；分支：`OPTIONS`, `RENAME`, `OWNER`, `SCHEMA`, `DEPENDS_EXTENSION`
- 修正：Represent explicit empty argument signature separately from omitted signature; Correct multiple SET clause separators; Correct multiple RESET clause separators; Provide structured repeated configuration actions
- 边界：At least one action must be selected; type/language-specific attributes and duplicate/reset parameter interactions are context restrictions.

## ALTER RULE

- 文件：[alter/rule.snf](../alter/rule.snf)；[官方来源](https://www.postgresql.org/docs/18/sql-alterrule.html)
- 状态：`synopsis-structured`；分支：`IMPLICIT`
- 修正：本轮未发现主 synopsis 结构差异
- 边界：Identifiers, literals, data types and parameter values are caller-supplied leaves; this row certifies command synopsis structure, not catalog/permission/execution validity.

## ALTER SCHEMA

- 文件：[alter/schema.snf](../alter/schema.snf)；[官方来源](https://www.postgresql.org/docs/18/sql-alterschema.html)
- 状态：`synopsis-structured`；分支：`RENAME`, `OWNER`
- 修正：本轮未发现主 synopsis 结构差异
- 边界：Identifiers, literals, data types and parameter values are caller-supplied leaves; this row certifies command synopsis structure, not catalog/permission/execution validity.

## ALTER SEQUENCE

- 文件：[alter/sequence.snf](../alter/sequence.snf)；[官方来源](https://www.postgresql.org/docs/18/sql-altersequence.html)
- 状态：`synopsis-structured`；分支：`OPTIONS`, `LOGGING`, `RENAME`, `OWNER`, `SCHEMA`
- 修正：本轮未发现主 synopsis 结构差异
- 边界：Identifiers, literals, data types and parameter values are caller-supplied leaves; this row certifies command synopsis structure, not catalog/permission/execution validity.

## ALTER SERVER

- 文件：[alter/server.snf](../alter/server.snf)；[官方来源](https://www.postgresql.org/docs/18/sql-alterserver.html)
- 状态：`synopsis-structured`；分支：`OPTIONS`, `RENAME`, `OWNER`
- 修正：Separate value-bearing ADD/SET from valueless DROP
- 边界：Identifiers, literals, data types and parameter values are caller-supplied leaves; this row certifies command synopsis structure, not catalog/permission/execution validity.

## ALTER STATISTICS

- 文件：[alter/statistics.snf](../alter/statistics.snf)；[官方来源](https://www.postgresql.org/docs/18/sql-alterstatistics.html)
- 状态：`synopsis-structured`；分支：`RENAME`, `TARGET`, `SCHEMA`, `OWNER`
- 修正：本轮未发现主 synopsis 结构差异
- 边界：Identifiers, literals, data types and parameter values are caller-supplied leaves; this row certifies command synopsis structure, not catalog/permission/execution validity.

## ALTER SUBSCRIPTION

- 文件：[alter/subscription.snf](../alter/subscription.snf)；[官方来源](https://www.postgresql.org/docs/18/sql-altersubscription.html)
- 状态：`partial-context`；分支：`CONNECTION`, `ENABLE`, `DISABLE`, `SET_PUBLICATION`, `ADD_PUBLICATION`, `DROP_PUBLICATION`, `REFRESH_PUBLICATION`, `SKIP`, `OPTIONS`, `RENAME`, `OWNER`
- 修正：Add implicit-refresh COPY_DATA to SET/ADD/DROP PUBLICATION options; Require nonempty implicit refresh options
- 边界：Object kind, clause combination, column lists, nested statement context and catalog-dependent restrictions require caller/PostgreSQL checks.

## ALTER SYSTEM

- 文件：[alter/system.snf](../alter/system.snf)；[官方来源](https://www.postgresql.org/docs/18/sql-altersystem.html)
- 状态：`synopsis-structured`；分支：`SET`, `RESET`, `RESET_ALL`
- 修正：Add comma-separated configuration values
- 边界：Identifiers, literals, data types and parameter values are caller-supplied leaves; this row certifies command synopsis structure, not catalog/permission/execution validity.

## ALTER TABLE

- 文件：[alter/table.snf](../alter/table.snf)；[官方来源](https://www.postgresql.org/docs/18/sql-altertable.html)
- 状态：`partial-context`；分支：`OPTIONS`, `RENAME_COLUMN`, `RENAME_CONSTRAINT`, `RENAME`, `ATTACH_PARTITION`, `DETACH_PARTITION`, `SCHEMA`, `ALL_TABLESPACE`
- 修正：Permit ADD COLUMN without constraints; Require trigger target (upstream synopsis brackets overgeneralize required server target); Expand identity sequence-option structure; Keep subset SET NULL/DEFAULT column list only on DELETE; Define allowed ALTER identity sequence parameters; Explicit whole-item grouping for composite repetitions; verified with the real parser loop walker
- 边界：Constraint applicability/enforcement, partition bounds, temporal PERIOD/WITHOUT OVERLAPS and identity/sequence rules are not a complete semantic model.

## ALTER TABLESPACE

- 文件：[alter/tablespace.snf](../alter/tablespace.snf)；[官方来源](https://www.postgresql.org/docs/18/sql-altertablespace.html)
- 状态：`synopsis-structured`；分支：`RENAME`, `SET_OPTIONS`, `RESET_OPTIONS`, `OWNER`
- 修正：Require value assignment for tablespace options
- 边界：Identifiers, literals, data types and parameter values are caller-supplied leaves; this row certifies command synopsis structure, not catalog/permission/execution validity.

## ALTER TEXT SEARCH CONFIGURATION

- 文件：[alter/text-search-configuration.snf](../alter/text-search-configuration.snf)；[官方来源](https://www.postgresql.org/docs/18/sql-altertsconfig.html)
- 状态：`synopsis-structured`；分支：`ADD_MAPPING`, `ALTER_MAPPING`, `REPLACE_DICTIONARY`, `REPLACE_MAPPING`, `DROP_MAPPING`, `RENAME`, `OWNER`, `SCHEMA`
- 修正：本轮未发现主 synopsis 结构差异
- 边界：Identifiers, literals, data types and parameter values are caller-supplied leaves; this row certifies command synopsis structure, not catalog/permission/execution validity.

## ALTER TEXT SEARCH DICTIONARY

- 文件：[alter/text-search-dictionary.snf](../alter/text-search-dictionary.snf)；[官方来源](https://www.postgresql.org/docs/18/sql-altertsdictionary.html)
- 状态：`synopsis-structured`；分支：`OPTIONS`, `RENAME`, `OWNER`, `SCHEMA`
- 修正：本轮未发现主 synopsis 结构差异
- 边界：Identifiers, literals, data types and parameter values are caller-supplied leaves; this row certifies command synopsis structure, not catalog/permission/execution validity.

## ALTER TEXT SEARCH PARSER

- 文件：[alter/text-search-parser.snf](../alter/text-search-parser.snf)；[官方来源](https://www.postgresql.org/docs/18/sql-altertsparser.html)
- 状态：`synopsis-structured`；分支：`RENAME`, `SCHEMA`
- 修正：本轮未发现主 synopsis 结构差异
- 边界：Identifiers, literals, data types and parameter values are caller-supplied leaves; this row certifies command synopsis structure, not catalog/permission/execution validity.

## ALTER TEXT SEARCH TEMPLATE

- 文件：[alter/text-search-template.snf](../alter/text-search-template.snf)；[官方来源](https://www.postgresql.org/docs/18/sql-altertstemplate.html)
- 状态：`synopsis-structured`；分支：`RENAME`, `SCHEMA`
- 修正：本轮未发现主 synopsis 结构差异
- 边界：Identifiers, literals, data types and parameter values are caller-supplied leaves; this row certifies command synopsis structure, not catalog/permission/execution validity.

## ALTER TRIGGER

- 文件：[alter/trigger.snf](../alter/trigger.snf)；[官方来源](https://www.postgresql.org/docs/18/sql-altertrigger.html)
- 状态：`synopsis-structured`；分支：`RENAME`, `DEPENDS_EXTENSION`
- 修正：本轮未发现主 synopsis 结构差异
- 边界：Identifiers, literals, data types and parameter values are caller-supplied leaves; this row certifies command synopsis structure, not catalog/permission/execution validity.

## ALTER TYPE

- 文件：[alter/type.snf](../alter/type.snf)；[官方来源](https://www.postgresql.org/docs/18/sql-altertype.html)
- 状态：`synopsis-structured`；分支：`OPTIONS`, `ADD_VALUE`, `RENAME_ATTRIBUTE`, `RENAME_VALUE`, `RENAME`, `SET_OPTIONS`, `OWNER`, `SCHEMA`
- 修正：本轮未发现主 synopsis 结构差异
- 边界：Identifiers, literals, data types and parameter values are caller-supplied leaves; this row certifies command synopsis structure, not catalog/permission/execution validity.

## ALTER USER

- 文件：[alter/user.snf](../alter/user.snf)；[官方来源](https://www.postgresql.org/docs/18/sql-alteruser.html)
- 状态：`synopsis-structured`；分支：`OPTIONS`, `RENAME`, `SET_CURRENT`, `SET`, `RESET`, `RESET_ALL`
- 修正：本轮未发现主 synopsis 结构差异
- 边界：Identifiers, literals, data types and parameter values are caller-supplied leaves; this row certifies command synopsis structure, not catalog/permission/execution validity.

## ALTER USER MAPPING

- 文件：[alter/user-mapping.snf](../alter/user-mapping.snf)；[官方来源](https://www.postgresql.org/docs/18/sql-alterusermapping.html)
- 状态：`synopsis-structured`；分支：`IMPLICIT`
- 修正：Add USER identity alias from PG18 synopsis; Separate value-bearing ADD/SET from valueless DROP
- 边界：Identifiers, literals, data types and parameter values are caller-supplied leaves; this row certifies command synopsis structure, not catalog/permission/execution validity.

## ALTER VIEW

- 文件：[alter/view.snf](../alter/view.snf)；[官方来源](https://www.postgresql.org/docs/18/sql-alterview.html)
- 状态：`synopsis-structured`；分支：`SET_DEFAULT`, `DROP_DEFAULT`, `RENAME_COLUMN`, `RENAME`, `SET_OPTIONS`, `RESET_OPTIONS`, `OWNER`, `SCHEMA`
- 修正：本轮未发现主 synopsis 结构差异
- 边界：Identifiers, literals, data types and parameter values are caller-supplied leaves; this row certifies command synopsis structure, not catalog/permission/execution validity.

## ANALYZE

- 文件：[other/analyze.snf](../other/analyze.snf)；[官方来源](https://www.postgresql.org/docs/18/sql-analyze.html)
- 状态：`partial-context`；分支：`IMPLICIT`
- 修正：Allow omitted relation list for database-wide analysis
- 边界：At least one option inside parentheses and option compatibility/value ranges require caller checks; obsolete alternative spellings are not canonical output.

## BEGIN

- 文件：[transaction/begin.snf](../transaction/begin.snf)；[官方来源](https://www.postgresql.org/docs/18/sql-begin.html)
- 状态：`partial-context`；分支：`IMPLICIT`
- 修正：Put READ WRITE / READ ONLY alternatives inside explicit SNF braces
- 边界：Transaction modes may not contradict or duplicate; execution state and snapshot validity are outside grammar.

## CALL

- 文件：[other/call.snf](../other/call.snf)；[官方来源](https://www.postgresql.org/docs/18/sql-call.html)
- 状态：`synopsis-structured`；分支：`IMPLICIT`
- 修正：Allow zero arguments
- 边界：Identifiers, literals, data types and parameter values are caller-supplied leaves; this row certifies command synopsis structure, not catalog/permission/execution validity.

## CHECKPOINT

- 文件：[other/checkpoint.snf](../other/checkpoint.snf)；[官方来源](https://www.postgresql.org/docs/18/sql-checkpoint.html)
- 状态：`synopsis-structured`；分支：`IMPLICIT`
- 修正：本轮未发现主 synopsis 结构差异
- 边界：Identifiers, literals, data types and parameter values are caller-supplied leaves; this row certifies command synopsis structure, not catalog/permission/execution validity.

## CLOSE

- 文件：[other/close.snf](../other/close.snf)；[官方来源](https://www.postgresql.org/docs/18/sql-close.html)
- 状态：`synopsis-structured`；分支：`IMPLICIT`
- 修正：本轮未发现主 synopsis 结构差异
- 边界：Identifiers, literals, data types and parameter values are caller-supplied leaves; this row certifies command synopsis structure, not catalog/permission/execution validity.

## CLUSTER

- 文件：[other/cluster.snf](../other/cluster.snf)；[官方来源](https://www.postgresql.org/docs/18/sql-cluster.html)
- 状态：`synopsis-structured`；分支：`IMPLICIT`
- 修正：本轮未发现主 synopsis 结构差异
- 边界：Identifiers, literals, data types and parameter values are caller-supplied leaves; this row certifies command synopsis structure, not catalog/permission/execution validity.

## COMMENT

- 文件：[other/comment.snf](../other/comment.snf)；[官方来源](https://www.postgresql.org/docs/18/sql-comment.html)
- 状态：`synopsis-structured`；分支：`IMPLICIT`
- 修正：Empty routine signatures and ordered-set aggregates with zero direct arguments
- 边界：Identifiers, literals, data types and parameter values are caller-supplied leaves; this row certifies command synopsis structure, not catalog/permission/execution validity.

## COMMIT

- 文件：[transaction/commit.snf](../transaction/commit.snf)；[官方来源](https://www.postgresql.org/docs/18/sql-commit.html)
- 状态：`synopsis-structured`；分支：`IMPLICIT`
- 修正：本轮未发现主 synopsis 结构差异
- 边界：Identifiers, literals, data types and parameter values are caller-supplied leaves; this row certifies command synopsis structure, not catalog/permission/execution validity.

## COMMIT PREPARED

- 文件：[transaction/commit-prepared.snf](../transaction/commit-prepared.snf)；[官方来源](https://www.postgresql.org/docs/18/sql-commit-prepared.html)
- 状态：`synopsis-structured`；分支：`IMPLICIT`
- 修正：本轮未发现主 synopsis 结构差异
- 边界：Identifiers, literals, data types and parameter values are caller-supplied leaves; this row certifies command synopsis structure, not catalog/permission/execution validity.

## COPY

- 文件：[other/copy.snf](../other/copy.snf)；[官方来源](https://www.postgresql.org/docs/18/sql-copy.html)
- 状态：`partial-context`；分支：`FROM`, `TO`
- 修正：Separate FROM/TO options; make WITH optional; enumerate format/error/log values; reject direction-incompatible options structurally
- 边界：Format-dependent option compatibility, nonempty option selection, positive REJECT_LIMIT with ON_ERROR IGNORE, and mandatory DML RETURNING are not encoded. Legacy pre-9.0 option spellings are intentionally outside canonical-generation scope.

## CREATE ACCESS METHOD

- 文件：[create/access-method.snf](../create/access-method.snf)；[官方来源](https://www.postgresql.org/docs/18/sql-create-access-method.html)
- 状态：`synopsis-structured`；分支：`IMPLICIT`
- 修正：Enumerate the documented TABLE/INDEX access-method kinds
- 边界：Identifiers, literals, data types and parameter values are caller-supplied leaves; this row certifies command synopsis structure, not catalog/permission/execution validity.

## CREATE AGGREGATE

- 文件：[create/aggregate.snf](../create/aggregate.snf)；[官方来源](https://www.postgresql.org/docs/18/sql-createaggregate.html)
- 状态：`synopsis-structured`；分支：`NORMAL`, `ORDERED_SET`, `LEGACY`
- 修正：Add zero-argument star signature; Allow ordered-set aggregates without direct arguments
- 边界：Identifiers, literals, data types and parameter values are caller-supplied leaves; this row certifies command synopsis structure, not catalog/permission/execution validity.

## CREATE CAST

- 文件：[create/cast.snf](../create/cast.snf)；[官方来源](https://www.postgresql.org/docs/18/sql-createcast.html)
- 状态：`synopsis-structured`；分支：`FUNCTION`, `BINARY`, `INOUT`
- 修正：本轮未发现主 synopsis 结构差异
- 边界：Identifiers, literals, data types and parameter values are caller-supplied leaves; this row certifies command synopsis structure, not catalog/permission/execution validity.

## CREATE COLLATION

- 文件：[create/collation.snf](../create/collation.snf)；[官方来源](https://www.postgresql.org/docs/18/sql-createcollation.html)
- 状态：`synopsis-structured`；分支：`PARAMETERS`, `COPY`
- 修正：本轮未发现主 synopsis 结构差异
- 边界：Identifiers, literals, data types and parameter values are caller-supplied leaves; this row certifies command synopsis structure, not catalog/permission/execution validity.

## CREATE CONVERSION

- 文件：[create/conversion.snf](../create/conversion.snf)；[官方来源](https://www.postgresql.org/docs/18/sql-createconversion.html)
- 状态：`synopsis-structured`；分支：`IMPLICIT`
- 修正：本轮未发现主 synopsis 结构差异
- 边界：Identifiers, literals, data types and parameter values are caller-supplied leaves; this row certifies command synopsis structure, not catalog/permission/execution validity.

## CREATE DATABASE

- 文件：[create/database.snf](../create/database.snf)；[官方来源](https://www.postgresql.org/docs/18/sql-createdatabase.html)
- 状态：`synopsis-structured`；分支：`IMPLICIT`
- 修正：Require synopsis equality before COLLATION_VERSION
- 边界：Identifiers, literals, data types and parameter values are caller-supplied leaves; this row certifies command synopsis structure, not catalog/permission/execution validity.

## CREATE DOMAIN

- 文件：[create/domain.snf](../create/domain.snf)；[官方来源](https://www.postgresql.org/docs/18/sql-createdomain.html)
- 状态：`synopsis-structured`；分支：`IMPLICIT`
- 修正：Allow domains without constraints
- 边界：Identifiers, literals, data types and parameter values are caller-supplied leaves; this row certifies command synopsis structure, not catalog/permission/execution validity.

## CREATE EVENT TRIGGER

- 文件：[create/event-trigger.snf](../create/event-trigger.snf)；[官方来源](https://www.postgresql.org/docs/18/sql-createeventtrigger.html)
- 状态：`synopsis-structured`；分支：`IMPLICIT`
- 修正：Model repeated event filter instead of arbitrary SQL expression values
- 边界：Identifiers, literals, data types and parameter values are caller-supplied leaves; this row certifies command synopsis structure, not catalog/permission/execution validity.

## CREATE EXTENSION

- 文件：[create/extension.snf](../create/extension.snf)；[官方来源](https://www.postgresql.org/docs/18/sql-createextension.html)
- 状态：`synopsis-structured`；分支：`IMPLICIT`
- 修正：本轮未发现主 synopsis 结构差异
- 边界：Identifiers, literals, data types and parameter values are caller-supplied leaves; this row certifies command synopsis structure, not catalog/permission/execution validity.

## CREATE FOREIGN DATA WRAPPER

- 文件：[create/foreign-data.snf](../create/foreign-data.snf)；[官方来源](https://www.postgresql.org/docs/18/sql-createforeigndatawrapper.html)
- 状态：`synopsis-structured`；分支：`IMPLICIT`
- 修正：本轮未发现主 synopsis 结构差异
- 边界：Identifiers, literals, data types and parameter values are caller-supplied leaves; this row certifies command synopsis structure, not catalog/permission/execution validity.

## CREATE FOREIGN TABLE

- 文件：[create/foreign-table.snf](../create/foreign-table.snf)；[官方来源](https://www.postgresql.org/docs/18/sql-createforeigntable.html)
- 状态：`partial-context`；分支：`NORMAL`, `PARTITION`
- 修正：Allow zero-column tables per PG18 synopsis; Close optional zero-column declaration list
- 边界：Constraint applicability/enforcement, partition bounds, temporal PERIOD/WITHOUT OVERLAPS and identity/sequence rules are not a complete semantic model.

## CREATE FUNCTION

- 文件：[create/function.snf](../create/function.snf)；[官方来源](https://www.postgresql.org/docs/18/sql-createfunction.html)
- 状态：`partial-sublanguage`；分支：`IMPLICIT`
- 修正：Allow zero arguments; Enumerate routine argument modes; Repeat SET clauses with whitespace, not commas; Make string/link-symbol/SQL bodies exclusive and structure SQL bodies; Represent SETOF return type modifier; Declare nested SQL statement boundary; string and procedural-language internals remain lexical
- 边界：Quoted procedural bodies and each sql_statement in BEGIN ATOMIC remain opaque. Language/body/OUT/VARIADIC/default-argument rules and required compatible option selection need caller validation.

## CREATE GROUP

- 文件：[create/group.snf](../create/group.snf)；[官方来源](https://www.postgresql.org/docs/18/sql-creategroup.html)
- 状态：`synopsis-structured`；分支：`IMPLICIT`
- 修正：本轮未发现主 synopsis 结构差异
- 边界：Identifiers, literals, data types and parameter values are caller-supplied leaves; this row certifies command synopsis structure, not catalog/permission/execution validity.

## CREATE INDEX

- 文件：[create/index.snf](../create/index.snf)；[官方来源](https://www.postgresql.org/docs/18/sql-createindex.html)
- 状态：`partial-context`；分支：`IMPLICIT`
- 修正：Require index name whenever IF NOT EXISTS is used
- 边界：CONCURRENTLY/object-kind, transaction-state and other catalog-dependent restrictions are not enforced.

## CREATE LANGUAGE

- 文件：[create/language.snf](../create/language.snf)；[官方来源](https://www.postgresql.org/docs/18/sql-createlanguage.html)
- 状态：`synopsis-structured`；分支：`IMPLICIT`
- 修正：Allow shorthand or full handler form; INLINE/VALIDATOR require HANDLER
- 边界：Identifiers, literals, data types and parameter values are caller-supplied leaves; this row certifies command synopsis structure, not catalog/permission/execution validity.

## CREATE MATERIALIZED VIEW

- 文件：[create/materialized-view.snf](../create/materialized-view.snf)；[官方来源](https://www.postgresql.org/docs/18/sql-creatematerializedview.html)
- 状态：`synopsis-structured`；分支：`IMPLICIT`
- 修正：本轮未发现主 synopsis 结构差异
- 边界：Identifiers, literals, data types and parameter values are caller-supplied leaves; this row certifies command synopsis structure, not catalog/permission/execution validity.

## CREATE OPERATOR

- 文件：[create/operator.snf](../create/operator.snf)；[官方来源](https://www.postgresql.org/docs/18/sql-createoperator.html)
- 状态：`synopsis-structured`；分支：`IMPLICIT`
- 修正：本轮未发现主 synopsis 结构差异
- 边界：Identifiers, literals, data types and parameter values are caller-supplied leaves; this row certifies command synopsis structure, not catalog/permission/execution validity.

## CREATE OPERATOR CLASS

- 文件：[create/operator-class.snf](../create/operator-class.snf)；[官方来源](https://www.postgresql.org/docs/18/sql-createopclass.html)
- 状态：`synopsis-structured`；分支：`IMPLICIT`
- 修正：Make STORAGE a comma-separated opclass item
- 边界：Identifiers, literals, data types and parameter values are caller-supplied leaves; this row certifies command synopsis structure, not catalog/permission/execution validity.

## CREATE OPERATOR FAMILY

- 文件：[create/operator-family.snf](../create/operator-family.snf)；[官方来源](https://www.postgresql.org/docs/18/sql-createopfamily.html)
- 状态：`synopsis-structured`；分支：`IMPLICIT`
- 修正：本轮未发现主 synopsis 结构差异
- 边界：Identifiers, literals, data types and parameter values are caller-supplied leaves; this row certifies command synopsis structure, not catalog/permission/execution validity.

## CREATE POLICY

- 文件：[create/policy.snf](../create/policy.snf)；[官方来源](https://www.postgresql.org/docs/18/sql-createpolicy.html)
- 状态：`synopsis-structured`；分支：`IMPLICIT`
- 修正：本轮未发现主 synopsis 结构差异
- 边界：Identifiers, literals, data types and parameter values are caller-supplied leaves; this row certifies command synopsis structure, not catalog/permission/execution validity.

## CREATE PROCEDURE

- 文件：[create/procedure.snf](../create/procedure.snf)；[官方来源](https://www.postgresql.org/docs/18/sql-createprocedure.html)
- 状态：`partial-sublanguage`；分支：`IMPLICIT`
- 修正：Allow zero arguments; Enumerate routine argument modes; Repeat SET clauses with whitespace, not commas; Make string/link-symbol/SQL bodies exclusive and structure SQL bodies; Declare nested SQL statement boundary; string and procedural-language internals remain lexical
- 边界：Quoted procedural bodies and each sql_statement in BEGIN ATOMIC remain opaque. Language/body/OUT/VARIADIC/default-argument rules and required compatible option selection need caller validation.

## CREATE PUBLICATION

- 文件：[create/publication.snf](../create/publication.snf)；[官方来源](https://www.postgresql.org/docs/18/sql-createpublication.html)
- 状态：`partial-context`；分支：`IMPLICIT`
- 修正：Remove recursive table identifier helper; support grouped tables/schema lists; DROP excludes row filters/column lists
- 边界：Object kind, clause combination, column lists, nested statement context and catalog-dependent restrictions require caller/PostgreSQL checks.

## CREATE ROLE

- 文件：[create/role.snf](../create/role.snf)；[官方来源](https://www.postgresql.org/docs/18/sql-createrole.html)
- 状态：`synopsis-structured`；分支：`IMPLICIT`
- 修正：本轮未发现主 synopsis 结构差异
- 边界：Identifiers, literals, data types and parameter values are caller-supplied leaves; this row certifies command synopsis structure, not catalog/permission/execution validity.

## CREATE RULE

- 文件：[create/rule.snf](../create/rule.snf)；[官方来源](https://www.postgresql.org/docs/18/sql-createrule.html)
- 状态：`partial-context`；分支：`IMPLICIT`
- 修正：Add single unparenthesized action statement
- 边界：Object kind, clause combination, column lists, nested statement context and catalog-dependent restrictions require caller/PostgreSQL checks.

## CREATE SCHEMA

- 文件：[create/schema.snf](../create/schema.snf)；[官方来源](https://www.postgresql.org/docs/18/sql-createschema.html)
- 状态：`partial-context`；分支：`NAMED`, `AUTHORIZATION`, `NAMED_IF_NOT_EXISTS`, `AUTHORIZATION_IF_NOT_EXISTS`
- 修正：Split named/auth-only and IF NOT EXISTS forms; make embedded elements optional only where allowed; Remove extra whitespace
- 边界：Object kind, clause combination, column lists, nested statement context and catalog-dependent restrictions require caller/PostgreSQL checks.

## CREATE SEQUENCE

- 文件：[create/sequence.snf](../create/sequence.snf)；[官方来源](https://www.postgresql.org/docs/18/sql-createsequence.html)
- 状态：`synopsis-structured`；分支：`IMPLICIT`
- 修正：本轮未发现主 synopsis 结构差异
- 边界：Identifiers, literals, data types and parameter values are caller-supplied leaves; this row certifies command synopsis structure, not catalog/permission/execution validity.

## CREATE SERVER

- 文件：[create/server.snf](../create/server.snf)；[官方来源](https://www.postgresql.org/docs/18/sql-createserver.html)
- 状态：`synopsis-structured`；分支：`IMPLICIT`
- 修正：本轮未发现主 synopsis 结构差异
- 边界：Identifiers, literals, data types and parameter values are caller-supplied leaves; this row certifies command synopsis structure, not catalog/permission/execution validity.

## CREATE STATISTICS

- 文件：[create/statistics.snf](../create/statistics.snf)；[官方来源](https://www.postgresql.org/docs/18/sql-createstatistics.html)
- 状态：`synopsis-structured`；分支：`EXPRESSION`, `KIND`
- 修正：Require name for IF NOT EXISTS; Identify the single-expression declaration; Require at least two expressions/columns in multivariate form; Enumerate PG18 statistics kinds
- 边界：Identifiers, literals, data types and parameter values are caller-supplied leaves; this row certifies command synopsis structure, not catalog/permission/execution validity.

## CREATE SUBSCRIPTION

- 文件：[create/subscription.snf](../create/subscription.snf)；[官方来源](https://www.postgresql.org/docs/18/sql-createsubscription.html)
- 状态：`partial-context`；分支：`IMPLICIT`
- 修正：本轮未发现主 synopsis 结构差异
- 边界：Object kind, clause combination, column lists, nested statement context and catalog-dependent restrictions require caller/PostgreSQL checks.

## CREATE TABLE

- 文件：[create/table.snf](../create/table.snf)；[官方来源](https://www.postgresql.org/docs/18/sql-createtable.html)
- 状态：`partial-context`；分支：`NORMAL`, `TYPE`, `PARTITION`
- 修正：Restore accepted GLOBAL/LOCAL temporary modifiers; Represent storage options and WITHOUT OIDS as alternative clauses; Allow zero-column tables per PG18 synopsis; Close optional zero-column declaration list; Keep WITHOUT OIDS scoped to table storage, not constraint index parameters; Explicit whole-item grouping for composite repetitions; verified with the real parser loop walker
- 边界：Constraint applicability/enforcement, partition bounds, temporal PERIOD/WITHOUT OVERLAPS and identity/sequence rules are not a complete semantic model.

## CREATE TABLE AS

- 文件：[create/table-as.snf](../create/table-as.snf)；[官方来源](https://www.postgresql.org/docs/18/sql-createtableas.html)
- 状态：`synopsis-structured`；分支：`IMPLICIT`
- 修正：Restore accepted GLOBAL/LOCAL temporary modifiers; Represent storage options and WITHOUT OIDS as alternative clauses; Remove independently combinable duplicate WITHOUT OIDS
- 边界：Identifiers, literals, data types and parameter values are caller-supplied leaves; this row certifies command synopsis structure, not catalog/permission/execution validity.

## CREATE TABLESPACE

- 文件：[create/tablespace.snf](../create/tablespace.snf)；[官方来源](https://www.postgresql.org/docs/18/sql-createtablespace.html)
- 状态：`synopsis-structured`；分支：`IMPLICIT`
- 修正：Require value assignment for tablespace options
- 边界：Identifiers, literals, data types and parameter values are caller-supplied leaves; this row certifies command synopsis structure, not catalog/permission/execution validity.

## CREATE TEXT SEARCH CONFIGURATION

- 文件：[create/text-search-configuration.snf](../create/text-search-configuration.snf)；[官方来源](https://www.postgresql.org/docs/18/sql-createtsconfig.html)
- 状态：`synopsis-structured`；分支：`PARSER`, `COPY`
- 修正：本轮未发现主 synopsis 结构差异
- 边界：Identifiers, literals, data types and parameter values are caller-supplied leaves; this row certifies command synopsis structure, not catalog/permission/execution validity.

## CREATE TEXT SEARCH DICTIONARY

- 文件：[create/text-search-dictionary.snf](../create/text-search-dictionary.snf)；[官方来源](https://www.postgresql.org/docs/18/sql-createtsdictionary.html)
- 状态：`synopsis-structured`；分支：`IMPLICIT`
- 修正：Allow template-only dictionary definitions
- 边界：Identifiers, literals, data types and parameter values are caller-supplied leaves; this row certifies command synopsis structure, not catalog/permission/execution validity.

## CREATE TEXT SEARCH PARSER

- 文件：[create/text-search-parser.snf](../create/text-search-parser.snf)；[官方来源](https://www.postgresql.org/docs/18/sql-createtsparser.html)
- 状态：`synopsis-structured`；分支：`IMPLICIT`
- 修正：本轮未发现主 synopsis 结构差异
- 边界：Identifiers, literals, data types and parameter values are caller-supplied leaves; this row certifies command synopsis structure, not catalog/permission/execution validity.

## CREATE TEXT SEARCH TEMPLATE

- 文件：[create/text-search-template.snf](../create/text-search-template.snf)；[官方来源](https://www.postgresql.org/docs/18/sql-createtstemplate.html)
- 状态：`synopsis-structured`；分支：`IMPLICIT`
- 修正：本轮未发现主 synopsis 结构差异
- 边界：Identifiers, literals, data types and parameter values are caller-supplied leaves; this row certifies command synopsis structure, not catalog/permission/execution validity.

## CREATE TRANSFORM

- 文件：[create/transform.snf](../create/transform.snf)；[官方来源](https://www.postgresql.org/docs/18/sql-createtransform.html)
- 状态：`synopsis-structured`；分支：`FROM_SQL`, `TO_SQL`, `BOTH`
- 修正：Add one-direction transforms documented in prose
- 边界：Identifiers, literals, data types and parameter values are caller-supplied leaves; this row certifies command synopsis structure, not catalog/permission/execution validity.

## CREATE TRIGGER

- 文件：[create/trigger.snf](../create/trigger.snf)；[官方来源](https://www.postgresql.org/docs/18/sql-createtrigger.html)
- 状态：`partial-context`；分支：`IMPLICIT`
- 修正：Allow zero trigger function arguments; Match trigger deferrability alternatives
- 边界：Object kind, clause combination, column lists, nested statement context and catalog-dependent restrictions require caller/PostgreSQL checks.

## CREATE TYPE

- 文件：[create/type.snf](../create/type.snf)；[官方来源](https://www.postgresql.org/docs/18/sql-createtype.html)
- 状态：`synopsis-structured`；分支：`COMPOSITE`, `ENUM`, `RANGE`, `FUNCTION`, `BASE`
- 修正：Allow empty composite declaration; Allow initially empty enum declaration
- 边界：Identifiers, literals, data types and parameter values are caller-supplied leaves; this row certifies command synopsis structure, not catalog/permission/execution validity.

## CREATE USER

- 文件：[create/user.snf](../create/user.snf)；[官方来源](https://www.postgresql.org/docs/18/sql-createuser.html)
- 状态：`synopsis-structured`；分支：`IMPLICIT`
- 修正：本轮未发现主 synopsis 结构差异
- 边界：Identifiers, literals, data types and parameter values are caller-supplied leaves; this row certifies command synopsis structure, not catalog/permission/execution validity.

## CREATE USER MAPPING

- 文件：[create/user-mapping.snf](../create/user-mapping.snf)；[官方来源](https://www.postgresql.org/docs/18/sql-createusermapping.html)
- 状态：`synopsis-structured`；分支：`IMPLICIT`
- 修正：Add USER identity alias from PG18 synopsis
- 边界：Identifiers, literals, data types and parameter values are caller-supplied leaves; this row certifies command synopsis structure, not catalog/permission/execution validity.

## CREATE VIEW

- 文件：[create/view.snf](../create/view.snf)；[官方来源](https://www.postgresql.org/docs/18/sql-createview.html)
- 状态：`synopsis-structured`；分支：`IMPLICIT`
- 修正：本轮未发现主 synopsis 结构差异
- 边界：Identifiers, literals, data types and parameter values are caller-supplied leaves; this row certifies command synopsis structure, not catalog/permission/execution validity.

## DEALLOCATE

- 文件：[other/deallocate.snf](../other/deallocate.snf)；[官方来源](https://www.postgresql.org/docs/18/sql-deallocate.html)
- 状态：`synopsis-structured`；分支：`IMPLICIT`
- 修正：本轮未发现主 synopsis 结构差异
- 边界：Identifiers, literals, data types and parameter values are caller-supplied leaves; this row certifies command synopsis structure, not catalog/permission/execution validity.

## DECLARE

- 文件：[other/declare.snf](../other/declare.snf)；[官方来源](https://www.postgresql.org/docs/18/sql-declare.html)
- 状态：`synopsis-structured`；分支：`IMPLICIT`
- 修正：本轮未发现主 synopsis 结构差异
- 边界：Identifiers, literals, data types and parameter values are caller-supplied leaves; this row certifies command synopsis structure, not catalog/permission/execution validity.

## DELETE

- 文件：[query/delete.snf](../query/delete.snf)；[官方来源](https://www.postgresql.org/docs/18/sql-delete.html)
- 状态：`partial-sublanguage`；分支：`IMPLICIT`
- 修正：Record function columns require type and allow COLLATE; grouped joins; Explicit whole-item grouping for composite repetitions; verified with the real parser loop walker
- 边界：Expression, subquery-result, recursive CTE, RETURNING alias, target-column/type and cross-clause restrictions require caller/PostgreSQL checks.
- 边界：FROM JSON_TABLE/XMLTABLE sublanguages are not expanded; general SQL expressions and functions remain opaque input boundaries.

## DISCARD

- 文件：[other/discard.snf](../other/discard.snf)；[官方来源](https://www.postgresql.org/docs/18/sql-discard.html)
- 状态：`synopsis-structured`；分支：`IMPLICIT`
- 修正：本轮未发现主 synopsis 结构差异
- 边界：Identifiers, literals, data types and parameter values are caller-supplied leaves; this row certifies command synopsis structure, not catalog/permission/execution validity.

## DO

- 文件：[other/do.snf](../other/do.snf)；[官方来源](https://www.postgresql.org/docs/18/sql-do.html)
- 状态：`synopsis-structured`；分支：`IMPLICIT`
- 修正：Explicit code-literal boundary, rather than a misleading executable statement placeholder
- 边界：Identifiers, literals, data types and parameter values are caller-supplied leaves; this row certifies command synopsis structure, not catalog/permission/execution validity.

## DROP ACCESS METHOD

- 文件：[drop/access-method.snf](../drop/access-method.snf)；[官方来源](https://www.postgresql.org/docs/18/sql-drop-access-method.html)
- 状态：`synopsis-structured`；分支：`IMPLICIT`
- 修正：本轮未发现主 synopsis 结构差异
- 边界：Identifiers, literals, data types and parameter values are caller-supplied leaves; this row certifies command synopsis structure, not catalog/permission/execution validity.

## DROP AGGREGATE

- 文件：[drop/aggregate.snf](../drop/aggregate.snf)；[官方来源](https://www.postgresql.org/docs/18/sql-dropaggregate.html)
- 状态：`synopsis-structured`；分支：`IMPLICIT`
- 修正：Ordered-set aggregates allow zero direct arguments; resolve order/orders helper mismatch
- 边界：Identifiers, literals, data types and parameter values are caller-supplied leaves; this row certifies command synopsis structure, not catalog/permission/execution validity.

## DROP CAST

- 文件：[drop/cast.snf](../drop/cast.snf)；[官方来源](https://www.postgresql.org/docs/18/sql-dropcast.html)
- 状态：`synopsis-structured`；分支：`IMPLICIT`
- 修正：本轮未发现主 synopsis 结构差异
- 边界：Identifiers, literals, data types and parameter values are caller-supplied leaves; this row certifies command synopsis structure, not catalog/permission/execution validity.

## DROP COLLATION

- 文件：[drop/collation.snf](../drop/collation.snf)；[官方来源](https://www.postgresql.org/docs/18/sql-dropcollation.html)
- 状态：`synopsis-structured`；分支：`IMPLICIT`
- 修正：本轮未发现主 synopsis 结构差异
- 边界：Identifiers, literals, data types and parameter values are caller-supplied leaves; this row certifies command synopsis structure, not catalog/permission/execution validity.

## DROP CONVERSION

- 文件：[drop/conversion.snf](../drop/conversion.snf)；[官方来源](https://www.postgresql.org/docs/18/sql-dropconversion.html)
- 状态：`synopsis-structured`；分支：`IMPLICIT`
- 修正：本轮未发现主 synopsis 结构差异
- 边界：Identifiers, literals, data types and parameter values are caller-supplied leaves; this row certifies command synopsis structure, not catalog/permission/execution validity.

## DROP DATABASE

- 文件：[drop/database.snf](../drop/database.snf)；[官方来源](https://www.postgresql.org/docs/18/sql-dropdatabase.html)
- 状态：`synopsis-structured`；分支：`IMPLICIT`
- 修正：Require FORCE parentheses and permit omitted WITH
- 边界：Identifiers, literals, data types and parameter values are caller-supplied leaves; this row certifies command synopsis structure, not catalog/permission/execution validity.

## DROP DOMAIN

- 文件：[drop/domain.snf](../drop/domain.snf)；[官方来源](https://www.postgresql.org/docs/18/sql-dropdomain.html)
- 状态：`synopsis-structured`；分支：`IMPLICIT`
- 修正：本轮未发现主 synopsis 结构差异
- 边界：Identifiers, literals, data types and parameter values are caller-supplied leaves; this row certifies command synopsis structure, not catalog/permission/execution validity.

## DROP EVENT TRIGGER

- 文件：[drop/event-trigger.snf](../drop/event-trigger.snf)；[官方来源](https://www.postgresql.org/docs/18/sql-dropeventtrigger.html)
- 状态：`synopsis-structured`；分支：`IMPLICIT`
- 修正：本轮未发现主 synopsis 结构差异
- 边界：Identifiers, literals, data types and parameter values are caller-supplied leaves; this row certifies command synopsis structure, not catalog/permission/execution validity.

## DROP EXTENSION

- 文件：[drop/extension.snf](../drop/extension.snf)；[官方来源](https://www.postgresql.org/docs/18/sql-dropextension.html)
- 状态：`synopsis-structured`；分支：`IMPLICIT`
- 修正：本轮未发现主 synopsis 结构差异
- 边界：Identifiers, literals, data types and parameter values are caller-supplied leaves; this row certifies command synopsis structure, not catalog/permission/execution validity.

## DROP FOREIGN DATA WRAPPER

- 文件：[drop/foreign-data.snf](../drop/foreign-data.snf)；[官方来源](https://www.postgresql.org/docs/18/sql-dropforeigndatawrapper.html)
- 状态：`synopsis-structured`；分支：`IMPLICIT`
- 修正：本轮未发现主 synopsis 结构差异
- 边界：Identifiers, literals, data types and parameter values are caller-supplied leaves; this row certifies command synopsis structure, not catalog/permission/execution validity.

## DROP FOREIGN TABLE

- 文件：[drop/foreign-table.snf](../drop/foreign-table.snf)；[官方来源](https://www.postgresql.org/docs/18/sql-dropforeigntable.html)
- 状态：`synopsis-structured`；分支：`IMPLICIT`
- 修正：本轮未发现主 synopsis 结构差异
- 边界：Identifiers, literals, data types and parameter values are caller-supplied leaves; this row certifies command synopsis structure, not catalog/permission/execution validity.

## DROP FUNCTION

- 文件：[drop/function.snf](../drop/function.snf)；[官方来源](https://www.postgresql.org/docs/18/sql-dropfunction.html)
- 状态：`synopsis-structured`；分支：`IMPLICIT`
- 修正：Allow explicitly empty argument signature
- 边界：Identifiers, literals, data types and parameter values are caller-supplied leaves; this row certifies command synopsis structure, not catalog/permission/execution validity.

## DROP GROUP

- 文件：[drop/group.snf](../drop/group.snf)；[官方来源](https://www.postgresql.org/docs/18/sql-dropgroup.html)
- 状态：`synopsis-structured`；分支：`IMPLICIT`
- 修正：本轮未发现主 synopsis 结构差异
- 边界：Identifiers, literals, data types and parameter values are caller-supplied leaves; this row certifies command synopsis structure, not catalog/permission/execution validity.

## DROP INDEX

- 文件：[drop/index.snf](../drop/index.snf)；[官方来源](https://www.postgresql.org/docs/18/sql-dropindex.html)
- 状态：`partial-context`；分支：`IMPLICIT`
- 修正：本轮未发现主 synopsis 结构差异
- 边界：CONCURRENTLY/object-kind, transaction-state and other catalog-dependent restrictions are not enforced.

## DROP LANGUAGE

- 文件：[drop/language.snf](../drop/language.snf)；[官方来源](https://www.postgresql.org/docs/18/sql-droplanguage.html)
- 状态：`synopsis-structured`；分支：`IMPLICIT`
- 修正：本轮未发现主 synopsis 结构差异
- 边界：Identifiers, literals, data types and parameter values are caller-supplied leaves; this row certifies command synopsis structure, not catalog/permission/execution validity.

## DROP MATERIALIZED VIEW

- 文件：[drop/materialized-view.snf](../drop/materialized-view.snf)；[官方来源](https://www.postgresql.org/docs/18/sql-dropmaterializedview.html)
- 状态：`synopsis-structured`；分支：`IMPLICIT`
- 修正：本轮未发现主 synopsis 结构差异
- 边界：Identifiers, literals, data types and parameter values are caller-supplied leaves; this row certifies command synopsis structure, not catalog/permission/execution validity.

## DROP OPERATOR

- 文件：[drop/operator.snf](../drop/operator.snf)；[官方来源](https://www.postgresql.org/docs/18/sql-dropoperator.html)
- 状态：`synopsis-structured`；分支：`IMPLICIT`
- 修正：本轮未发现主 synopsis 结构差异
- 边界：Identifiers, literals, data types and parameter values are caller-supplied leaves; this row certifies command synopsis structure, not catalog/permission/execution validity.

## DROP OPERATOR CLASS

- 文件：[drop/operator-class.snf](../drop/operator-class.snf)；[官方来源](https://www.postgresql.org/docs/18/sql-dropopclass.html)
- 状态：`synopsis-structured`；分支：`IMPLICIT`
- 修正：本轮未发现主 synopsis 结构差异
- 边界：Identifiers, literals, data types and parameter values are caller-supplied leaves; this row certifies command synopsis structure, not catalog/permission/execution validity.

## DROP OPERATOR FAMILY

- 文件：[drop/operator-family.snf](../drop/operator-family.snf)；[官方来源](https://www.postgresql.org/docs/18/sql-dropopfamily.html)
- 状态：`synopsis-structured`；分支：`IMPLICIT`
- 修正：本轮未发现主 synopsis 结构差异
- 边界：Identifiers, literals, data types and parameter values are caller-supplied leaves; this row certifies command synopsis structure, not catalog/permission/execution validity.

## DROP OWNED

- 文件：[drop/owned.snf](../drop/owned.snf)；[官方来源](https://www.postgresql.org/docs/18/sql-drop-owned.html)
- 状态：`synopsis-structured`；分支：`IMPLICIT`
- 修正：本轮未发现主 synopsis 结构差异
- 边界：Identifiers, literals, data types and parameter values are caller-supplied leaves; this row certifies command synopsis structure, not catalog/permission/execution validity.

## DROP POLICY

- 文件：[drop/policy.snf](../drop/policy.snf)；[官方来源](https://www.postgresql.org/docs/18/sql-droppolicy.html)
- 状态：`synopsis-structured`；分支：`IMPLICIT`
- 修正：本轮未发现主 synopsis 结构差异
- 边界：Identifiers, literals, data types and parameter values are caller-supplied leaves; this row certifies command synopsis structure, not catalog/permission/execution validity.

## DROP PROCEDURE

- 文件：[drop/procedure.snf](../drop/procedure.snf)；[官方来源](https://www.postgresql.org/docs/18/sql-dropprocedure.html)
- 状态：`synopsis-structured`；分支：`IMPLICIT`
- 修正：Allow explicitly empty argument signature
- 边界：Identifiers, literals, data types and parameter values are caller-supplied leaves; this row certifies command synopsis structure, not catalog/permission/execution validity.

## DROP PUBLICATION

- 文件：[drop/publication.snf](../drop/publication.snf)；[官方来源](https://www.postgresql.org/docs/18/sql-droppublication.html)
- 状态：`synopsis-structured`；分支：`IMPLICIT`
- 修正：本轮未发现主 synopsis 结构差异
- 边界：Identifiers, literals, data types and parameter values are caller-supplied leaves; this row certifies command synopsis structure, not catalog/permission/execution validity.

## DROP ROLE

- 文件：[drop/role.snf](../drop/role.snf)；[官方来源](https://www.postgresql.org/docs/18/sql-droprole.html)
- 状态：`synopsis-structured`；分支：`IMPLICIT`
- 修正：本轮未发现主 synopsis 结构差异
- 边界：Identifiers, literals, data types and parameter values are caller-supplied leaves; this row certifies command synopsis structure, not catalog/permission/execution validity.

## DROP ROUTINE

- 文件：[drop/routine.snf](../drop/routine.snf)；[官方来源](https://www.postgresql.org/docs/18/sql-droproutine.html)
- 状态：`synopsis-structured`；分支：`IMPLICIT`
- 修正：Allow explicitly empty argument signature
- 边界：Identifiers, literals, data types and parameter values are caller-supplied leaves; this row certifies command synopsis structure, not catalog/permission/execution validity.

## DROP RULE

- 文件：[drop/rule.snf](../drop/rule.snf)；[官方来源](https://www.postgresql.org/docs/18/sql-droprule.html)
- 状态：`synopsis-structured`；分支：`IMPLICIT`
- 修正：本轮未发现主 synopsis 结构差异
- 边界：Identifiers, literals, data types and parameter values are caller-supplied leaves; this row certifies command synopsis structure, not catalog/permission/execution validity.

## DROP SCHEMA

- 文件：[drop/schema.snf](../drop/schema.snf)；[官方来源](https://www.postgresql.org/docs/18/sql-dropschema.html)
- 状态：`synopsis-structured`；分支：`IMPLICIT`
- 修正：本轮未发现主 synopsis 结构差异
- 边界：Identifiers, literals, data types and parameter values are caller-supplied leaves; this row certifies command synopsis structure, not catalog/permission/execution validity.

## DROP SEQUENCE

- 文件：[drop/sequence.snf](../drop/sequence.snf)；[官方来源](https://www.postgresql.org/docs/18/sql-dropsequence.html)
- 状态：`synopsis-structured`；分支：`IMPLICIT`
- 修正：本轮未发现主 synopsis 结构差异
- 边界：Identifiers, literals, data types and parameter values are caller-supplied leaves; this row certifies command synopsis structure, not catalog/permission/execution validity.

## DROP SERVER

- 文件：[drop/server.snf](../drop/server.snf)；[官方来源](https://www.postgresql.org/docs/18/sql-dropserver.html)
- 状态：`synopsis-structured`；分支：`IMPLICIT`
- 修正：本轮未发现主 synopsis 结构差异
- 边界：Identifiers, literals, data types and parameter values are caller-supplied leaves; this row certifies command synopsis structure, not catalog/permission/execution validity.

## DROP STATISTICS

- 文件：[drop/statistics.snf](../drop/statistics.snf)；[官方来源](https://www.postgresql.org/docs/18/sql-dropstatistics.html)
- 状态：`synopsis-structured`；分支：`IMPLICIT`
- 修正：本轮未发现主 synopsis 结构差异
- 边界：Identifiers, literals, data types and parameter values are caller-supplied leaves; this row certifies command synopsis structure, not catalog/permission/execution validity.

## DROP SUBSCRIPTION

- 文件：[drop/subscription.snf](../drop/subscription.snf)；[官方来源](https://www.postgresql.org/docs/18/sql-dropsubscription.html)
- 状态：`synopsis-structured`；分支：`IMPLICIT`
- 修正：本轮未发现主 synopsis 结构差异
- 边界：Identifiers, literals, data types and parameter values are caller-supplied leaves; this row certifies command synopsis structure, not catalog/permission/execution validity.

## DROP TABLE

- 文件：[drop/table.snf](../drop/table.snf)；[官方来源](https://www.postgresql.org/docs/18/sql-droptable.html)
- 状态：`synopsis-structured`；分支：`IMPLICIT`
- 修正：本轮未发现主 synopsis 结构差异
- 边界：Identifiers, literals, data types and parameter values are caller-supplied leaves; this row certifies command synopsis structure, not catalog/permission/execution validity.

## DROP TABLESPACE

- 文件：[drop/tablespace.snf](../drop/tablespace.snf)；[官方来源](https://www.postgresql.org/docs/18/sql-droptablespace.html)
- 状态：`synopsis-structured`；分支：`IMPLICIT`
- 修正：本轮未发现主 synopsis 结构差异
- 边界：Identifiers, literals, data types and parameter values are caller-supplied leaves; this row certifies command synopsis structure, not catalog/permission/execution validity.

## DROP TEXT SEARCH CONFIGURATION

- 文件：[drop/text-search-configuration.snf](../drop/text-search-configuration.snf)；[官方来源](https://www.postgresql.org/docs/18/sql-droptsconfig.html)
- 状态：`synopsis-structured`；分支：`IMPLICIT`
- 修正：本轮未发现主 synopsis 结构差异
- 边界：Identifiers, literals, data types and parameter values are caller-supplied leaves; this row certifies command synopsis structure, not catalog/permission/execution validity.

## DROP TEXT SEARCH DICTIONARY

- 文件：[drop/text-search-dictionary.snf](../drop/text-search-dictionary.snf)；[官方来源](https://www.postgresql.org/docs/18/sql-droptsdictionary.html)
- 状态：`synopsis-structured`；分支：`IMPLICIT`
- 修正：本轮未发现主 synopsis 结构差异
- 边界：Identifiers, literals, data types and parameter values are caller-supplied leaves; this row certifies command synopsis structure, not catalog/permission/execution validity.

## DROP TEXT SEARCH PARSER

- 文件：[drop/text-search-parser.snf](../drop/text-search-parser.snf)；[官方来源](https://www.postgresql.org/docs/18/sql-droptsparser.html)
- 状态：`synopsis-structured`；分支：`IMPLICIT`
- 修正：本轮未发现主 synopsis 结构差异
- 边界：Identifiers, literals, data types and parameter values are caller-supplied leaves; this row certifies command synopsis structure, not catalog/permission/execution validity.

## DROP TEXT SEARCH TEMPLATE

- 文件：[drop/text-search-template.snf](../drop/text-search-template.snf)；[官方来源](https://www.postgresql.org/docs/18/sql-droptstemplate.html)
- 状态：`synopsis-structured`；分支：`IMPLICIT`
- 修正：本轮未发现主 synopsis 结构差异
- 边界：Identifiers, literals, data types and parameter values are caller-supplied leaves; this row certifies command synopsis structure, not catalog/permission/execution validity.

## DROP TRANSFORM

- 文件：[drop/transform.snf](../drop/transform.snf)；[官方来源](https://www.postgresql.org/docs/18/sql-droptransform.html)
- 状态：`synopsis-structured`；分支：`IMPLICIT`
- 修正：本轮未发现主 synopsis 结构差异
- 边界：Identifiers, literals, data types and parameter values are caller-supplied leaves; this row certifies command synopsis structure, not catalog/permission/execution validity.

## DROP TRIGGER

- 文件：[drop/trigger.snf](../drop/trigger.snf)；[官方来源](https://www.postgresql.org/docs/18/sql-droptrigger.html)
- 状态：`synopsis-structured`；分支：`IMPLICIT`
- 修正：本轮未发现主 synopsis 结构差异
- 边界：Identifiers, literals, data types and parameter values are caller-supplied leaves; this row certifies command synopsis structure, not catalog/permission/execution validity.

## DROP TYPE

- 文件：[drop/type.snf](../drop/type.snf)；[官方来源](https://www.postgresql.org/docs/18/sql-droptype.html)
- 状态：`synopsis-structured`；分支：`IMPLICIT`
- 修正：本轮未发现主 synopsis 结构差异
- 边界：Identifiers, literals, data types and parameter values are caller-supplied leaves; this row certifies command synopsis structure, not catalog/permission/execution validity.

## DROP USER

- 文件：[drop/user.snf](../drop/user.snf)；[官方来源](https://www.postgresql.org/docs/18/sql-dropuser.html)
- 状态：`synopsis-structured`；分支：`IMPLICIT`
- 修正：本轮未发现主 synopsis 结构差异
- 边界：Identifiers, literals, data types and parameter values are caller-supplied leaves; this row certifies command synopsis structure, not catalog/permission/execution validity.

## DROP USER MAPPING

- 文件：[drop/user-mapping.snf](../drop/user-mapping.snf)；[官方来源](https://www.postgresql.org/docs/18/sql-dropusermapping.html)
- 状态：`synopsis-structured`；分支：`IMPLICIT`
- 修正：Use the documented USER alias rather than SESSION_USER
- 边界：Identifiers, literals, data types and parameter values are caller-supplied leaves; this row certifies command synopsis structure, not catalog/permission/execution validity.

## DROP VIEW

- 文件：[drop/view.snf](../drop/view.snf)；[官方来源](https://www.postgresql.org/docs/18/sql-dropview.html)
- 状态：`synopsis-structured`；分支：`IMPLICIT`
- 修正：本轮未发现主 synopsis 结构差异
- 边界：Identifiers, literals, data types and parameter values are caller-supplied leaves; this row certifies command synopsis structure, not catalog/permission/execution validity.

## END

- 文件：[transaction/end.snf](../transaction/end.snf)；[官方来源](https://www.postgresql.org/docs/18/sql-end.html)
- 状态：`synopsis-structured`；分支：`IMPLICIT`
- 修正：本轮未发现主 synopsis 结构差异
- 边界：Identifiers, literals, data types and parameter values are caller-supplied leaves; this row certifies command synopsis structure, not catalog/permission/execution validity.

## EXECUTE

- 文件：[other/execute.snf](../other/execute.snf)；[官方来源](https://www.postgresql.org/docs/18/sql-execute.html)
- 状态：`synopsis-structured`；分支：`IMPLICIT`
- 修正：本轮未发现主 synopsis 结构差异
- 边界：Identifiers, literals, data types and parameter values are caller-supplied leaves; this row certifies command synopsis structure, not catalog/permission/execution validity.

## EXPLAIN

- 文件：[other/explain.snf](../other/explain.snf)；[官方来源](https://www.postgresql.org/docs/18/sql-explain.html)
- 状态：`partial-context`；分支：`IMPLICIT`
- 修正：Enumerate explainable statement categories instead of unrestricted opaque SQL
- 边界：At least one option inside parentheses and option compatibility/value ranges require caller checks; obsolete alternative spellings are not canonical output.

## FETCH

- 文件：[other/fetch.snf](../other/fetch.snf)；[官方来源](https://www.postgresql.org/docs/18/sql-fetch.html)
- 状态：`synopsis-structured`；分支：`IMPLICIT`
- 修正：本轮未发现主 synopsis 结构差异
- 边界：Identifiers, literals, data types and parameter values are caller-supplied leaves; this row certifies command synopsis structure, not catalog/permission/execution validity.

## GRANT

- 文件：[auth/grant.snf](../auth/grant.snf)；[官方来源](https://www.postgresql.org/docs/18/sql-grant.html)
- 状态：`partial-context`；分支：`TABLE`, `COLUMN`, `SEQUENCE`, `DATABASE`, `DOMAIN`, `FOREIGN_DATA_WRAPPER`, `FOREIGN_SERVER`, `ROUTINE`, `LANGUAGE`, `LARGE_OBJECT`, `PARAMETER`, `SCHEMA`, `TABLESPACE`, `TYPE`, `ROLE`
- 修正：Move routine-kind keyword outside repeated routine signatures; permit explicit zero-argument signatures; Explicit whole-item grouping for composite repetitions; verified with the real parser loop walker
- 边界：Privilege/object-kind restrictions, PUBLIC versus role membership/grant option, grantor authority and inherited membership require semantic validation.

## IMPORT FOREIGN SCHEMA

- 文件：[other/import-foreign-schema.snf](../other/import-foreign-schema.snf)；[官方来源](https://www.postgresql.org/docs/18/sql-importforeignschema.html)
- 状态：`synopsis-structured`；分支：`IMPLICIT`
- 修正：本轮未发现主 synopsis 结构差异
- 边界：Identifiers, literals, data types and parameter values are caller-supplied leaves; this row certifies command synopsis structure, not catalog/permission/execution validity.

## INSERT

- 文件：[query/insert.snf](../query/insert.snf)；[官方来源](https://www.postgresql.org/docs/18/sql-insert.html)
- 状态：`partial-context`；分支：`IMPLICIT`
- 修正：Four-space continuation indentation; Explicit whole-item grouping for composite repetitions; verified with the real parser loop walker
- 边界：Expression, subquery-result, recursive CTE, RETURNING alias, target-column/type and cross-clause restrictions require caller/PostgreSQL checks.

## LISTEN

- 文件：[other/listen.snf](../other/listen.snf)；[官方来源](https://www.postgresql.org/docs/18/sql-listen.html)
- 状态：`synopsis-structured`；分支：`IMPLICIT`
- 修正：本轮未发现主 synopsis 结构差异
- 边界：Identifiers, literals, data types and parameter values are caller-supplied leaves; this row certifies command synopsis structure, not catalog/permission/execution validity.

## LOAD

- 文件：[other/load.snf](../other/load.snf)；[官方来源](https://www.postgresql.org/docs/18/sql-load.html)
- 状态：`synopsis-structured`；分支：`IMPLICIT`
- 修正：本轮未发现主 synopsis 结构差异
- 边界：Identifiers, literals, data types and parameter values are caller-supplied leaves; this row certifies command synopsis structure, not catalog/permission/execution validity.

## LOCK

- 文件：[other/lock.snf](../other/lock.snf)；[官方来源](https://www.postgresql.org/docs/18/sql-lock.html)
- 状态：`synopsis-structured`；分支：`IMPLICIT`
- 修正：Repeat ONLY with each individual target
- 边界：Identifiers, literals, data types and parameter values are caller-supplied leaves; this row certifies command synopsis structure, not catalog/permission/execution validity.

## MERGE

- 文件：[query/merge.snf](../query/merge.snf)；[官方来源](https://www.postgresql.org/docs/18/sql-merge.html)
- 状态：`partial-context`；分支：`IMPLICIT`
- 修正：Four-space continuation indentation; Explicit whole-item grouping for composite repetitions; verified with the real parser loop walker
- 边界：Expression, subquery-result, recursive CTE, RETURNING alias, target-column/type and cross-clause restrictions require caller/PostgreSQL checks.

## MOVE

- 文件：[other/move.snf](../other/move.snf)；[官方来源](https://www.postgresql.org/docs/18/sql-move.html)
- 状态：`synopsis-structured`；分支：`IMPLICIT`
- 修正：本轮未发现主 synopsis 结构差异
- 边界：Identifiers, literals, data types and parameter values are caller-supplied leaves; this row certifies command synopsis structure, not catalog/permission/execution validity.

## NOTIFY

- 文件：[other/notify.snf](../other/notify.snf)；[官方来源](https://www.postgresql.org/docs/18/sql-notify.html)
- 状态：`synopsis-structured`；分支：`IMPLICIT`
- 修正：本轮未发现主 synopsis 结构差异
- 边界：Identifiers, literals, data types and parameter values are caller-supplied leaves; this row certifies command synopsis structure, not catalog/permission/execution validity.

## PREPARE

- 文件：[other/prepare.snf](../other/prepare.snf)；[官方来源](https://www.postgresql.org/docs/18/sql-prepare.html)
- 状态：`synopsis-structured`；分支：`IMPLICIT`
- 修正：本轮未发现主 synopsis 结构差异
- 边界：Identifiers, literals, data types and parameter values are caller-supplied leaves; this row certifies command synopsis structure, not catalog/permission/execution validity.

## PREPARE TRANSACTION

- 文件：[transaction/prepare-transaction.snf](../transaction/prepare-transaction.snf)；[官方来源](https://www.postgresql.org/docs/18/sql-prepare-transaction.html)
- 状态：`synopsis-structured`；分支：`IMPLICIT`
- 修正：本轮未发现主 synopsis 结构差异
- 边界：Identifiers, literals, data types and parameter values are caller-supplied leaves; this row certifies command synopsis structure, not catalog/permission/execution validity.

## REASSIGN OWNED

- 文件：[other/reassign-owned.snf](../other/reassign-owned.snf)；[官方来源](https://www.postgresql.org/docs/18/sql-reassign-owned.html)
- 状态：`synopsis-structured`；分支：`IMPLICIT`
- 修正：本轮未发现主 synopsis 结构差异
- 边界：Identifiers, literals, data types and parameter values are caller-supplied leaves; this row certifies command synopsis structure, not catalog/permission/execution validity.

## REFRESH MATERIALIZED VIEW

- 文件：[other/refresh-materialized-view.snf](../other/refresh-materialized-view.snf)；[官方来源](https://www.postgresql.org/docs/18/sql-refreshmaterializedview.html)
- 状态：`synopsis-structured`；分支：`IMPLICIT`
- 修正：本轮未发现主 synopsis 结构差异
- 边界：Identifiers, literals, data types and parameter values are caller-supplied leaves; this row certifies command synopsis structure, not catalog/permission/execution validity.

## REINDEX

- 文件：[other/reindex.snf](../other/reindex.snf)；[官方来源](https://www.postgresql.org/docs/18/sql-reindex.html)
- 状态：`partial-context`；分支：`RELATION`, `DATABASE`
- 修正：本轮未发现主 synopsis 结构差异
- 边界：At least one option inside parentheses and option compatibility/value ranges require caller checks; obsolete alternative spellings are not canonical output.

## RELEASE SAVEPOINT

- 文件：[transaction/release-savepoint.snf](../transaction/release-savepoint.snf)；[官方来源](https://www.postgresql.org/docs/18/sql-release-savepoint.html)
- 状态：`synopsis-structured`；分支：`IMPLICIT`
- 修正：本轮未发现主 synopsis 结构差异
- 边界：Identifiers, literals, data types and parameter values are caller-supplied leaves; this row certifies command synopsis structure, not catalog/permission/execution validity.

## RESET

- 文件：[other/reset.snf](../other/reset.snf)；[官方来源](https://www.postgresql.org/docs/18/sql-reset.html)
- 状态：`synopsis-structured`；分支：`PARAMETER`, `ALL`
- 修正：本轮未发现主 synopsis 结构差异
- 边界：Identifiers, literals, data types and parameter values are caller-supplied leaves; this row certifies command synopsis structure, not catalog/permission/execution validity.

## REVOKE

- 文件：[auth/revoke.snf](../auth/revoke.snf)；[官方来源](https://www.postgresql.org/docs/18/sql-revoke.html)
- 状态：`partial-context`；分支：`TABLE`, `COLUMN`, `SEQUENCE`, `DATABASE`, `DOMAIN`, `FOREIGN_DATA_WRAPPER`, `FOREIGN_SERVER`, `ROUTINE`, `LANGUAGE`, `LARGE_OBJECT`, `PARAMETER`, `SCHEMA`, `TABLESPACE`, `TYPE`, `ROLE`
- 修正：Move routine-kind keyword outside repeated routine signatures; permit explicit zero-argument signatures; Explicit whole-item grouping for composite repetitions; verified with the real parser loop walker
- 边界：Privilege/object-kind restrictions, PUBLIC versus role membership/grant option, grantor authority and inherited membership require semantic validation.

## ROLLBACK

- 文件：[transaction/rollback.snf](../transaction/rollback.snf)；[官方来源](https://www.postgresql.org/docs/18/sql-rollback.html)
- 状态：`synopsis-structured`；分支：`IMPLICIT`
- 修正：本轮未发现主 synopsis 结构差异
- 边界：Identifiers, literals, data types and parameter values are caller-supplied leaves; this row certifies command synopsis structure, not catalog/permission/execution validity.

## ROLLBACK PREPARED

- 文件：[transaction/rollback-prepared.snf](../transaction/rollback-prepared.snf)；[官方来源](https://www.postgresql.org/docs/18/sql-rollback-prepared.html)
- 状态：`synopsis-structured`；分支：`IMPLICIT`
- 修正：本轮未发现主 synopsis 结构差异
- 边界：Identifiers, literals, data types and parameter values are caller-supplied leaves; this row certifies command synopsis structure, not catalog/permission/execution validity.

## ROLLBACK TO SAVEPOINT

- 文件：[transaction/rollback-to.snf](../transaction/rollback-to.snf)；[官方来源](https://www.postgresql.org/docs/18/sql-rollback-to.html)
- 状态：`synopsis-structured`；分支：`IMPLICIT`
- 修正：本轮未发现主 synopsis 结构差异
- 边界：Identifiers, literals, data types and parameter values are caller-supplied leaves; this row certifies command synopsis structure, not catalog/permission/execution validity.

## SAVEPOINT

- 文件：[transaction/save-point.snf](../transaction/save-point.snf)；[官方来源](https://www.postgresql.org/docs/18/sql-savepoint.html)
- 状态：`synopsis-structured`；分支：`IMPLICIT`
- 修正：本轮未发现主 synopsis 结构差异
- 边界：Identifiers, literals, data types and parameter values are caller-supplied leaves; this row certifies command synopsis structure, not catalog/permission/execution validity.

## SECURITY LABEL

- 文件：[other/security-label.snf](../other/security-label.snf)；[官方来源](https://www.postgresql.org/docs/18/sql-security-label.html)
- 状态：`synopsis-structured`；分支：`IMPLICIT`
- 修正：Complete mode/name/type argument definitions, empty signatures, zero direct aggregate arguments
- 边界：Identifiers, literals, data types and parameter values are caller-supplied leaves; this row certifies command synopsis structure, not catalog/permission/execution validity.

## SELECT

- 文件：[query/select.snf](../query/select.snf)；[官方来源](https://www.postgresql.org/docs/18/sql-select.html)
- 状态：`partial-sublanguage`；分支：`SELECT`, `TABLE`
- 修正：Record function columns require type and allow COLLATE; grouped joins; separate legal frame starts/ends and single-bound forms; Explicit whole-item grouping for composite repetitions; verified with the real parser loop walker
- 边界：Expression, subquery-result, recursive CTE, RETURNING alias, target-column/type and cross-clause restrictions require caller/PostgreSQL checks.
- 边界：FROM JSON_TABLE/XMLTABLE sublanguages are not expanded; general SQL expressions and functions remain opaque input boundaries.
- 边界：Relative frame-end ordering, RANGE/GROUPS ORDER BY requirements, set-operation/locking compatibility and parenthesized set-query precedence remain context restrictions. SELECT INTO follows its own documented synopsis, which is narrower than SELECT.

## SELECT INTO

- 文件：[query/select-into.snf](../query/select-into.snf)；[官方来源](https://www.postgresql.org/docs/18/sql-selectinto.html)
- 状态：`partial-sublanguage`；分支：`IMPLICIT`
- 修正：Record function columns require type and allow COLLATE; grouped joins; separate legal frame starts/ends and single-bound forms; Explicit whole-item grouping for composite repetitions; verified with the real parser loop walker
- 边界：Expression, subquery-result, recursive CTE, RETURNING alias, target-column/type and cross-clause restrictions require caller/PostgreSQL checks.
- 边界：FROM JSON_TABLE/XMLTABLE sublanguages are not expanded; general SQL expressions and functions remain opaque input boundaries.
- 边界：Relative frame-end ordering, RANGE/GROUPS ORDER BY requirements, set-operation/locking compatibility and parenthesized set-query precedence remain context restrictions. SELECT INTO follows its own documented synopsis, which is narrower than SELECT.

## SET

- 文件：[other/set.snf](../other/set.snf)；[官方来源](https://www.postgresql.org/docs/18/sql-set.html)
- 状态：`synopsis-structured`；分支：`PARAMETER`, `TIME_ZONE`, `SCHEMA`, `NAMES`
- 修正：Comma-separated parameter values plus documented SCHEMA and NAMES aliases
- 边界：Identifiers, literals, data types and parameter values are caller-supplied leaves; this row certifies command synopsis structure, not catalog/permission/execution validity.

## SET CONSTRAINTS

- 文件：[other/set-constraints.snf](../other/set-constraints.snf)；[官方来源](https://www.postgresql.org/docs/18/sql-set-constraints.html)
- 状态：`synopsis-structured`；分支：`IMPLICIT`
- 修正：本轮未发现主 synopsis 结构差异
- 边界：Identifiers, literals, data types and parameter values are caller-supplied leaves; this row certifies command synopsis structure, not catalog/permission/execution validity.

## SET ROLE

- 文件：[other/set-role.snf](../other/set-role.snf)；[官方来源](https://www.postgresql.org/docs/18/sql-set-role.html)
- 状态：`synopsis-structured`；分支：`SET`, `RESET`
- 修正：本轮未发现主 synopsis 结构差异
- 边界：Identifiers, literals, data types and parameter values are caller-supplied leaves; this row certifies command synopsis structure, not catalog/permission/execution validity.

## SET SESSION AUTHORIZATION

- 文件：[other/set-session-authorization.snf](../other/set-session-authorization.snf)；[官方来源](https://www.postgresql.org/docs/18/sql-set-session-authorization.html)
- 状态：`synopsis-structured`；分支：`SET`, `RESET`
- 修正：本轮未发现主 synopsis 结构差异
- 边界：Identifiers, literals, data types and parameter values are caller-supplied leaves; this row certifies command synopsis structure, not catalog/permission/execution validity.

## SET TRANSACTION

- 文件：[transaction/set-transaction.snf](../transaction/set-transaction.snf)；[官方来源](https://www.postgresql.org/docs/18/sql-set-transaction.html)
- 状态：`partial-context`；分支：`TRANSACTION`, `SNAPSHOT`, `SESSION`
- 修正：Put READ WRITE / READ ONLY alternatives inside explicit SNF braces
- 边界：Transaction modes may not contradict or duplicate; execution state and snapshot validity are outside grammar.

## SHOW

- 文件：[other/show.snf](../other/show.snf)；[官方来源](https://www.postgresql.org/docs/18/sql-show.html)
- 状态：`synopsis-structured`；分支：`IMPLICIT`
- 修正：本轮未发现主 synopsis 结构差异
- 边界：Identifiers, literals, data types and parameter values are caller-supplied leaves; this row certifies command synopsis structure, not catalog/permission/execution validity.

## START TRANSACTION

- 文件：[transaction/start-transaction.snf](../transaction/start-transaction.snf)；[官方来源](https://www.postgresql.org/docs/18/sql-start-transaction.html)
- 状态：`partial-context`；分支：`IMPLICIT`
- 修正：Put READ WRITE / READ ONLY alternatives inside explicit SNF braces
- 边界：Transaction modes may not contradict or duplicate; execution state and snapshot validity are outside grammar.

## TRUNCATE

- 文件：[other/truncate.snf](../other/truncate.snf)；[官方来源](https://www.postgresql.org/docs/18/sql-truncate.html)
- 状态：`synopsis-structured`；分支：`IMPLICIT`
- 修正：Repeat ONLY with each individual target
- 边界：Identifiers, literals, data types and parameter values are caller-supplied leaves; this row certifies command synopsis structure, not catalog/permission/execution validity.

## UNLISTEN

- 文件：[other/unlisten.snf](../other/unlisten.snf)；[官方来源](https://www.postgresql.org/docs/18/sql-unlisten.html)
- 状态：`synopsis-structured`；分支：`IMPLICIT`
- 修正：本轮未发现主 synopsis 结构差异
- 边界：Identifiers, literals, data types and parameter values are caller-supplied leaves; this row certifies command synopsis structure, not catalog/permission/execution validity.

## UPDATE

- 文件：[query/update.snf](../query/update.snf)；[官方来源](https://www.postgresql.org/docs/18/sql-update.html)
- 状态：`partial-sublanguage`；分支：`IMPLICIT`
- 修正：Record function columns require type and allow COLLATE; grouped joins and indentation; Explicit whole-item grouping for composite repetitions; verified with the real parser loop walker
- 边界：Expression, subquery-result, recursive CTE, RETURNING alias, target-column/type and cross-clause restrictions require caller/PostgreSQL checks.
- 边界：FROM JSON_TABLE/XMLTABLE sublanguages are not expanded; general SQL expressions and functions remain opaque input boundaries.

## VACUUM

- 文件：[other/vacuum.snf](../other/vacuum.snf)；[官方来源](https://www.postgresql.org/docs/18/sql-vacuum.html)
- 状态：`partial-context`；分支：`IMPLICIT`
- 修正：Allow omitted relation list for database-wide vacuum
- 边界：At least one option inside parentheses and option compatibility/value ranges require caller checks; obsolete alternative spellings are not canonical output.

## VALUES

- 文件：[query/values.snf](../query/values.snf)；[官方来源](https://www.postgresql.org/docs/18/sql-values.html)
- 状态：`synopsis-structured`；分支：`IMPLICIT`
- 修正：Explicit whole-item grouping for composite repetitions; verified with the real parser loop walker
- 边界：Identifiers, literals, data types and parameter values are caller-supplied leaves; this row certifies command synopsis structure, not catalog/permission/execution validity.

