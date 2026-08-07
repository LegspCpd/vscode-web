# VS Code Web 文档站

基于 [VitePress](https://vitepress.dev) 构建的 **VS Code Web 部署文档站**。

在线预览：<https://vscode-web-docs.vercel.app>（部署后可替换为你自己的域名）

## 项目简介

本仓库是 **VS Code Web**（浏览器版 VS Code，部署到 Vercel）的官方部署文档源，包含：
- 项目介绍与功能说明
- Vercel 一键部署、GitHub Actions 部署、命令行部署教程
- 环境变量配置（GitHub OAuth）
- GitHub 远程仓库集成、扩展市场、语法高亮与代码补全等使用指南

## 本地开发

```bash
# 克隆仓库
git clone https://github.com/LegspCpd/vscode-web-docs.git
cd vscode-web-docs

# 安装依赖
pnpm install

# 本地预览（热更新）
pnpm run docs:dev

# 构建静态站点
pnpm run docs:build
```

## 部署到 Vercel

1. 将本仓库导入 Vercel（或使用一键部署按钮，见 `docs/docs/index.md`）。
2. Framework Preset 选择 **VitePress**（或手动设置 Build Command 为 `pnpm run docs:build`，Output Directory 为 `docs/.vitepress/dist`）。
3. 部署完成后即可通过 Vercel 域名访问文档站。

> 提示：在 Vercel 项目设置中配置自定义域名后，将 `docs/docs/.vitepress/config.mts` 中的站点信息更新为你的域名即可。

## 相关仓库

- **VS Code Web 主项目**：<https://github.com/LegspCpd/vscode-web>
- **本文档站**：<https://github.com/LegspCpd/vscode-web-docs>
