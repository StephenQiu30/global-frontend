## Why

用户需要从 Web 应用安装 GitHub App，以便后续进行仓库授权、文件扫描和翻译任务。当前项目缺少前端安装入口、回调页面和状态展示，无法完成 PRD 01 的核心用户流程。

## What Changes

- 新增 Next.js App Router 骨架（`src/app/` 结构）
- 新增首页安装 CTA 组件 `InstallCard`
- 新增安装回调页面 `src/app/install/callback/page.tsx`
- 新增 `.env.example` 中的 GitHub App 安装 URL 配置
- 新增安装状态展示（成功/错误状态）

## Capabilities

### New Capabilities
- `github-app-install`: GitHub App 安装入口、回调处理和状态展示的前端实现
- `nextjs-app-scaffold`: Next.js App Router 项目骨架，包含 TypeScript、测试配置

### Modified Capabilities
（无现有 capability 需要修改）

## Impact

- 新增文件：`src/app/page.tsx`、`src/components/InstallCard.tsx`、`src/app/install/callback/page.tsx`
- 配置变更：`.env.example` 增加 `NEXT_PUBLIC_GITHUB_APP_INSTALL_URL`
- 依赖：需要 `next`、`react`、`typescript`、`@testing-library/react`、`vitest` 或 `jest`
- 不涉及后端实现、token 管理或 OAuth 登录
