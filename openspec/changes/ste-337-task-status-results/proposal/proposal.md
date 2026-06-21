# Proposal: Task Status and Result Display (STE-337)

## Summary

Implement frontend components to display translation task status, success results with PR links and file mappings, and actionable failure messages with retry guidance.

## Motivation

Users submitting translation tasks need clear visibility into task outcomes. Without result display, users cannot determine whether to review a PR on GitHub or fix their input and retry.

## Scope

- `TaskResult` component for success/failure rendering
- Task status page at `/tasks/[taskId]` with polling
- API types for task result data
- Unit tests and E2E smoke test

## Non-Goals

- WebSocket real-time updates
- Full async queue backend implementation
- Real-time progress percentage display
- Raw stack trace exposure to users

## Affected Files

- `src/components/TaskResult.tsx` (new)
- `src/app/tasks/[taskId]/page.tsx` (new)
- `src/lib/types.ts` (extend)
- `src/lib/api.ts` (extend)
- `src/components/TaskResult.test.tsx` (new)
- `src/app/tasks/[taskId]/page.test.tsx` (new)
- `tests/e2e/task-result.spec.ts` (new)

## PRD Reference

`docs/prd/github-translator/08-task-status-and-results.md`
