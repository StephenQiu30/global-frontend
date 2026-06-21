# Design: 目标语言选择器

## Goals

- 提供可复用的语言常量模块，供全项目引用。
- 提供可搜索的 LanguageSelector 组件，支持受控模式和路径预览。

## Non-goals

- 不做自定义语言输入。
- 不做后端 API 调用（语言列表硬编码，与后端保持一致即可）。

## Contracts

- `Language` interface: `{ code: string; label: string }`
- `LanguageSelector` props:
  - `value?: string` — 受控选中值
  - `onChange?: (code: string) => void` — 选中回调
  - `getTargetPath?: (sourcePath: string, language: string) => string` — 路径预览函数
  - `sourcePath?: string` — 用于路径预览的源文件路径

## State flow

1. 组件内部维护 `search` state 和 `isOpen` state。
2. `value` prop 控制选中态；未传时使用 `DEFAULT_LANGUAGE`。
3. 搜索输入过滤 `SUPPORTED_LANGUAGES` 列表。
4. 选中后调用 `onChange(code)` 并关闭下拉。

## Failure paths

- 搜索无结果：显示"无匹配语言"。
- 无效 `value` prop：回退到 `DEFAULT_LANGUAGE`。

## Rollback

纯新增文件，无迁移影响。删除文件即回滚。
