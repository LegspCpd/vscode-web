# 命令行部署

如果你习惯使用命令行，可以用 Vercel CLI 本地部署本项目。

## 前置准备

- [Node.js](https://nodejs.org) v18 及以上
- [Vercel CLI](https://vercel.com/docs/cli)（可用 `npm i -g vercel` 安装）
- GitHub OAuth App（用于登录功能，可选）

## 本地预览

```bash
# 克隆仓库
git clone https://github.com/LegspCpd/vscode-web.git
cd vscode-web

# 使用任意静态文件服务器本地预览
npx serve .
# 或
python -m http.server 3000
```

浏览器访问 `http://localhost:3000` 即可在本地体验。

## 部署到 Vercel

```bash
# 登录 Vercel
npx vercel login

# 在项目根目录执行部署（会提示关联项目）
npx vercel

# 生产环境部署
npx vercel --prod
```

## 配置环境变量

在 Vercel 项目设置中添加：

```bash
# 方式一：命令行设置
npx vercel env add GITHUB_CLIENT_ID production
npx vercel env add GITHUB_CLIENT_SECRET production

# 方式二：在 Vercel 控制台 → Settings → Environment Variables 中添加
```

| 变量名                 | 必需 | 用途                                |
|----------------------|:--:|-----------------------------------|
| `GITHUB_CLIENT_ID`    | ✅  | GitHub OAuth App 的 Client ID     |
| `GITHUB_CLIENT_SECRET`| ✅  | GitHub OAuth App 的 Client Secret |

## 本地测试 Serverless API

本项目包含 `/api/*` 的 Serverless Functions（OAuth 回调、GitHub API 代理）。本地调试可用：

```bash
npx vercel dev
```

访问 `http://localhost:3000` 即可同时调试静态页面和 Serverless API。

> 提示：本地调试 OAuth 时，GitHub OAuth App 的回调地址需配置为 `http://localhost:3000/api/auth/callback`。
