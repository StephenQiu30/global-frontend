# Proposal: 实现仓库地址输入与授权校验界面

## Summary

为 GitHub Markdown Translator 添加前端仓库地址解析和授权校验功能，让用户可以输入或选择 GitHub 仓库，并在前端看到授权校验状态。

## Motivation

PRD 02 要求用户只需上传/输入 GitHub 仓库地址，系统解析并确认是否已授权。这是翻译流程的入口，需要在前端提供良好的用户体验。

## Scope

### In scope

- `https://github.com/owner/repo` 输入解析
- `github.com/owner/repo` 输入解析
- `owner/repo` 输入解析
- 授权状态展示
- 错误提示

### Out of scope

- SSH URL
- GitHub 子路径
- 公开仓库 fallback
- 后端 resolver 实现

### Non-goals

- 不在前端绕过后端授权校验

## Impact

- 新增 `src/lib/repository.ts`
- 新增 `src/components/RepositorySelector.tsx`
- 新增测试文件

## Risks

- 前端 parser 需要与后端规则保持一致
- 需要处理各种错误场景
