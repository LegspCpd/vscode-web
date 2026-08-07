# 项目介绍

**VS Code Web** 是基于 [Visual Studio Code](https://github.com/microsoft/vscode)（Code - OSS）二次开发的**浏览器版 VS Code**，可直接部署到 [Vercel](https://vercel.com) 等静态托管平台，在浏览器中获得接近桌面版的代码编辑体验。

**在线演示**：<https://vscode.legspcpd.top>

## 核心功能

- **浏览器运行**：无需安装桌面客户端，打开网址即可使用
- **GitHub 远程集成**：原生侧边栏浏览、打开、编辑远程 GitHub 仓库，支持一键保存回仓库
- **GitHub OAuth 登录**：点击授权弹窗一键登录，读取/编辑你的所有仓库
- **语法高亮**：内置 17 种语言（JS/TS/Python/Go/Rust/Java 等）的 TextMate 语法高亮
- **代码补全**：关键字 + 内置函数 + 代码片段智能补全，支持 Tab 占位符跳转
- **扩展支持**：集成 Open VSX 扩展市场，可在线安装扩展
- **中文界面**：默认简体中文，根据系统语言自动切换
- **暗色主题**：默认暗色，保护视力

## 部署方式

本项目可一键部署到 Vercel：

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/LegspCpd/vscode-web)

详细部署教程见：
- [Vercel 界面部署](/guide/dashboard)
- [GitHub Actions 部署](/guide/action)
- [命令行部署](/guide/command)
- [环境变量配置](/guide/environment)

## 技术栈

- **前端**：VS Code（Code - OSS）Web 编译产物
- **后端**：Vercel Serverless Functions（`/api/*`）
- **认证**：GitHub OAuth App
- **扩展市场**：Open VSX

## 相关仓库

- **VS Code Web 主项目**：<https://github.com/LegspCpd/vscode-web>
- **本文档站**：<https://github.com/LegspCpd/vscode-web-docs>
- **原项目（微软官方）**：<https://github.com/microsoft/vscode>
