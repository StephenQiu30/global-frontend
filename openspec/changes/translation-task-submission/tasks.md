# Tasks: Translation Task Submission

## Task 1: API Client

**Files:** `src/lib/api.ts`, `src/lib/api.test.ts`
- [ ] Define `TranslationTaskRequest` and `TranslationTaskResponse` types
- [ ] Implement `submitTranslationTask(request)` function
- [ ] Test payload construction and error handling

## Task 2: Language Constants

**Files:** `src/lib/languages.ts`, `src/lib/languages.test.ts`
- [ ] Define `SUPPORTED_LANGUAGES` array with code and label
- [ ] Define `DEFAULT_LANGUAGE` as `zh-CN`
- [ ] Test all required language codes exist

## Task 3: Translate Page Tests (Red)

**Files:** `src/app/translate/page.test.tsx`
- [ ] Test submit button disabled when no repository selected
- [ ] Test submit button disabled when no files selected
- [ ] Test submit button disabled when no language selected
- [ ] Test submit button enabled when all selections valid
- [ ] Test successful submission navigates to task page
- [ ] Test error response displays error message
- [ ] Test loading state during submission

## Task 4: Translate Page Implementation (Green)

**Files:** `src/app/translate/page.tsx`
- [ ] Implement page component with selection state management
- [ ] Wire up submit button validation logic
- [ ] Call API client on submit
- [ ] Handle success navigation and error display
- [ ] All tests pass

## Verification

```bash
npm test -- src/app/translate/page.test.tsx src/lib/api.test.ts src/lib/languages.test.ts
npm run build
```
