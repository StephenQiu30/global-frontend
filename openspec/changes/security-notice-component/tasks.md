## 1. 测试先行（红灯）

- [x] 1.1 创建 `src/components/SecurityNotice.test.tsx`，编写测试验证：
  - 组件渲染 `不会覆盖原始文件` 文案
  - 组件渲染 `所有变更通过 Pull Request 审核` 文案
  - 组件渲染 token 保护提示
  - 组件处理 unauthorized 错误码显示对应文案
  - 组件处理 path 错误码显示对应文案
  - 组件处理 size 错误码显示对应文案
- [x] 1.2 运行测试确认红灯：`npm test -- src/components/SecurityNotice.test.tsx`

## 2. 组件实现（绿灯）

- [x] 2.1 创建 `src/components/SecurityNotice.tsx`，实现：
  - 函数式组件，TypeScript props interface
  - 安全提示文案渲染（no-overwrite、PR-only、token protection）
  - 错误码到用户友好文案的映射
  - Tailwind CSS 样式，cn() 工具
- [x] 2.2 运行测试确认绿灯：`npm test -- src/components/SecurityNotice.test.tsx`

## 3. 验证与文档

- [x] 3.1 验证所有测试通过
- [x] 3.2 更新 OpenSpec tasks.md 标记完成项
- [x] 3.3 更新 workpad 验证记录

## 4. 提交与 PR

- [ ] 4.1 提交测试文件：`test: 添加 SecurityNotice 组件测试`
- [ ] 4.2 提交实现文件：`impl: 实现 SecurityNotice 组件`
- [ ] 4.3 创建 PR 并关联 Linear ticket
