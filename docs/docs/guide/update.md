# 项目更新

保持 VS Code Web 与上游新特性同步。

## 方式一：拉取上游更新（推荐）

如果你的部署是直接导入官方仓库，只需在 Vercel 中重新部署即可获取最新代码。

如果是自己 Fork 的仓库，可以拉取上游更新：

```bash
# 添加上游远程
git remote add upstream https://github.com/LegspCpd/vscode-web.git

# 拉取最新代码
git fetch upstream
git checkout main
git merge upstream/main

# 推送回你的仓库
git push origin main
```

推送后，若配置了 [GitHub Actions 部署](/guide/action) 会自动重新部署；否则需在 Vercel 中手动 Redeploy。

## 方式二：Vercel 手动重新部署

1. 进入 Vercel 项目 → **Deployments**
2. 找到最新部署 → **More** → **Redeploy**
3. 等待构建完成

## 更新 GitHub OAuth 配置

升级后如果登录异常，检查：
- GitHub OAuth App 的回调地址是否仍指向你的域名
- 环境变量 `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET` 是否仍然有效

## 查看更新日志

最新版本与功能更新见仓库 Releases：

<https://github.com/LegspCpd/vscode-web/releases>
