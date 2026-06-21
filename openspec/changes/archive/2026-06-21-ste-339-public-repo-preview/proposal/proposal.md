# Proposal: 公开仓库翻译预览界面 (STE-339)

## Summary

为二期功能提供公开 GitHub 仓库的只读翻译预览页面。用户输入公开仓库 URL，选择目标语言，系统读取公开 Markdown 文件并生成翻译预览，引导用户安装 GitHub App 后提交 PR。

## Motivation

PRD 10 定义了二期能力：支持未安装 GitHub App 的用户预览公开仓库翻译效果。这降低了用户使用门槛，让用户先确认翻译质量再决定是否安装 App。

## Scope

### In scope
- 公开仓库 URL 输入表单
- 目标语言选择
- 翻译预览结果展示
- 翻译文件下载
- 安装 GitHub App CTA（引导用户安装后提交 PR）

### Out of scope
- fork PR 流程
- OAuth 用户授权
- 未授权 GitHub 写入操作
- 实际翻译 API 调用（使用 mock 数据）

### Non-goals
- 预览页不得承诺会直接提交到 GitHub
- 不处理私有仓库
- 不执行任何写入操作

## Affected files

- `src/components/PreviewPage.tsx` - 主预览页面组件
- `src/components/PublicRepositoryPreview.tsx` - 公开仓库输入表单
- `src/components/PreviewResult.tsx` - 预览结果展示
- `src/components/PreviewPage.test.tsx` - 预览页面测试
- `src/components/PreviewResult.test.tsx` - 预览结果测试

## Verification

- 自动化测试: `npm test -- src/components/PreviewPage.test.tsx src/components/PreviewResult.test.tsx`
- 手动验证: 输入公开仓库 mock 数据，确认只显示预览和安装 CTA
- Agent Review: 检查二期 UI 是否和首版授权写入边界隔离
