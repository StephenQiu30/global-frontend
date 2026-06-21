# Design: Translation Task Submission

## Architecture

The `/translate` page is a client component that:
1. Manages selection state for repository, files, and language
2. Renders RepositorySelector, MarkdownFilePicker, LanguageSelector
3. Validates selections before enabling submit
4. Calls `submitTranslationTask()` from `src/lib/api.ts`
5. Handles loading, success, and error states

## Component Interface

The page accepts child component props for flexibility and testability:
- `RepositorySelector` — emits `onRepositoryVerified(repo: RepositoryInfo | null)`
- `MarkdownFilePicker` — emits `onSelectionChange(selectedPaths: string[])`
- `LanguageSelector` — emits `onChange(languageCode: string)`

Since these components are not yet implemented (PRD 02/03/04), the page defines
type interfaces and accepts rendered children or stub components via props.

## API Client

`src/lib/api.ts` exports `submitTranslationTask(request)` that:
- POSTs to `${NEXT_PUBLIC_API_BASE_URL}/api/translation-tasks`
- Returns `{ taskId: string }` on success
- Throws on non-2xx response

## Failure Handling

- Network errors → display generic error message
- 4xx responses → display server-provided error message
- Re-enable form after error
