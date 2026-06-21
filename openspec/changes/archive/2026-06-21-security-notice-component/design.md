## Context

PRD 09 要求前端在翻译页展示安全边界信息，让用户在提交翻译任务前了解：原始文件不会被覆盖、所有变更通过 PR 审核、敏感凭据不由前端处理。这是首版安全提示，后端仍是最终安全强制边界。

当前项目为 planning/spec 仓库，无 src/ 目录。需创建组件文件结构，等待后续与翻译页集成。

## Goals / Non-Goals

**Goals:**
- 创建 SecurityNotice 组件，展示安全提示文案
- 处理后端安全错误（unauthorized/path/size），提供可读提示
- 组件可独立测试，遵循 shadcn/ui 风格

**Non-Goals:**
- 不实现后端安全 enforcement（后端职责）
- 不处理计费额度、组织 RBAC
- 不把前端提示当作安全保证

## Decisions

### 1. 组件结构：函数式组件 + TypeScript props

**选择**: 使用函数式组件，TypeScript interface 定义 props，导出命名函数

**理由**: 遵循项目既有模式（shadcn/ui 风格），类型安全，易于测试

**替代方案**: class 组件（不符合项目风格）

### 2. 错误处理：统一 error mapping

**选择**: 创建 error code 到用户友好文案的映射，组件根据 error code 渲染对应提示

**理由**: 集中管理错误文案，易于维护和国际化

**替代方案**: 在组件内硬编码错误文案（不利于维护）

### 3. 测试策略：Vitest + React Testing Library

**选择**: 使用 Vitest + @testing-library/react 进行组件测试

**理由**: 项目技术栈指定 Vitest，testing-library 是 React 组件测试标准

**替代方案**: Jest（项目已选定 Vitest）

### 4. 样式方案：Tailwind CSS

**选择**: 使用 Tailwind CSS 类名，cn() 工具合并样式

**理由**: 遵循项目 Tailwind CSS 技术栈，与现有组件风格一致

**替代方案**: CSS modules（项目使用 Tailwind）

## Risks / Trade-offs

- [风险] 前端提示可能被误解为安全保证 → [缓解] 文案措辞明确为"提示"而非"保证"，Agent Review 检查
- [风险] 后端错误码可能变更 → [缓解] 错误映射集中管理，易于更新
- [风险] 组件无 src/ 目录结构 → [缓解] 创建目录结构，组件可独立存在等待集成

## Migration Plan

1. 创建 src/components/ 目录结构
2. 实现 SecurityNotice 组件
3. 创建测试文件
4. 后续 PRD 05 实现 translate page 时集成组件

## Open Questions

- 无（需求明确，技术方案直接）
