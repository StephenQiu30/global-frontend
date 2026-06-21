# Tasks: 目标语言选择器

## Task 3: Frontend Language Constants

**Files:** `src/lib/languages.ts`, `src/lib/languages.test.ts`

- [ ] 3.1 写红灯测试：验证 `zh-CN` 是默认语言、所有 8 种语言 code 存在、顺序正确
- [ ] 3.2 实现 `Language` interface、`SUPPORTED_LANGUAGES`、`DEFAULT_LANGUAGE`
- [ ] 3.3 运行 `npm test -- src/lib/languages.test.ts`，确认绿灯
- [ ] 3.4 提交: `test:` + `impl:`

## Task 4: Frontend LanguageSelector Component

**Files:** `src/components/LanguageSelector.tsx`, `src/components/LanguageSelector.test.tsx`

- [ ] 4.1 写红灯测试：切换语言从 `zh-CN` 到 `ja`，验证 `onChange` 被调用
- [ ] 4.2 写红灯测试：搜索过滤，输入 `Japanese` 或 `日` 过滤列表
- [ ] 4.3 写红灯测试：搜索无结果显示"无匹配语言"
- [ ] 4.4 写红灯测试：受控 `value` prop 生效
- [ ] 4.5 实现 `LanguageSelector` 组件（可搜索 combobox）
- [ ] 4.6 运行 `npm test -- src/components/LanguageSelector.test.tsx`，确认绿灯
- [ ] 4.7 提交: `test:` + `feat:`

## Task 5: Workspace Setup

**Files:** `package.json`, `vitest.config.ts`, `vitest.setup.ts`, `tsconfig.json`

- [ ] 5.1 复制 STE-336 的测试基础设施配置
- [ ] 5.2 安装依赖
- [ ] 5.3 验证 `npm test` 可运行

## Verification

```bash
npm test -- src/lib/languages.test.ts src/components/LanguageSelector.test.tsx
```
