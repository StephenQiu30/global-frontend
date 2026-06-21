## ADDED Requirements

### Requirement: Next.js App Router 项目结构
系统 SHALL 使用 Next.js App Router 模式，TypeScript 为默认语言。

#### Scenario: 目录结构
- **WHEN** 项目初始化完成
- **THEN** 存在 `src/app/` 目录，包含 `page.tsx`、`layout.tsx`

#### Scenario: TypeScript 配置
- **WHEN** 项目构建
- **THEN** TypeScript 编译通过，无类型错误

### Requirement: 测试框架配置
系统 SHALL 配置测试框架，支持组件单元测试。

#### Scenario: 测试运行
- **WHEN** 执行 `npm test`
- **THEN** Vitest/Jest 运行并通过所有测试

#### Scenario: 测试覆盖组件
- **WHEN** 编写组件测试
- **THEN** 可使用 `@testing-library/react` 渲染组件并断言行为

### Requirement: 环境变量配置
系统 SHALL 在 `.env.example` 中定义必需的环境变量。

#### Scenario: 环境变量文档
- **WHEN** 开发者查看 `.env.example`
- **THEN** 文件包含 `NEXT_PUBLIC_GITHUB_APP_INSTALL_URL` 变量说明
