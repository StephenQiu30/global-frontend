# Design: 仓库地址输入与授权校验

## Architecture

```
┌─────────────────────────────────────────────┐
│                  Frontend                   │
│                                             │
│  ┌──────────────────────────────────────┐  │
│  │     RepositorySelector Component     │  │
│  │  ┌────────────────────────────────┐  │  │
│  │  │     parseRepositoryInput()    │  │  │
│  │  │     (src/lib/repository.ts)   │  │  │
│  │  └────────────────────────────────┘  │  │
│  └──────────────────────────────────────┘  │
│                     │                       │
│                     ▼                       │
│  ┌──────────────────────────────────────┐  │
│  │   POST /api/repositories/resolve    │  │
│  └──────────────────────────────────────┘  │
└─────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────┐
│                  Backend                    │
│                                             │
│  ┌──────────────────────────────────────┐  │
│  │   Repository Authorization Check    │  │
│  │   (out of scope for this ticket)    │  │
│  └──────────────────────────────────────┘  │
└─────────────────────────────────────────────┘
```

## Data Flow

1. 用户输入仓库地址
2. 前端调用 `parseRepositoryInput()` 解析
3. 解析成功后调用后端 API
4. 后端返回授权状态
5. 前端展示结果

## Error Handling

```
输入验证 (前端)          API 调用 (前端)          后端响应
     │                       │                       │
     ▼                       ▼                       ▼
┌─────────┐            ┌─────────┐            ┌─────────┐
│  格式   │            │  网络   │            │  业务   │
│  错误   │            │  错误   │            │  错误   │
└─────────┘            └─────────┘            └─────────┘
     │                       │                       │
     ▼                       ▼                       ▼
  直接显示              重试提示              转换为可读文案
```

## Component API

```typescript
interface RepositorySelectorProps {
  onRepositoryVerified?: (repo: RepositoryInfo) => void;
}

interface RepositoryInfo {
  owner: string;
  repo: string;
  fullName: string;
  defaultBranch: string;
  visibility: 'public' | 'private';
  isAuthorized: boolean;
}

interface ParseResult {
  success: boolean;
  data?: { owner: string; repo: string; fullName: string };
  error?: string;
}
```

## Validation Strategy

1. 前端先做格式校验（快速反馈）
2. 后端做授权校验（权威验证）
3. 错误信息转换为用户可读文案
