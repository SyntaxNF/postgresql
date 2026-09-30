# PostgreSQL 18 定义覆盖核查

检查日期：2026-09-30。基线为 [PostgreSQL 18 SQL Commands](https://www.postgresql.org/docs/18/sql-commands.html)，仓库起点 `75d7ec80383dea9ceafe4bf6e324515daaa7e877`。

## 结论与口径

- 官方 **183 个命令入口 / 183 个定义文件**逐项匹配，全部核对到命令 synopsis 的分支、可选项、列表边界与本地 helper，而不再只是确认文件存在
- 本轮修正 **66 个 SNF 文件**；实际 pinned SNF parser 可解析全部 183 文件，精确源码 round-trip、AST span、指令归属、本地引用可达性、入口清单和显式输入契约检查通过
- **127 项结构回归断言**通过；这些是生产式形状与 parser fixtures，**不是 127 条 SQL 实库执行用例**
- **没有执行任何 PostgreSQL SQL，也没有运行数据库服务器**。未生成 `.snf.json`
- 仍不能宣称完整 SQL grammar 或所有生成结果均可执行。表达式、类型、函数体及跨子句/对象/权限限制有清楚的输入边界

[逐命令审阅表](command-audit.md)提供每个命令的文件、官方来源、已核对 CASE、修正及限制；机器可读对应为 [inventory.json](inventory.json)。记录 synopsis 摘要 SHA-256，便于重取对应版本页面后复核。

| 状态 | 命令数 | 精确含义 |
| --- | ---: | --- |
| `synopsis-structured` | 148 | 文档 synopsis 的结构已审阅；仍依赖合法标识符、值、类型与执行上下文，不表示完整语义验证 |
| `partial-context` | 29 | 结构已审阅，但有已列出的跨选项/子句/对象限制未编码 |
| `partial-sublanguage` | 6 | 除上下文限制外，还保留明确的子语言输入边界，例如函数体、JSON_TABLE/XMLTABLE |

## 主要实质修正

- CREATE/ALTER/DROP 函数与过程支持零参数及显式空签名；CREATE routine 的互斥 body 分支展开为字符串 body、外部符号、RETURN、BEGIN ATOMIC；重复 SET/RESET 不再错误插入逗号
- 聚合签名补齐 `*`、零个直接参数的 ordered-set 形式；修正 `order/orders` 未绑定 helper
- CREATE TABLE/FOREIGN TABLE、composite/enum TYPE 的空列表；CREATE SCHEMA 四种形式，IF NOT EXISTS 不携带嵌入语句
- PUBLICATION 的对象列表不再把 table 标识符递归绑定为整个生产式；DROP 的目标不允许列列表/WHERE；SUBSCRIPTION 的 publication 选项补 COPY_DATA
- OPERATOR CLASS 的 STORAGE 成为逗号列表成员；TRANSFORM 支持单向或双向；ALTER TABLE 的列约束可省略、trigger 目标必须给出、ON UPDATE 不接受 ON DELETE 专用列子集
- DROP DATABASE 改为正确的 `( FORCE )`；ANALYZE/VACUUM 支持省略表列表；CALL 支持零参数
- GRANT/REVOKE routine 类型关键字放到 routine 列表外；COMMENT/SECURITY LABEL 支持完整、空参数签名
- COPY 分开 FROM/TO 的选项，枚举格式、错误与日志取值；EXPLAIN 限定可嵌套语句类别；SET 支持值列表及文档中的 SCHEMA/NAMES 别名
- SELECT/SELECT INTO/UPDATE/DELETE 的 record 函数列定义必须有类型并可带 COLLATE，支持括号 JOIN；窗口单边/双边边界不再允许明显非法的 UNBOUNDED 方向
- 四空格缩进和事务模式枚举修正；保留 CASE/WHERE/ONEOFIS/PARTOFIS/STATEMENT 的既有语义

- 复合重复列表（WINDOW、VALUES、RETURNING 别名、列权限、CONFLICT、EXCLUDE、属性/索引参数）改为整项绑定，补充真实 loop walker 回归

消费方 CASE/helper/输入字段变化见 [迁移提示](migration.md)。

## 仍然存在的边界

1. **输入叶子**：295 个不同名称、1147 个逐文件输入槽，登记在 [input-contracts.json](input-contracts.json)。分类明确区分标识符/领域名称、标量或枚举、字符串内容、类型、表达式、代码字面量、外部参数名。这是输入边界清单，不是这些值已被语义类型检查的承诺
2. **子语言**：一般 SQL 表达式、类型内部语法、函数或过程字符串 body 不展开；BEGIN ATOMIC 的每条 `sql_statement` 是显式不透明 statement；FROM 的 JSON_TABLE/XMLTABLE 子语言尚未展开
3. **上下文限制**：窗口起止相对顺序、RANGE/GROUPS 条件、集合运算与行锁；COPY 格式兼容、REJECT_LIMIT 与 ON_ERROR；约束/分区/temporal/identity 适用范围；PUBLIC、授权与角色成员关系；逻辑复制等限制见逐命令条目
4. **合法选项选择**：固定次序的可选字段沿用仓库的生成约定（删除最终逗号）；当某个括号选项组或 ALTER action 全部可选时，调用方仍须保证选择至少一项，以及不产生矛盾组合。SNF parser 不承担这类逻辑
5. **规范生成而非历史拼法穷举**：以本版本主 synopsis 和相关解释为准；维护命令旧式无括号参数等兼容形式不是本轮的规范生成目标。SELECT INTO 按它自己的官方 synopsis 核查，不把 SELECT 中所有较新写法自动移入
6. **参数元数据**：`definition/parameter.yaml` 仍是外部参数元数据；本轮没有把各 GUC、扩展/FDW 选项及其运行期取值合法性改造成闭合语法或测试数据库状态

## 验证

完整命令、版本与结果见 [validation.md](validation.md)。验证脚本仅在用户明确触发后运行；不改变 AGENTS 中“不要自动运行测试”的规则。
