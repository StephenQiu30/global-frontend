## 1. 项目脚手架

- [x] 1.1 创建 `package.json`（React、TypeScript、Vitest、@testing-library/react 依赖）
- [x] 1.2 创建 `tsconfig.json`
- [x] 1.3 创建 `vitest.config.ts`
- [x] 1.4 运行 `npm install` 确认依赖安装成功

## 2. targetPath 工具函数

- [x] 2.1 编写 `src/lib/targetPath.test.ts` 红灯测试（覆盖 `.md`、`.markdown`、嵌套路径）
- [x] 2.2 实现 `src/lib/targetPath.ts`（`getTargetPath` 函数）
- [x] 2.3 运行 `npm test -- src/lib/targetPath.test.ts` 确认绿灯

## 3. MarkdownFilePicker 组件

- [x] 3.1 编写 `src/components/MarkdownFilePicker.test.tsx` 红灯测试（覆盖默认选中、禁用原因、选择限制、大小统计、target_exists 警告）
- [x] 3.2 实现 `src/components/MarkdownFilePicker.tsx`
- [x] 3.3 运行 `npm test -- src/components/MarkdownFilePicker.test.tsx` 确认绿灯

## 4. 验证与提交

- [x] 4.1 运行 `npm test -- src/components/MarkdownFilePicker.test.tsx src/lib/targetPath.test.ts` 全量验证
- [x] 4.2 提交代码并创建 PR
