# PostgreSQL 生成结构修订

本次以 `75d7ec8` 的文件内容为基线（与恢复后的 main `caf1591` 相同），替代已撤回的 PR #2。没有重新合并原补丁。

## 保留的修正

- 复合项整体参与循环：WINDOW、VALUES 行、RETURNING 别名、列权限、CONFLICT 项、EXCLUDE 项、属性/索引参数，以及 LOCK/TRUNCATE 的 ONLY 目标。
- 聚合签名的单数 order 循环项与同名声明绑定（不因重复而加 s）、PUBLICATION 的 table helper 与 table 标识符同名冲突。
- SET/RESET 多项之间不再错误插入逗号；DROP DATABASE 的 FORCE 括号；COPY 的可选 WITH；TABLESPACE 和 COLLATION_VERSION 的赋值标点。
- 缺失的可选形式：聚合 `*`、规则的单条 statement、单向 TRANSFORM、SUBSCRIPTION COPY_DATA、SET SCHEMA/NAMES；以及明确的关键词选项。
- FROM record 列的类型/COLLATE 与括号 JOIN 形式，保留现有子查询引用。

## 循环修正与范围

循环本身允许零项。原 PR 新增的纯循环 optional 不再保留；同时清理本次触及文件中已有的同类包装，例如 FROM 函数参数、列约束、LIKE 选项、SELECT 投影/locking_clause 和事务模式。

这不会取消真正含关键词或括号的整体可选，如 `[ ORDER BY ... ]`、`[ WITH ( ... ) ]`、`[ ( arg [, ...] ) ]`。也不尝试把所有 SQL 的最少列表长度编码到 SNF。

## 不采用的原 PR 改动

- 不为了限制窗口方向、COPY 方向、EXPLAIN 类别或 SCHEMA/INDEX/LANGUAGE 的组合，新增上下文合法性门禁。
- 不强制展开函数体、普通表达式或类型内部语法，不复制子查询定义。
- 不把普通输入节点列为覆盖缺口，也不引入每文件强制输入分类清单。
- 不恢复统计表达式“固定首项 + 逗号 + 循环”的最低数量模拟。
- 圆括号内末尾逗号遵循已有生成器清理约定；不会新增另一套分隔符策略。

## 有意省略的历史兼容选项

CREATE TABLE 的普通表、类型表、分区表和 CREATE TABLE AS 均不再提供临时表前缀 GLOBAL/LOCAL 或 WITHOUT OIDS。PG18 仍接受这些旧写法，但前者没有效果且官方不建议使用，后者仅为兼容旧语法；生成新 SQL 有意省略它们，不算有效功能缺失。全仓库同类检查也移除了 ALTER TABLE、ALTER FOREIGN TABLE 的 SET WITHOUT OIDS；这两种写法在 PG18 同样没有效果。TEMP/TEMPORARY/UNLOGGED、存储参数 WITH、其它有效 LOCAL 语法和 OID 类型/对象引用保持不变。

依据：[CREATE TABLE](https://www.postgresql.org/docs/18/sql-createtable.html) 、[CREATE TABLE AS](https://www.postgresql.org/docs/18/sql-createtableas.html)、[ALTER TABLE](https://www.postgresql.org/docs/18/sql-altertable.html) 与 [ALTER FOREIGN TABLE](https://www.postgresql.org/docs/18/sql-alterforeigntable.html)。

## 需要消费者注意的字段变化

- `create/function.snf`：returns 改为 `[ SETOF ] type`；函数/过程参数模式提供 IN/OUT/INOUT/VARIADIC 选择。现有 pg_definition/sql_definition body 输入保留。
- CREATE/ALTER routine：重复 SET/RESET 使用 set_parameter_clause/reset_parameter_clause helper，无额外逗号。
- CREATE/ALTER PUBLICATION：结构使用 publication_object/table_definition；table 保持对象标识符。DROP 仍复用对象结构，不追加本轮上下文门禁。
- ALTER TABLE：generated_mode 改为 identity_option，提供具体序列选项。
- CREATE STATISTICS：on 改为 col_expression，statistics_expression 表示一个普通循环成员，kind 给出选项。
- CREATE TRANSFORM：新增 FROM_SQL/TO_SQL/BOTH 分支，使用 from_function/to_function/argtype。
- SELECT/SELECT INTO/UPDATE/DELETE：新增 joined_expression helper，括号 JOIN 使用已有 join_alias 名称；复合循环消费者需绑定完整成员。
- CREATE EVENT TRIGGER：filter_definition 绑定完整 TAG IN 项，filter_value 是引号内字符串内容。
- CREATE OPERATOR CLASS：STORAGE 使用 type，并作为完整列表成员。

具体字段以 SNF diff 为准。验证命令及结果边界见 [validation.md](validation.md)；没有 PostgreSQL 实库执行，也没有消费方集成测试。
