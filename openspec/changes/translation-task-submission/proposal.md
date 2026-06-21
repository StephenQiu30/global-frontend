# Proposal: Translation Task Submission Page

## Summary

Create `/translate` page that composes RepositorySelector, MarkdownFilePicker, and LanguageSelector to submit translation tasks via `POST /api/translation-tasks`.

## Normative files changed

- `src/app/translate/page.tsx` — new page
- `src/lib/api.ts` — new API client
- `src/lib/languages.ts` — new language constants

## Scope

- Submit button disabled until repo, files, and language are all selected
- Construct payload matching backend `TranslateTaskRequest` contract
- Handle success (navigate to `/tasks/{task_id}`) and failure (display error)
- Loading state during submission

## Non-goals

- Backend task runner implementation
- PR creation logic
- Task queue or async processing
- Real component implementations (RepositorySelector, MarkdownFilePicker, LanguageSelector are out-of-scope stubs)
