## ADDED Requirements

### Requirement: InstallCard 组件渲染
系统 SHALL 在首页展示 `InstallCard` 组件，包含安装按钮和权限说明。

#### Scenario: 正常渲染
- **WHEN** 用户访问首页
- **THEN** 页面展示"安装 GitHub App"按钮，按钮链接指向 `NEXT_PUBLIC_GITHUB_APP_INSTALL_URL`

#### Scenario: 安装按钮跳转
- **WHEN** 用户点击安装按钮
- **THEN** 浏览器跳转到 GitHub App 安装页面（由 `NEXT_PUBLIC_GITHUB_APP_INSTALL_URL` 配置）

### Requirement: Callback 页面处理 installation_id
系统 SHALL 在回调页面处理 GitHub App 安装回调，展示 installation_id 或错误状态。

#### Scenario: installation_id 成功
- **WHEN** 用户从 GitHub 安装页面回调，URL 包含 `installation_id` 参数
- **THEN** 页面展示安装成功状态，显示 installation_id 值

#### Scenario: installation_id 缺失
- **WHEN** 用户访问回调页面但 URL 不包含 `installation_id` 参数
- **THEN** 页面展示错误状态，提示"installation_id 参数缺失"

### Requirement: 安装状态展示
系统 SHALL 展示已授权仓库数量或后端校验结果。

#### Scenario: 展示已授权仓库数量
- **WHEN** 安装成功且后端返回仓库数量
- **THEN** UI 展示已授权 N 个仓库

#### Scenario: 后端不可用时的状态
- **WHEN** 安装成功但后端未连接
- **THEN** UI 展示"安装成功，等待后端验证"状态

### Requirement: 安全边界
前端 SHALL NOT 接收、保存或处理 installation token、private key 或 OpenAI key。

#### Scenario: 禁止敏感数据处理
- **WHEN** 前端接收到包含 token 的响应
- **THEN** 前端不存储该 token 到 state、localStorage 或 cookie
