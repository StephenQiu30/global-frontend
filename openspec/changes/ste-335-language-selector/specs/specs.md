# Specs: 目标语言选择器

## Language Constants (`src/lib/languages.ts`)

1. `SUPPORTED_LANGUAGES` SHALL 包含且仅包含以下 8 种语言：
   - `zh-CN` (简体中文), `zh-TW` (繁体中文), `en` (English), `ja` (日本語), `ko` (한국어), `fr` (Français), `de` (Deutsch), `es` (Español)
2. 每个 Language 对象 SHALL 包含 `code: string` 和 `label: string`。
3. `DEFAULT_LANGUAGE` SHALL 为 `'zh-CN'`。
4. `SUPPORTED_LANGUAGES` 顺序 SHALL 固定不变（zh-CN, zh-TW, en, ja, ko, fr, de, es）。

## LanguageSelector Component (`src/components/LanguageSelector.tsx`)

1. SHALL 渲染标签文本 `目标语言`。
2. SHALL 默认选中 `zh-CN`。
3. SHALL 展示语言名称（label）和代码（code）。
4. SHALL 支持搜索过滤：输入文字可按 label 或 code 匹配。
5. SHALL 通过 `onChange` 回调向父组件传递选中的 language code。
6. SHALL 接受 `value` prop 用于受控模式。
7. SHALL 接受可选 `getTargetPath` 函数 prop，用于渲染文件目标路径预览。
8. 不 SHALL 接受或渲染不在 `SUPPORTED_LANGUAGES` 中的语言。

## Failure paths

1. 空搜索结果 SHALL 显示"无匹配语言"提示。
2. 传入不在列表中的 `value` SHALL 回退到 `DEFAULT_LANGUAGE`。

## Validation evidence

- `npm test -- src/lib/languages.test.ts` SHALL 全部通过
- `npm test -- src/components/LanguageSelector.test.tsx` SHALL 全部通过
