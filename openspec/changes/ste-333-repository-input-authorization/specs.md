# Specs: 仓库地址输入与授权校验

## 1. 仓库地址解析

### 1.1 支持的输入格式

MUST 支持以下输入格式：

1. `https://github.com/owner/repo`
2. `https://github.com/owner/repo/` (末尾带斜杠)
3. `github.com/owner/repo` (无协议)
4. `owner/repo` (纯 owner/repo)

### 1.2 解析规则

MUST 遵循以下规则：

1. 去除 URL 前后空格
2. 去除末尾 `/`
3. 从 URL 中提取 owner 和 repo
4. repo 名保留大小写
5. 非法输入必须返回明确错误

### 1.3 不支持的输入

MUST 拒绝以下输入：

1. Git SSH 地址 (`git@github.com:owner/repo.git`)
2. 子路径 URL (`https://github.com/owner/repo/tree/main/docs`)
3. Gist (`https://gist.github.com/owner/id`)
4. 非 GitHub 地址 (`https://gitlab.com/owner/repo`)

## 2. 授权校验

### 2.1 API 调用

MUST 调用后端 `POST /api/repositories/resolve` 接口。

### 2.2 成功响应

SHALL 展示以下信息：

1. 仓库全名 (owner/repo)
2. 默认分支
3. 仓库可见性
4. 是否已授权

### 2.3 错误处理

MUST 处理以下错误场景：

1. 地址为空
2. 地址不是 GitHub 仓库
3. owner/repo 格式错误
4. 仓库不存在
5. 仓库未授权
6. GitHub API 超时
7. installation token 获取失败

## 3. 前端交互

### 3.1 组件结构

RepositorySelector 组件 SHALL 包含：

1. 仓库地址输入框
2. 校验按钮
3. 校验状态展示
4. 错误提示

### 3.2 状态流转

```
idle -> loading -> success | error
```

### 3.3 用户体验

- 输入框应有 placeholder 提示
- 校验按钮在输入为空时禁用
- loading 状态显示加载指示器
- 成功状态显示仓库信息
- 错误状态显示明确文案和下一步建议
