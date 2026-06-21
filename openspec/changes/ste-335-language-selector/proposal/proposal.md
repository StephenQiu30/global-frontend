# Proposal: 目标语言选择器

## Summary

为 global-frontend 添加目标语言选择能力：语言常量模块和可搜索 LanguageSelector 组件，支持文件目标路径预览联动。

## Normative files changed

- `src/lib/languages.ts` (new)
- `src/lib/languages.test.ts` (new)
- `src/components/LanguageSelector.tsx` (new)
- `src/components/LanguageSelector.test.tsx` (new)

## Scope

- In scope: 8 种首版语言常量、默认 `zh-CN`、可搜索下拉选择器、`onChange` 回调、路径预览联动
- Out of scope: 自定义语言输入、术语表、多语言批量翻译、后端 API
- Non-goals: 不让用户输入任意文件后缀

## PRD reference

`docs/prd/github-translator/04-language-selection.md`

## Plan reference

`docs/plans/github-translator/04-language-selection-plan.md` (Task 3 + Task 4)
