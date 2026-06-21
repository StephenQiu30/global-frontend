## Why

PRD 09 要求前端在用户提交翻译前明确展示安全边界，防止用户误解系统会直接修改默认分支或上传 token。首版需要在翻译页添加 SecurityNotice 组件，展示"不会覆盖原始文件"和"所有变更通过 Pull Request 审核"的安全提示，并处理后端返回的安全错误文案。

## What Changes

- 新增 `SecurityNotice` 组件，展示安全提示文案
- 在翻译页集成 SecurityNotice 组件
- 处理后端返回的 unauthorized/path/size 错误，提供可读提示
- 添加组件单元测试

## Capabilities

### New Capabilities

- `security-notice`: 前端安全提示组件，展示 no-overwrite、PR-only、no-token-in-frontend 等安全边界信息，并处理后端安全错误文案

### Modified Capabilities

- 无（首版新增，不修改现有 spec）

## Impact

- 新增文件：`src/components/SecurityNotice.tsx`、`src/components/SecurityNotice.test.tsx`
- 修改文件：`src/app/translate/page.tsx`（集成 SecurityNotice）
- 依赖：无新增依赖，使用现有 React + Tailwind CSS
- 后端：无变更，后端仍为最终安全强制边界
