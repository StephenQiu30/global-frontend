# Tasks: 仓库地址输入与授权校验

## Task 1: 前端仓库地址解析器

**Files:**
- Create: `src/lib/repository.ts`
- Test: `src/lib/repository.test.ts`

**Steps:**
- [ ] 编写失败测试，覆盖支持和拒绝的输入格式
- [ ] 实现 `parseRepositoryInput(input)` 函数
- [ ] 返回 `{ owner, repo, fullName }`
- [ ] 对非法输入抛出用户可读错误
- [ ] 运行: `npm test -- src/lib/repository.test.ts`
- [ ] Commit: `impl:` 添加前端仓库地址解析

**Acceptance:**
- 前端能在调用后端前捕获明显的无效输入

## Task 2: 前端仓库选择器组件

**Files:**
- Create: `src/components/RepositorySelector.tsx`
- Test: `src/components/RepositorySelector.test.tsx`

**Steps:**
- [ ] 编写失败测试，输入 `owner/repo` 并点击校验按钮
- [ ] 实现文本输入、校验按钮、状态展示和错误状态
- [ ] 连接后端 `POST /api/repositories/resolve` API
- [ ] 展示仓库全名、默认分支、可见性和授权状态
- [ ] 运行: `npm test -- src/components/RepositorySelector.test.tsx`
- [ ] Commit: `feat:` 添加仓库选择和授权校验界面

**Acceptance:**
- 用户可以在 Markdown 扫描前输入或选择已授权仓库

## Verification

Frontend:

```bash
npm test -- src/lib/repository.test.ts src/components/RepositorySelector.test.tsx
```
