## 1. 项目初始化

- [ ] 1.1 创建 `package.json`（Next.js 14+, React 18+, TypeScript）
- [ ] 1.2 创建 `tsconfig.json`（strict 模式，paths alias）
- [ ] 1.3 创建 `vitest.config.ts`（@testing-library/react 集成）
- [ ] 1.4 创建 `next.config.js`
- [ ] 1.5 更新 `.env.example`（添加 `NEXT_PUBLIC_GITHUB_APP_INSTALL_URL`）
- [ ] 1.6 安装依赖并验证 `npm install` 通过

## 2. 测试框架验证

- [ ] 2.1 创建 `src/app/layout.tsx`（基础 layout）
- [ ] 2.2 创建 `src/app/page.tsx`（占位首页）
- [ ] 2.3 验证 `npm test` 运行通过（空测试套件）
- [ ] 2.4 验证 `npm run build` 运行通过

## 3. InstallCard 组件 TDD

- [ ] 3.1 创建 `src/components/InstallCard.test.tsx`（red 测试：渲染安装按钮、跳转 URL）
- [ ] 3.2 运行测试确认 red 失败
- [ ] 3.3 创建 `src/components/InstallCard.tsx`（green 实现）
- [ ] 3.4 运行测试确认 green 通过

## 4. Callback 页面 TDD

- [ ] 4.1 创建 `src/app/install/callback/page.test.tsx`（red 测试：installation_id 成功、缺失错误）
- [ ] 4.2 运行测试确认 red 失败
- [ ] 4.3 创建 `src/app/install/callback/page.tsx`（green 实现）
- [ ] 4.4 运行测试确认 green 通过

## 5. 首页集成

- [ ] 5.1 更新 `src/app/page.tsx` 集成 InstallCard
- [ ] 5.2 验证首页展示安装入口

## 6. 验证与提交

- [ ] 6.1 运行完整验证：`npm test && npm run build`
- [ ] 6.2 创建 `test:` 提交（测试文件）
- [ ] 6.3 创建 `impl:` 提交（实现文件）
- [ ] 6.4 创建 `feat:` 提交（首页集成）
- [ ] 6.5 推送分支并创建 PR
