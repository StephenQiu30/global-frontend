# Specs: Task Status and Result Display

## S1: Task Status Values

The system SHALL support these task statuses: `queued`, `running`, `succeeded`, `failed`.

## S2: Task Result Data Shape

The task result response SHALL include:
- `taskId`: unique task identifier
- `status`: one of the four status values
- `repository`: repository full name
- `targetLanguage`: translation target language code
- `selectedFiles`: array of source file paths
- `prUrl`: pull request URL (present only when status is `succeeded`)
- `prTitle`: pull request title (present only when status is `succeeded`)
- `fileMappings`: array of `{source, target}` path pairs (present only when status is `succeeded`)
- `errorCode`: machine-readable error identifier (present only when status is `failed`)
- `errorMessage`: human-readable error description (present only when status is `failed`)
- `retryable`: boolean indicating if retry is recommended (present only when status is `failed`)

## S3: Task Result Component - Success State

When status is `succeeded`, the component MUST:
- Display PR title as a link to `prUrl` with text "查看 Pull Request"
- Display each file mapping as `sourcePath -> targetPath`
- Display translation language

## S4: Task Result Component - Failure State

When status is `failed`, the component MUST:
- Display error message prominently
- Display a "返回修改" button that navigates to `/translate`
- NOT display raw stack traces or internal error details

## S5: Task Status Page - Polling

The task page MUST:
- Poll `GET /api/translation-tasks/{taskId}` every 2 seconds
- Stop polling when status is `succeeded` or `failed`
- Timeout after 2 minutes of polling and display "任务仍在处理或已超时"
- Display loading indicator while polling

## S6: Task Status Page - Navigation

- Success state: user can click PR link to open GitHub
- Failure state: user can click "返回修改" to return to `/translate`
- Timeout state: user can click "返回修改" to return to `/translate`

## Validation Scenarios

1. **Success path**: Task completes with PR link visible and file mappings displayed
2. **Failure path**: Task fails with error message visible and retry button functional
3. **Loading path**: Loading indicator shown during polling
4. **Timeout path**: Timeout message shown after 2 minutes, retry button available
