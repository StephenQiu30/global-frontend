# Tasks: 公开仓库翻译预览界面

## Task 1: 创建 PreviewResult 组件
- [ ] 1.1 创建 `src/components/PreviewResult.tsx`
- [ ] 1.2 实现预览内容展示
- [ ] 1.3 实现下载按钮
- [ ] 1.4 实现安装 GitHub App CTA
- [ ] 1.5 创建 `src/components/PreviewResult.test.tsx` 验证所有验收标准

## Task 2: 创建 PublicRepositoryPreview 组件
- [ ] 2.1 创建 `src/components/PublicRepositoryPreview.tsx`
- [ ] 2.2 实现 URL 输入表单
- [ ] 2.3 实现语言选择下拉框
- [ ] 2.4 实现表单验证

## Task 3: 创建 PreviewPage 组件
- [ ] 3.1 创建 `src/components/PreviewPage.tsx`
- [ ] 3.2 集成 PublicRepositoryPreview 和 PreviewResult
- [ ] 3.3 实现状态管理（输入/预览切换）
- [ ] 3.4 创建 `src/components/PreviewPage.test.tsx` 验证页面标题和只读声明

## Task 4: 验证和文档
- [ ] 4.1 运行自动化测试 `npm test`
- [ ] 4.2 验证所有验收标准
- [ ] 4.3 更新 OpenSpec change 状态

## Validation Commands

```bash
# 运行所有测试
npm test

# 运行特定测试
npm test -- src/components/PreviewPage.test.tsx src/components/PreviewResult.test.tsx
```
