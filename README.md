# VSCode Web

基于 [Visual Studio Code](https://github.com/microsoft/vscode)（Code - OSS）进行二次开发的 **浏览器版 VS Code**，可直接部署到 [Vercel](https://vercel.com) 等静态托管平台，在浏览器中获得接近桌面版的代码编辑体验。

**在线演示**：[https://vscode.legspcpd.top/](https://vscode.legspcpd.top/)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/LegspCpd/vscode-web)

---

## 项目简介

本仓库是对 VS Code 官方开源项目（Code - OSS）的二次开发与 Web 化编译，并非官方仓库的 fork。目标是提供一个可快速部署、开箱即用的浏览器端 VS Code 实例。

主要特点：

- 完全运行在浏览器中，无需安装桌面客户端
- 支持语法高亮、搜索、文件浏览、轻量级编辑等核心功能
- 已针对 Vercel 等静态站点托管进行适配（包含 `vercel.json`）
- 包含中文语言包相关资源
- 采用 **MIT** 开源协议

> 注意：浏览器环境下的能力受限于沙箱，部分桌面版功能（如完整终端、部分扩展、本地进程调试等）可能不可用或需要额外实现 FileSystemProvider 等扩展。

---

## 与原项目的关系

| 项目 | 说明 | 链接 |
|------|------|------|
| **本仓库** | 二次开发后的 VS Code 网页版，可直接部署 | [github.com/LegspCpd/vscode-web](https://github.com/LegspCpd/vscode-web) |
| **原仓库（微软官方）** | Visual Studio Code - Open Source（Code - OSS），MIT 协议 | [github.com/microsoft/vscode](https://github.com/microsoft/vscode) |
| **官方网页版** | 微软官方提供的 VS Code for the Web | [vscode.dev](https://vscode.dev) |

本项目基于微软官方的 Code - OSS 源码进行 Web 编译与定制，**不是**对其他第三方仓库（例如 Felx-B/vscode-web）的 fork。二次开发内容包括适配静态部署、本地化资源、部署配置等。

原项目（microsoft/vscode）采用 MIT 协议，允许自由使用、修改与分发。本仓库同样使用 MIT 协议。

---

## 快速开始

### 一键部署到 Vercel

点击下方按钮即可一键将本项目部署到你的 Vercel 账号：

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/LegspCpd/vscode-web)

### 本地预览

1. 克隆本仓库：
   ```bash
   git clone https://github.com/LegspCpd/vscode-web.git
   cd vscode-web
   ```

2. 使用任意静态文件服务器打开根目录（例如）：
   ```bash
   npx serve .
   # 或
   python -m http.server 3000
   ```

3. 浏览器访问对应地址即可。

### 手动部署到 Vercel

1. Fork 或导入本仓库到你的 GitHub 账号。
2. 在 [Vercel](https://vercel.com) 中创建新项目并选择该仓库。
3. 保持默认构建设置即可（本仓库已包含 `vercel.json`）。
4. 部署完成后即可通过 Vercel 提供的域名访问。

也可使用 Vercel CLI：

```bash
npx vercel
```

---

## 目录结构说明（简要）

- `index.html` — 入口页面
- `vs/` — VS Code 核心运行时资源
- `media/` — 相关媒体资源
- `nls.*` / `nls.messages.*` — 本地化（含中文）相关文件
- `vercel.json` — Vercel 部署配置
- `LICENSE` — MIT 协议

---

## 许可证

本项目采用 **MIT License**。

完整许可证文本见 [LICENSE](./LICENSE) 文件。

同时，本项目基于微软官方 [Visual Studio Code - Open Source (Code - OSS)](https://github.com/microsoft/vscode)（MIT License）进行二次开发。感谢微软与社区贡献者。

---

## 致谢

- [microsoft/vscode](https://github.com/microsoft/vscode) — 原始开源项目
- VS Code 社区与所有贡献者

---

## 免责声明

本项目为非官方二次开发版本，与 Microsoft 无直接关联。使用过程中如遇到问题，请优先查阅官方文档或在本仓库提交 Issue。
