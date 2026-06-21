# Design: 公开仓库翻译预览界面

## Architecture

采用 React 组件架构，与现有项目风格一致：

```
PreviewPage (主页面)
├── PublicRepositoryPreview (输入表单)
│   ├── 仓库 URL 输入
│   └── 语言选择下拉框
└── PreviewResult (预览结果)
    ├── 翻译内容预览
    ├── 下载按钮
    └── 安装 GitHub App CTA
```

## Component Design

### PreviewPage
- 主容器组件，管理状态流转
- 使用 `useState` 管理当前步骤（输入/预览）
- 使用 Tailwind CSS 进行样式设计

### PublicRepositoryPreview
- 表单组件，接收 `onSubmit` 回调
- 包含 URL 输入框和语言选择
- 基本的表单验证

### PreviewResult
- 展示组件，接收预览数据
- 包含翻译内容、下载按钮和 CTA
- 使用 lucide-react 图标

## State Flow

```
初始状态 → 输入仓库信息 → 展示预览结果
         ↑               ↓
         └── 返回修改 ←──┘
```

## UI Patterns

遵循现有项目风格：
- 使用 `cn()` 工具函数进行 className 合并
- 使用 lucide-react 图标
- 使用 Tailwind CSS 类名
- 使用中文文案

## Failure Handling

- URL 无效: 在表单中显示错误提示
- 非公开仓库: 显示权限说明
- 网络错误: 显示通用错误提示

## Rollback

纯前端组件，无持久化状态，移除文件即可回滚。
