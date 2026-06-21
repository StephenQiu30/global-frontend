## Why

PRD 03 要求前端展示后端扫描到的 Markdown 文件列表，让用户选择要翻译的文件。当前 `global-frontend` 没有文件选择能力，需要新增 `targetPath` 工具函数和 `MarkdownFilePicker` 组件，支持 README 默认选中、文件大小/目标路径预览、禁用原因展示和选择数量限制。

## What Changes

- 新增 `src/lib/targetPath.ts`：根据源文件路径和目标语言生成翻译文件的目标路径预览。
- 新增 `src/components/MarkdownFilePicker.tsx`：文件选择组件，包含 checkbox 列表、禁用原因、文件大小、目标路径预览、已选数量/总大小统计。
- 新增对应的测试文件 `src/lib/targetPath.test.ts` 和 `src/components/MarkdownFilePicker.test.tsx`。
- 新增最小项目脚手架（`package.json`、`tsconfig.json`、Vitest 配置）以支持测试运行。

## Capabilities

### New Capabilities

- `markdown-file-picker`: 前端 Markdown 文件选择界面，包含 target path 预览、默认 README 选中、禁用原因展示、选择数量/大小限制。

### Modified Capabilities

（无已有 spec 需要修改）

## Impact

- 新增文件：`src/lib/targetPath.ts`、`src/components/MarkdownFilePicker.tsx`、测试文件。
- 新增依赖：`react`、`@testing-library/react`、`vitest`（项目脚手架）。
- 不影响后端实现（后端由 `global-backend` 独立完成）。
- 不影响已有代码（当前仓库无应用代码）。
