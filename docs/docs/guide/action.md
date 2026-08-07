# GitHub Actions 部署

如果你希望每次推送代码后**自动部署**到 Vercel，可以使用 GitHub Actions 工作流。

## 前置准备

1. Fork 本仓库到你的 GitHub 账号：<https://github.com/LegspCpd/vscode-web>
2. 在 [Vercel](https://vercel.com) 中导入该仓库并完成**首次手动部署**（见 [Vercel 界面部署](/guide/dashboard)）

## 获取 Vercel Token 和项目 ID

### 1. 获取 Vercel Token

1. 打开 <https://vercel.com/account/tokens> → **Create Token**
2. 命名并创建，复制生成的 Token（仅显示一次）

### 2. 获取 Org ID 和 Project ID

在本地终端运行（需安装 Vercel CLI）：

```bash
npx vercel link
# 按照提示选择你的项目
npx vercel env ls
```

或者直接查看：
- **Org ID**：在 Vercel 项目 → **Settings** → **General** 的 `Vercel Configuration` 中
- **Project ID**：同上

也可以运行 `npx vercel project ls` 和 `npx vercel inspect` 获取。

## 配置 GitHub Secrets

在 GitHub 仓库 → **Settings** → **Secrets and variables** → **Actions** → **New repository secret** 中添加：

| Secret 名称           | 用途                    |
|----------------------|-----------------------|
| `VERCEL_TOKEN`       | Vercel 的 API Token   |
| `VERCEL_ORG_ID`      | Vercel 的团队/组织 ID  |
| `VERCEL_PROJECT_ID`  | Vercel 的项目 ID      |

同时添加业务环境变量（用于 OAuth 登录）：

| Secret 名称              | 用途                                    |
|------------------------|---------------------------------------|
| `GITHUB_CLIENT_ID`     | GitHub OAuth App 的 Client ID        |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth App 的 Client Secret    |

## 添加工作流文件

在仓库根目录创建 `.github/workflows/deploy.yml`：

```yaml
name: Deploy to Vercel

on:
  push:
    branches: [ main ]
  workflow_dispatch:

jobs:
  deploy:
    runs-on: ubuntu-latest
    env:
      VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
      VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "22"
      - run: npm i -g vercel
      - run: vercel pull --yes --environment=production --token=${{ secrets.VERCEL_TOKEN }}
      - run: vercel build --prod --token=${{ secrets.VERCEL_TOKEN }}
      - run: vercel deploy --prebuilt --prod --token=${{ secrets.VERCEL_TOKEN }}
```

> 注意：本工作流默认部署到 Vercel。`GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET` 需要在 Vercel 项目的 **Settings → Environment Variables** 中配置（工作流本身不直接注入这两个变量到部署环境）。

## 触发部署

- 推送到 `main` 分支自动触发
- 或在 GitHub Actions 页面手动 **Run workflow**

部署完成后访问你的 Vercel 域名即可。
