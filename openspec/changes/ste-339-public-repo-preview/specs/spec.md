# Spec: 公开仓库翻译预览界面

## Requirements

### REQ-1: 页面标题展示
页面 MUST 展示标题 "公开仓库翻译预览"。

### REQ-2: 只读声明
页面 MUST 明确写出 "预览不会写入任何 GitHub 仓库。" 的安全声明。

### REQ-3: 公开仓库输入
页面 MUST 提供公开仓库 URL 输入功能，支持用户输入 GitHub 仓库地址。

### REQ-4: 语言选择
页面 MUST 提供目标语言选择功能。

### REQ-5: 预览结果展示
结果页 MUST 展示翻译预览内容。

### REQ-6: 安装 CTA
结果页 MUST 提供 "安装 GitHub App 后提交 PR" CTA 按钮。

### REQ-7: 下载功能
结果页 MUST 提供翻译文件下载功能。

### REQ-8: 边界隔离
二期 UI MUST 与首版授权写入边界隔离，不执行任何 GitHub 写入操作。

## Scenarios

### Success path
1. 用户输入公开仓库 URL
2. 用户选择目标语言
3. 系统显示翻译预览
4. 用户可以下载翻译文件
5. 用户点击 CTA 引导安装 GitHub App

### Failure path
- 无效 URL: 显示错误提示
- 非公开仓库: 显示权限提示

### Validation evidence
- 测试验证: 页面包含所有必需元素
- 手动验证: mock 数据流程完整走通
