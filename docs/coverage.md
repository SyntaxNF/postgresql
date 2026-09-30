# SQL 定义范围

版本基线：[PostgreSQL 18 SQL Commands](https://www.postgresql.org/docs/18/sql-commands.html)。仓库包含 183 个命令定义文件；入口数量不表示每个 SQL 组合都经过执行验证。

SNF 用于辅助生成 SQL。表达式、类型、函数体等可以由调用方提供，嵌套 SQL 可以复用已有 statement 定义。权限、对象状态、类型适用性和跨子句组合等执行语义不要求在定义中穷尽编码。

本次复审集中于已撤回 PR #2 中实际影响生成的绑定、分隔符、关键词和缺失选项，并清理相关文件里的纯循环 optional。具体范围和迁移见 [修订说明](revision.md)。没有新增或删除命令入口。

本次验证使用真实 SNF parser 和 loop walker 检查文档/AST/指令结构与代表性循环绑定，详见 [验证说明](validation.md)。这些结果不是 SQL 执行、完整语义校验或消费方集成验证，也不把正常输入边界列为未完成项。
