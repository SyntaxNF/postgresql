# 可复现验证（显式触发）

遵守 AGENTS：不自动运行测试或类型检查。本轮用户在 2026-09-30 明确同意 SNF parser、相关回归检查和草稿 PR；实库执行未授权且未进行。

## 固定 parser

- 仓库：[SyntaxNF/parser](https://github.com/SyntaxNF/parser)
- 源码 revision：[`bcf2c3ac58b45e7d5391716393586b00b11e0c1a`](https://github.com/SyntaxNF/parser/commit/bcf2c3ac58b45e7d5391716393586b00b11e0c1a)
- 导出：`SNFDocumentParser` / `NodeType`，不是自行编写的假 parser
- Node：`v24.19.0`
- 在固定源码与现有 lockfile 对应依赖下重新执行 `node node_modules/vite/bin/vite.js build`，成功。常规 `pnpm build` 首次因环境默认 pnpm home 不可用失败，使用已有依赖的上述等价官方 Vite build 入口成功；没有因此改变源码或绕过网络限制
- `dist/esm/index.mjs` SHA-256：`5aa14167ad371522ed5815719f74639aa1526ff71ed1dfd8ec0a00975f74e510`（该入口引用同次构建的其他模块；revision 是源码固定依据，不以单一入口 hash 代替全模块验证）

## 运行

在独立目录准备上述 revision 的 parser、按其 lockfile 安装依赖并构建；本仓库不自动下载或安装工具，不提交 parser 的 node_modules 或产物。

```sh
export SNF_PARSER_MODULE=/absolute/path/to/parser/dist/esm/index.mjs
npm run check:snf
npm run test:regression
git diff --check
```

可选输出完整逐文件结构清单（含输入槽）：

```sh
node scripts/check-snf.mjs /absolute/path/to/report.json
```

`docs/inventory.json` 和 `docs/input-contracts.json` 是必需的已审阅验证输入；缺失时验证失败，不能静默跳过。

## 2026-09-30 结果

| 检查 | 结果 |
| --- | --- |
| 官方目录对应 | 183 命令 / 183 文件，无缺失或多余入口 |
| 实际 SNF parser | 183 文件、988 physical blocks、32591 AST nodes，全部通过 |
| 精确源码/行 ending round-trip、AST raw/span | 通过 |
| 文件名、版本链接、四空格缩进、尾空白 | 通过 |
| CASE/helper 重复、空生产式、ONEOFIS 物理行、裸 alternative/repeat | 通过；空 STATEMENT 是显式外部子语言声明，按 README 允许 |
| postfix loop 的可绑定目标及复合项 walker 回归 | 通过 |
| 本地 helper 绑定/可达性、嵌套 statement 类别 | 通过；265 named CASE、234 helper 名称 |
| 输入契约 | 1147 个逐文件槽、295 个不同名称与显式分类匹配 |
| 回归 | 127 个生产式形状 / parser malformed / newline round-trip 断言通过 |
| `git diff --check` | 通过 |
| PostgreSQL SQL 解析/实库执行 | **未运行** |
| 服务器类型、catalog、权限、并发/事务行为 | **未验证** |

首次结构检查发现空 STATEMENT 声明被验证器误判，以及一行尾空格；修正验证器以符合仓库 README，再重新跑完整检查。交叉审阅还纠正了过宽的 `(from_expression)`，改为仅括号 join，并补齐 record 函数列的 COLLATE。最终结果对应上述修正后的全部文件。

## 能证明什么

parser 负责保留源文本并解析 SNF block AST；不会解释 CASE/WHERE、验证 PostgreSQL 语句、执行 SQL 或自动连接跨文件 grammar。本仓库校验器在真实 AST 上另做指令、本地可达性和输入边界检查；不是 SQL 生成器或 PostgreSQL grammar validator。

回归检查检查生产式中必须存在/不存在的结构、真实 parser 对损坏 SNF 的拒绝，以及换行保真。不能从“127 断言通过”推导“任意生成 SQL 已被 PostgreSQL 接受”。已知子语言和上下文边界保留在 coverage 与逐命令清单中。

补充审阅发现了仅能解析却绑定错误的复合列表：WINDOW/VALUES/RETURNING/权限/CONFLICT/EXCLUDE/参数赋值。最终统一检查与127项断言是在整项重复修正之后重新执行；这也是为何不能把 parser 成功等同于 SQL 正确。SELECT JOIN/record COLLATE 辅助对照了 [PostgreSQL REL_18_STABLE grammar](https://github.com/postgres/postgres/blob/REL_18_STABLE/src/backend/parser/gram.y)。
