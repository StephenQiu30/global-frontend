## Context

当前项目是 `global-frontend` 的 Symphony 工作区副本，用于协作规范沉淀。本次需要从零搭建 Next.js 前端骨架，实现 PRD 01 要求的 GitHub App 安装入口和回调界面。

现有仓库结构：
- `CLAUDE.md` / `WORKFLOW.md`：协作规范
- `openspec/`：SDD 规范层
- `docs/`：文档骨架
- 无现有前端代码或 `package.json`

## Goals / Non-Goals

**Goals:**
- 搭建最小可用的 Next.js App Router 项目
- 实现 InstallCard 组件（安装按钮 + 权限说明）
- 实现 callback 页面（installation_id 处理）
- 配置 Vitest 测试框架
- 保持 TDD 流程：先写测试，再写实现

**Non-Goals:**
- 后端 installation verification 实现
- GitHub token 管理或 OAuth 登录
- 数据库集成
- 部署配置

## Decisions

### 1. 测试框架：Vitest

**选择 Vitest 而非 Jest**
- Vitest 与 Vite 生态集成更好，配置更简单
- 原生支持 TypeScript，无需额外 transform 配置
- 与 Next.js 14+ 兼容性良好

### 2. 组件测试：@testing-library/react

**选择 Testing Library**
- 推荐以用户行为为中心的测试方式
- 与 Vitest 集成良好
- 避免测试实现细节

### 3. 状态管理：本地 state

**选择 React useState 而非外部状态库**
- 安装状态展示是简单场景，无需 Redux/Zustand
- 减少依赖复杂度
- 符合最小闭环原则

### 4. 环境变量：NEXT_PUBLIC_ 前缀

**使用 Next.js 约定**
- `NEXT_PUBLIC_GITHUB_APP_INSTALL_URL` 在客户端可用
- 不在前端存储敏感配置

## Risks / Trade-offs

### 风险：Vitest 与 Next.js 兼容性
- **缓解**：使用 `@vitejs/plugin-react`，配置 `vitest.config.ts`
- **回退**：如果遇到兼容性问题，可切换到 Jest

### 风险：无后端集成测试
- **缓解**：callback 页面设计为纯展示层，后端逻辑通过 props 接口隔离
- **验证**：通过 mock 测试覆盖边界情况

### 风险：环境变量未配置
- **缓解**：`.env.example` 提供文档，组件处理未配置时的默认状态
- **验证**：测试覆盖 `NEXT_PUBLIC_GITHUB_APP_INSTALL_URL` 缺失场景

## Migration Plan

1. 初始化 `package.json` 和依赖
2. 配置 TypeScript、Vitest、Next.js
3. 实现组件（TDD 流程）
4. 验证：`npm test && npm run build`
5. 提交并创建 PR

**回滚策略**：如果实现遇到不可解决的兼容性问题，可回退到纯 HTML 骨架，移除 Vitest 依赖。
