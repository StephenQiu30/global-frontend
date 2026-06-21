# Spec: Translation Task Submission

## Requirements

### Payload Contract

The frontend MUST send `POST /api/translation-tasks` with JSON body:

```json
{
  "repository": { "owner": "string", "repo": "string", "fullName": "string", "defaultBranch": "string" },
  "files": [{ "path": "string", "targetPath": "string" }],
  "targetLanguage": "string (BCP 47 code)"
}
```

### Submit Button State

- Submit button MUST be disabled when repository is not selected
- Submit button MUST be disabled when no files are selected
- Submit button MUST be disabled when target language is not selected
- Submit button MUST be enabled only when all three selections are valid

### Success Path

- On successful response (`200` with `task_id`), navigate to `/tasks/{task_id}`
- Display loading indicator during submission

### Failure Path

- On error response, display error message to user
- Re-enable submit button after error
- Error message MUST be visible and dismissible

### Validation Evidence

- Automated test: `npm test -- src/app/translate/page.test.tsx`
- Tests MUST cover: disabled state, payload construction, success navigation, error display
