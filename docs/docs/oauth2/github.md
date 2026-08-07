# 接入 GitHub 登录

VS Code Web 通过 **GitHub OAuth** 实现远程仓库的浏览与编辑。登录后可在原生侧边栏查看你的所有仓库、打开并编辑其中的文件。

## 创建 GitHub OAuth 应用

1. 打开 <https://github.com/settings/developers> → **New OAuth App**
2. 填写以下信息：
   - **Application name**：任意，如 `VS Code Web`
   - **Homepage URL**：你的部署域名，如 `https://vscode.legspcpd.top`
   - **Authorization callback URL**：`https://你的域名/api/auth/callback`
3. 点击 **Register application**

## 记录凭证

注册后进入应用详情页，记录：
- **Client ID**
- **Client Secret**（点击 Generate 生成）

## 配置环境变量

在 Vercel 项目 → **Settings** → **Environment Variables** 中添加：

| 变量名                 | 必需 | 用途                                |
|----------------------|:--:|-----------------------------------|
| `GITHUB_CLIENT_ID`    | ✅  | GitHub OAuth App 的 Client ID     |
| `GITHUB_CLIENT_SECRET`| ✅  | GitHub OAuth App 的 Client Secret |

配置后 **Redeploy** 使生效。

## 登录流程

1. 打开你的 VS Code Web 站点
2. 点击左侧边栏 **GitHub** 图标
3. 点击 **登录** 按钮，浏览器会打开居中的 GitHub 授权弹窗
4. 授权完成后弹窗自动关闭，页面自动刷新并显示你的仓库列表

## 使用说明

- 登录后可在侧边栏浏览你的所有仓库与分支
- 点击任意文件会在**主编辑器**中打开（不是侧边栏小框）
- 编辑后点击侧边栏的 **保存当前** 按钮即可将改动写回 GitHub

详细用法见 [GitHub 远程集成](/system/github)。

## 常见问题

**问：登录弹窗打不开或授权后无反应？**

- 检查回调地址是否与 OAuth App 一致（必须为 `https://你的域名/api/auth/callback`，不能带多余参数）
- 检查环境变量是否正确配置并已 Redeploy

**问：能否读取私有仓库？**

可以。OAuth App 授权后，可访问你在授权中同意的所有仓库（含私有仓库）。
