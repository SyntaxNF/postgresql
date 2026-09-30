# 显式验证与范围

遵守 AGENTS：只有用户明确要求时才运行 parser、测试或类型检查。2026-09-30 本轮用户已授权 parser、相关回归与草稿 PR；没有运行 PostgreSQL 实库。

## 固定并重新构建真实 parser

- 仓库：[SyntaxNF/parser](https://github.com/SyntaxNF/parser)
- 源码 revision：[`bcf2c3ac58b45e7d5391716393586b00b11e0c1a`](https://github.com/SyntaxNF/parser/commit/bcf2c3ac58b45e7d5391716393586b00b11e0c1a)
- 本轮 Node：`v24.19.0`
- 使用真实导出 `SNFDocumentParser`、`SNFParser`、`NodeType`、`exchangeQuoteNode`、`exchangeLoopNode`

在独立 checkout 切换到上述 revision，按 parser 的 lockfile 准备依赖，**重新构建后**再运行本仓库检查。不得只把已有 dist 目录配上一个正确的源码 SHA：脚本检查 HEAD、构建输入无改动及导入路径，但不会自行证明未重新构建的 dist 与源码一致。

```sh
# 在 parser checkout；安装依赖和运行检查均需遵守各自的授权要求。
git checkout bcf2c3ac58b45e7d5391716393586b00b11e0c1a
pnpm install --frozen-lockfile
pnpm build
pnpm test

# 在本仓库
export SNF_PARSER_MODULE=/absolute/path/to/parser/dist/esm/index.mjs
npm run check:snf
npm run test:regression
git diff --check
```

本轮使用已有依赖，实际成功执行了官方脚本对应的 `node node_modules/vite/bin/vite.js build`。`tsx` CLI 的 IPC 管道在当前环境返回 `EPERM`；改用同一测试文件的 `node --import tsx test/index.ts`，基础 parser 测试通过。未修改 parser 源码或放宽权限。

本仓库不自动下载 parser、不自动安装依赖，不包含生产 SQL 生成器或数据库连接。

## 全文件结构检查

`npm run check:snf` 扫描七个语句目录的全部 183 个 `.snf` 文件，检查：

- 真实 parser 解析，完整源码与物理行换行符的精确 round-trip
- 物理行、内容 block、原始 AST 的源码区间与 `raw` 一致，AST 子节点不超出父区间
- 文件名、PostgreSQL 18 首行链接、四空格缩进与尾空白
- CASE/helper 重复、指令归属、空生产式、ONEOFIS 单物理行候选、裸分支或重复标记
- 本地声明的 helper 从入口可达，避免声明与引用名称脱节
- 每个 postfix LOOP 经真实 walker 处理后确实绑定一个可重复语法节点，并保留分隔符 AST；重点复合成员由回归断言确认完整绑定

183 是本次仓库文件数的防漏检查，不能推导出 PostgreSQL 全部语法组合已经覆盖。普通占位符、表达式、类型、body 和复用 statement 是合法输入；没有强制输入分类清单或完整语义覆盖门槛。空 `STATEMENT` 声明允许表示外部复用，非空声明保留已有类别文本。检查器不解析跨文件 statement，也不验证类别对应的 SQL 上下文是否合法。

### 纯 LOOP 外层可选的范围

LOOP 吸收前一个成员，表示零个或多个。`[ item [, ...] ]` 的外层可选重复表达了空集合，应移除；`[ ORDER BY item [, ...] ]` 与 `[ ( arg [, ...] ) ]` 仍控制关键字或标点，必须保留。

脚本基于真实规范化 AST 检查纯 LOOP 外层可选。此项失败门槛只应用于相对于 `75d7ec80383dea9ceafe4bf6e324515daaa7e877` 发生改动的 SNF 文件（包括暂存、未暂存和新文件），不把未触及的旧写法扩成修复范围。报告也记录未改文件中检测到的数量。后续独立变更可以显式设置 `SNF_DIFF_BASE` 为其审阅基线；基线不可读取时直接失败。

需要逐文件排查时可显式生成报告，无需提交巨型清单：

```sh
node scripts/check-snf.mjs /absolute/path/to/report.json
```

## 回归与孤立展开样例

`npm run test:regression` 包含：

- 保留修正的语法形状：缺失选项/关键字、括号、赋值、SET/RESET 分隔符、TRANSFORM 单向形式等
- 全仓库兼容形式检查：省略无效果的 GLOBAL/LOCAL 临时表前缀及 WITH/WITHOUT OIDS；四种 CREATE TABLE/AS 形式保留有效临时/非日志与存储选项，SET/VIEW 的有效 LOCAL 仍保留
- 真实 `exchangeLoopNode` 的绑定断言：WINDOW、VALUES 行、RETURNING alias、列权限、routine 列表、CONFLICT target、EXCLUDE 项、参数赋值和过滤条件
- malformed SNF、三种换行符、无主内容、不可达 helper、错误的裸圆括号重复和纯 LOOP 可选范围的负向样例
- 8 个孤立展开 fixture，每个检查 0/1/2 次，共 24 个确定结果：逗号列表、完整 WINDOW 项、嵌套 VALUES 行、RETURNING alias、无逗号 SET、AND 过滤条件、分号语句、可选圆括号

展开 fixture 只解释真实 walker 产生的少量节点，固定选择候选、代入测试值并按 marker AST 拼接。它不是项目生产 SQL 生成器，不连接声明、执行 SQL，也不证明任意输入都能生成合法 PostgreSQL。0 次样例仅验证 SNF 的 0+ 约定，不能用于宣称 SQL 本身允许空列表。

README 的“移除 SQL 圆括号内最后一个逗号”属于生成约定，本轮保留。没有发现并运行集成该约定的生产生成器；这里的孤立展开 fixture 也没有实现或验证该约定。

## 本轮结果（2026-09-30）

| 检查 | 结果 |
| --- | --- |
| 固定 parser 新构建与基础测试 | 通过 |
| 全部 SNF 文件 | 183 个，全部真实解析通过 |
| Physical blocks / 原始 AST nodes | 967 / 31,893（包含 183 个首行来源注释 block 的空 ROOT） |
| Round-trip、raw/span、指令归属、本地 helper 可达性 | 通过 |
| 真实 walker LOOP 绑定 | 539 个，全部通过 |
| 本轮修改的 SNF 文件 | 50 个；纯 LOOP 外层可选为 0 |
| 未修改 SNF 文件中的纯 LOOP 外层可选 | 0；仅报告，不扩大失败范围 |
| 回归断言 | 166 个通过，包含 8 个孤立 fixture 的 24 次展开 |
| `git diff --check` | 通过 |
| 生产生成器、PostgreSQL SQL 解析与实库执行 | 未运行 |
| 任意输入/组合的完整语义正确性 | 不作此保证 |

以上对应修改后的真实文件，未复用已撤回 PR 的统计或测试结论。
