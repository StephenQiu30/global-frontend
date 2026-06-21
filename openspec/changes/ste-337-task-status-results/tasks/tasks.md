# Tasks: Task Status and Result Display

## Task 1: Extend API Types

**Files:**
- Modify: `src/lib/types.ts`

**Steps:**
- [ ] Add `TaskStatus` type union
- [ ] Add `FileMapping` interface
- [ ] Add `TaskResultData` interface with optional success/failure fields

**Acceptance:**
- Types compile without errors
- Success and failure shapes are distinguishable by `status` field

## Task 2: Extend API Client

**Files:**
- Modify: `src/lib/api.ts`

**Steps:**
- [ ] Add `getTaskStatus(taskId: string): Promise<TaskResultData>` function
- [ ] Use same `API_BASE_URL` pattern as `submitTranslationTask`
- [ ] Handle non-2xx responses consistently

**Acceptance:**
- Function returns typed `TaskResultData`
- Error responses throw with message from body

## Task 3: Implement TaskResult Component

**Files:**
- Create: `src/components/TaskResult.tsx`
- Create: `src/components/TaskResult.test.tsx`

**Steps:**
- [ ] Write failing test for success state: PR link text "查看 Pull Request" is visible
- [ ] Write failing test for success state: file mapping "README.md -> README.zh-CN.md" is visible
- [ ] Write failing test for failure state: error message is visible
- [ ] Write failing test for failure state: "返回修改" button is visible and navigates to /translate
- [ ] Implement component with conditional rendering based on `status`
- [ ] Run tests, expect pass

**Acceptance:**
- Success shows PR link and file mappings
- Failure shows error message and retry button
- All unit tests pass

## Task 4: Implement Task Status Page

**Files:**
- Create: `src/app/tasks/[taskId]/page.tsx`
- Create: `src/app/tasks/[taskId]/page.test.tsx`

**Steps:**
- [ ] Write failing test: page shows loading state initially
- [ ] Write failing test: page polls API and displays success result
- [ ] Write failing test: page polls API and displays failure result
- [ ] Write failing test: page shows timeout message after 2 minutes
- [ ] Write failing test: page stops polling on terminal status
- [ ] Implement page with useEffect polling (2s interval, 2min max)
- [ ] Render TaskResult component with fetched data
- [ ] Run tests, expect pass

**Acceptance:**
- Polling works correctly
- Terminal states stop polling
- Timeout displays appropriate message
- All unit tests pass

## Task 5: Bootstrap Workspace

**Steps:**
- [ ] Copy package.json, tsconfig.json, vitest.config.ts, vitest.setup.ts from STE-336
- [ ] Copy src/lib/types.ts, src/lib/api.ts from STE-336
- [ ] Copy src/app/layout.tsx from STE-336
- [ ] Install dependencies with npm install

## Task 6: E2E Smoke Test

**Files:**
- Create: `tests/e2e/task-result.spec.ts`

**Steps:**
- [ ] Add Playwright test with mocked backend success result
- [ ] Assert PR link is visible with correct href
- [ ] Assert file mapping is visible

**Acceptance:**
- E2E test passes
