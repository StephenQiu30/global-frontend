# Design: Task Status and Result Display

## Architecture

```
GET /api/translation-tasks/{taskId}
         │
         ▼
┌─────────────────┐
│   TaskPage      │  ← polls every 2s, max 2min
│   (useEffect)   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   TaskResult    │  ← pure presentational component
│   (stateless)   │
└─────────────────┘
```

## Component Design

### TaskResult

- **Props**: `TaskResultData` (success or failure shape)
- **Rendering**: Conditional based on `status` field
- **Success**: PR link, file mappings, language badge
- **Failure**: Error message, retry button
- **No internal state**: Pure presentational

### TaskPage

- **Route**: `/tasks/[taskId]`
- **State**: `taskResult | null`, `isLoading`, `isTimeout`
- **Polling**: `useEffect` with `setInterval` (2s) and timeout guard (2min)
- **Cleanup**: Clear interval on unmount or terminal status
- **API call**: `getTaskStatus(taskId)` from `@/lib/api`

## API Contract

Extend `@/lib/types.ts`:
```typescript
export type TaskStatus = 'queued' | 'running' | 'succeeded' | 'failed';

export interface FileMapping {
  source: string;
  target: string;
}

export interface TaskResultData {
  taskId: string;
  status: TaskStatus;
  repository: string;
  targetLanguage: string;
  selectedFiles: string[];
  prUrl?: string;
  prTitle?: string;
  fileMappings?: FileMapping[];
  errorCode?: string;
  errorMessage?: string;
  retryable?: boolean;
}
```

Extend `@/lib/api.ts`:
```typescript
export async function getTaskStatus(taskId: string): Promise<TaskResultData>
```

## Error Handling

- Network errors during polling: Continue polling, show last known state
- `task_not_found` response: Treat as failed state with specific error message
- Timeout: Display message with retry action

## Testing Strategy

1. **TaskResult.test.tsx**: Render success/failure states, verify text and links
2. **page.test.tsx**: Mock API, verify polling behavior, timeout, navigation
3. **E2E**: Mock backend success response, verify PR link and file mappings visible
