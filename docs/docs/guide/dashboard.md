# Vercel 界面部署

这是最推荐的部署方式，全程在网页上操作，无需本地环境。

## 前置准备

1. 一个 [GitHub](https://github.com) 账号（用于托管代码和创建 OAuth 应用）
2. 一个 [Vercel](https://vercel.com) 账号（推荐使用 GitHub 登录）

## 第一步：一键部署到 Vercel

点击下方按钮，使用你的 GitHub 账号登录 Vercel 并一键导入本仓库：

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/LegspCpd/vscode-web)

或者手动操作：

1. Fork 本仓库到你的 GitHub 账号：<https://github.com/LegspCpd/vscode-web>
2. 进入 [Vercel](https://vercel.com) → **Add New Project** → **Import** 选择你 Fork 的仓库
3. Framework Preset 保持 **Other**（本项目是纯静态 + Serverless）
4. 点击 **Deploy** 部署

> 项目根目录已包含 `vercel.json`，无需额外配置构建设置。

## 第二步：创建 GitHub OAuth 应用

要启用 GitHub 远程仓库编辑功能，需要创建一个 OAuth App：

1. 打开 <https://github.com/settings/developers> → **New OAuth App**
2. 填写：
   - **Application name**：任意，如 `VS Code Web`
   - **Homepage URL**：你的部署域名，如 `https://vscode.legspcpd.top`
   - **Authorization callback URL**：`https://你的域名/api/auth/callback`
3. 点击 **Register application**，记录下 **Client ID** 和 **Client Secret**

## 第三步：配置环境变量

在 Vercel 项目 → **Settings** → **Environment Variables** 中添加：

| 变量名                 | 必需 | 用途                                   |
|----------------------|:--:|--------------------------------------|
| `GITHUB_CLIENT_ID`    | ✅  | GitHub OAuth App 的 Client ID        |
| `GITHUB_CLIENT_SECRET`| ✅  | GitHub OAuth App 的 Client Secret    |

> 这些变量会被 `api/auth/callback.js` 读取，用于完成 GitHub OAuth 登录。若未配置，登录功能不可用，但 VS Code 编辑功能仍可使用。

## 第四步：重新部署

配置完环境变量后：

1. 在 Vercel 项目 → **Deployments** → 找到最新部署 → **More** → **Redeploy**
2. 等待部署完成，访问你的域名即可使用

## 完成

部署完成后：

- 直接访问你的 Vercel 域名即可打开 VS Code Web
- 点击侧边栏 **GitHub** 图标 → **登录** 即可开始编辑你的远程仓库
- 具体使用方法见 [GitHub 远程集成](/system/github)
