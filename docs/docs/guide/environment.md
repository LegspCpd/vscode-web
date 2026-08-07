# 环境变量

本项目依赖少量环境变量，均在 **Vercel 项目 → Settings → Environment Variables** 中配置。

## 必需变量

| 变量名                 | 必需 | 默认值 | 用途                                |
|----------------------|:--:|:----:|-----------------------------------|
| `GITHUB_CLIENT_ID`    | ✅  |  无   | GitHub OAuth App 的 Client ID     |
| `GITHUB_CLIENT_SECRET`| ✅  |  无   | GitHub OAuth App 的 Client Secret |

这两个变量用于 **GitHub OAuth 登录**，被以下 Serverless 函数读取：

- `api/auth/callback.js` — OAuth 回调，用 `code` 换取访问令牌
- `api/proxy.js` — 代理 GitHub API 请求

### 如何获取 Client ID / Secret

1. 打开 <https://github.com/settings/developers> → **New OAuth App**
2. 填写应用信息，回调地址填 `https://你的域名/api/auth/callback`
3. 注册后即可获得 Client ID 和 Client Secret

## 其他说明

- 未配置这两个变量时，**登录 GitHub 功能不可用**，但 VS Code 编辑、语法高亮、代码补全等本地功能仍可正常使用。
- 环境变量属于机密信息，请勿提交到代码仓库或暴露在客户端代码中。Serverless 函数会在服务端读取，不会下发到浏览器。

## 配置步骤

1. 在 Vercel 项目 → **Settings** → **Environment Variables** 中添加上述变量
2. 添加完成后，进入 **Deployments** 找到最新部署 → **Redeploy** 使其生效

## 常见问题

**问：配置了变量但登录仍失败？**

- 检查回调地址是否与 GitHub OAuth App 中配置的一致（`https://你的域名/api/auth/callback`，不能带多余查询参数）
- 检查 `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET` 是否填写正确
- 修改环境变量后必须 **Redeploy** 才会生效

**问：需要哪些 GitHub 权限？**

本项目的 OAuth App 申请的是读取仓库的权限，用于浏览和编辑你的远程仓库代码。在创建 OAuth App 时按默认权限即可。
