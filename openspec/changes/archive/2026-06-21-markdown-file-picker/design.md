## Context

PRD 03 要求 `global-frontend` 实现 Markdown 文件选择界面。后端（`global-backend`）负责扫描仓库并返回文件列表，前端负责展示和交互。本设计仅覆盖前端实现。

当前仓库无应用代码，需要同时创建最小项目脚手架。

## Goals / Non-Goals

**Goals:**
- 实现 `targetPath.ts` 工具函数，支持 `.md` 和 `.markdown` 扩展名的语言后缀插入
- 实现 `MarkdownFilePicker` 组件，支持文件列表展示、默认选中、禁用原因、选择限制
- 通过 Vitest 单元测试验证所有行为

**Non-Goals:**
- 不实现后端 API 调用（由 `global-backend` 独立完成）
- 不实现搜索/过滤功能（后续迭代）
- 不实现"全选"/"清空"操作（后续迭代）
- 不处理网络请求或错误状态

## Decisions

### 1. targetPath 算法

使用 `path` 字符串操作而非 Node.js `path` 模块，因为该函数在浏览器环境运行。

算法：找到最后一个 `.` 的位置，在扩展名前插入 `.{language}`。
- `README.md` + `zh-CN` → `README.zh-CN.md`
- `docs/guide.markdown` + `ja` → `docs/guide.ja.markdown`

### 2. MarkdownFilePicker 组件接口

```typescript
interface MarkdownFile {
  path: string;
  size_bytes: number;
  is_default_readme: boolean;
  disabled_reason: string | null;
  target_path_preview: string;
  target_exists: boolean;
}

interface MarkdownFilePickerProps {
  files: MarkdownFile[];
  selectedPaths: string[];
  onSelectionChange: (paths: string[]) => void;
  maxFiles?: number; // default 10
}
```

组件为受控组件，通过 `selectedPaths` 和 `onSelectionChange` 管理状态。默认选中逻辑在组件外部处理（由父组件在文件列表加载时设置初始选中路径）。

### 3. 禁用逻辑分层

- 后端 `disabled_reason`：文件本身不可选（如超大文件）
- 前端选择限制：已达 10 文件上限时，未选中的文件变为禁用

### 4. 测试策略

- `targetPath.test.ts`：纯函数测试，覆盖 `.md`、`.markdown`、嵌套路径
- `MarkdownFilePicker.test.tsx`：React Testing Library 组件测试，覆盖默认选中、禁用原因、选择限制、大小统计

## Risks / Trade-offs

- [风险] 无后端联调 → 使用 mock 数据测试，实际集成时可能需要调整字段名
- [权衡] 搜索功能延后 → 文件多时用户体验下降，但 MVP 优先
