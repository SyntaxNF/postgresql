# PostgreSQL SNF

本仓库维护 PostgreSQL 18 SQL 语句的 SNF（Syntax Normal Form）定义，供阅读与 SQL 生成使用。语法以 [PostgreSQL 18 SQL Commands](https://www.postgresql.org/docs/18/sql-commands.html) 为基线；每个 `.snf` 首行链接对应的官方语法页。

## 目录

- `create/`、`alter/`、`drop/`：数据库对象的创建、修改与删除。
- `query/`：查询与 DML。
- `transaction/`：事务控制。
- `auth/`：角色、授权与访问控制。
- `other/`：会话、维护、管理及实用语句。
- `definition/parameter.yaml`：配置参数等辅助元数据。

## SNF 用法

选取语句文件和所需 `CASE`，展开本地节点，再由调用方提供标识符、表达式、类型或语句体等输入。嵌套查询可以复用已有 statement 定义。

| 记号 | 含义 |
| --- | --- |
| `KEYWORD` | 原样生成的 SQL 关键字。 |
| `placeholder` | 调用方输入或其他语法节点。 |
| `[ syntax ]` | 整段可选，最多一次。 |
| `{ a \| b }` | 必选分支。 |
| `[ { a \| b } ]` | 可选的显式枚举；`[ a \| b ]` 不合法。 |
| `item [...]` | 完整 `item` 重复零次或多次，不额外添加分隔符。 |
| `item [, ...]` | 完整 `item` 重复零次或多次，成员间用逗号分隔。 |
| `statement [; ...]` | 完整 statement 重复零次或多次，成员间用分号分隔。 |
| `( syntax )`、`'value'` | 原样生成的 SQL 圆括号、字符串字面量。 |

未转义的 `|` 只能直接出现在 `{}` 内。`# CASE` 标记顶层分支；`# WHERE` 定义复用节点；`# ONEOFIS` 每个物理行是一个候选；`# PARTOFIS` 每个空行分隔的 block 是一个候选；`# STATEMENT` 声明可嵌套的语句节点。

```snf
# CASE RENAME
ALTER TABLE name RENAME TO new_name

# WHERE order_by_expression
col_expression [ { ASC | DESC } ]

# STATEMENT query_statement
```

## 生成约定

- 循环包含前一个完整成员，允许零项；多字段成员用分组或 helper 整体绑定后重复。
- 纯循环不套可选外壳；`[ ORDER BY item [, ...] ]`、`[ ( arg [, ...] ) ]` 等含关键字或括号的整体可选仍需保留。
- 相互独立且至多一次的子句按固定顺序分别可选，只有真实列表或语句序列使用循环。
- 生成器需移除 SQL 圆括号内最后一个逗号；圆括号内固定顺序的可选字段可以各自保留尾逗号。
- `name`、`new_name` 只用于当前主对象及其重命名；其他对象使用 `table`、`constraint`、`colname` 等语义名称。
- `_statement` 表示完整语句，`_expression` 表示表达式，`_definition` 表示结构声明；`_clause`、`_option`、`_action` 分别表示子句、选项和依赖父语句的操作。
- 表达式、类型、函数体由调用方提供；权限、输入引用/转义、选项组合与执行流程由消费方处理。

## 手动检查命令

按 `AGENTS.md`，仅在用户明确要求时运行。当前定义使用显式 OPTIONAL/ENUM 语法，先构建[SyntaxNF/parser](https://github.com/SyntaxNF/parser)，再显式选择工作区构建：

```sh
(cd /absolute/path/to/parser && pnpm build)
export SNF_PARSER_WORKTREE_MODULE=/absolute/path/to/parser/dist/esm/index.mjs
npm run validate
npm test
```

脚本只通过 `SNF_PARSER_WORKTREE_MODULE` 加载指定构建，标记为 `working-tree-build`；缺少该配置会直接报错。修改 parser 后应重新构建。

四库统一使用 `npm run validate` 执行全部结构检查、`npm test` 执行全部回归；`validate:snf` 为结构检查入口，`test:regression` 为回归入口。无需安装本库依赖，使用 Node.js 22 和上面明确指定的 parser 构建。

基础检查统一覆盖源文件与 AST 范围、显式 OPTIONAL/ENUM/GROUP、完整成员的 LOOP 绑定、冗余纯循环可选层、四空格缩进与末尾换行，对所有文件执行。生成回归覆盖 0/1/2 次循环、显式枚举、可选项、分隔符及自由输入原文保留。SQL Server 的 `validate` 还包含其指令/固定文本约定检查和生成结构检查；各库保留自己的方言回归。

`scripts/parser-runtime.mjs`、`scripts/snf-contract.mjs` 及其测试在四库保持一致；`generator-fixture.mjs` 仅本地文档加载入口不同，`generator-contract.test.mjs` 保持一致。修改公共契约时同步四库。报告的 `parserInput` 是实际加载路径；这些检查验证 SNF 和测试辅助生成行为，不执行数据库 SQL。
