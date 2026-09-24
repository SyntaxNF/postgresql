# SQL 定义覆盖检查

基线：[PostgreSQL 18 SQL Commands](https://www.postgresql.org/docs/18/sql-commands.html)。检查日期：2026-09-24。

## 结论

官方目录的 183 个命令入口均有定义文件。通过官方命令链接与 SNF 首行链接逐项对照确认；这只证明语句入口覆盖，不代表所有子句组合、类型或执行语义均经过验证。

## 本轮补充与修正

- 新增 ALTER FOREIGN TABLE（含组合操作、列/约束/触发器/继承/所有者和 FDW 选项）、SHOW、START TRANSACTION。
- BEGIN 的事务模式改为可选列表，支持不带选项和多个模式。
- SELECT/SELECT INTO 的窗口 PARTITION BY 改为表达式列表；分组元素改为候选集合，避免把全部候选串在一起。
- SELECT 的集合运算移到 ORDER BY/LIMIT 之前；锁定子句可重复，NOWAIT 与 SKIP LOCKED 互斥。
- FROM 函数允许零参数及别名，展开 JOIN 类型；UPDATE 补全 CTE 中可嵌套语句声明。
- INSERT 的 ON CONFLICT DO UPDATE 必须提供冲突目标。
- CREATE TABLE/FOREIGN TABLE 支持多个 LIKE 选项；修正外键 ON UPDATE 节点以及只适用于 ON DELETE 的列列表；展开 CREATE/ALTER TABLE 的 identity_options。

## 验证范围

本轮只做官方文档对照、定义与差异的静态检查。遵守仓库约定，未运行解析测试、类型检查、构建或数据库执行验证，未生成 .snf.json。

## 尚未穷尽的部分

- SQL 表达式、类型、函数体等叶子节点仍由调用方输入，不是完整 SQL 解析器。
- 子句间的语义限制（例如窗口边界顺序、集合查询与行锁的组合、约束适用类型）没有全部编码进 SNF。
- 除上述修正外，其余命令本轮核对到入口级别，不能据此声称每个命令的所有语法分支均完整。
