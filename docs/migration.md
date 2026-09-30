# 消费方迁移提示

SQL 命令仍按语句组织，183 个定义文件未增加/删除。修正 grammar 不是替消费者设置菜单、操作权限、默认值或执行策略；这些仍由调用方负责。若消费者持久化了 CASE/helper/占位符键，需检查以下迁移。

| 文件/范围 | 调整 |
| --- | --- |
| `create/schema.snf` | 原隐式入口拆为 `NAMED`、`AUTHORIZATION`、`NAMED_IF_NOT_EXISTS`、`AUTHORIZATION_IF_NOT_EXISTS`；IF NOT EXISTS 不再有嵌入 create_statement |
| `create/transform.snf` | 原隐式入口拆为 `FROM_SQL`、`TO_SQL`、`BOTH`；函数标识符改为 from_function / to_function |
| `create/function.snf`、`create/procedure.snf` | 独立 AS/pg_definition/sql_definition 输入替换为互斥 routine_body_clause；其中 definition 是引号内 body，object_file/link_symbol 是外部符号，value_expression 是 SQL RETURN，sql_statement 是 BEGIN ATOMIC 中的不透明语句。argmode 变为显式模式选择；function returns 替换为 `[ SETOF ] type` 或表返回结构 |
| `alter/function.snf`、`alter/procedure.snf`、`alter/routine.snf` | SET/RESET helper 改为无逗号重复的 set_parameter_clause / reset_parameter_clause |
| `create/publication.snf`、`alter/publication.snf` | `table` 恢复为标识符；对象结构分别由 publication_object、table_definition、publication_drop_object、table_target 负责，不再自递归到同名 table helper |
| `alter/table.snf` | generated_mode 改为 identity_option；ON UPDATE 与 ON DELETE 分开；各 assignment/exclusion/index 参数列表重复整项 |
| `other/copy.snf` | copy_options 拆为 copy_from_options / copy_to_options；format、on_error、log_verbosity 改为显式枚举选择 |
| `other/explain.snf` | sql_statement 改为有类别声明的 explainable_statement |
| `other/do.snf` | language_statement 改为 code_literal；调用方提供完整 SQL 代码字面量（含引号/美元引用），不是无引号 SQL statement |
| `create/statistics.snf` | 原 on 改为 col_expression；多变量分支使用 statistics_expression，至少两项；kind 明确枚举 |
| `create/operator-class.snf` | STORAGE 使用数据类型 type，与 operator/function 同处列表 |
| SELECT/SELECT INTO/UPDATE/DELETE | 新 joined_expression helper；function record 列定义必须有 type，可有 COLLATE；窗口 start/end 分开，single-bound 选择范围受限 |
| 多字段列表 | WINDOW、VALUES 行、RETURNING 别名、列权限、CONFLICT 项、EXCLUDE 项、参数赋值改为显式完整重复单元；读取 AST 的消费者应绑定整个 ENUM/helper，而非最后一个标量 |

原来依赖错误语法的生成配置不能机械保留，例如 `DROP DATABASE x WITH FORCE` 应改为 `DROP DATABASE x WITH ( FORCE )`，无参数调用和签名要允许空括号。每个仍然由调用方提供的输入名称及分类见 [input-contracts.json](input-contracts.json)。此清单不会替用户转换现有应用状态，也没有执行 Studio/消费者端集成测试。
