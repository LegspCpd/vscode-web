# VS Code Web

基于 [Visual Studio Code](https://github.com/microsoft/vscode)（Code - OSS）二次开发的 **浏览器版 VS Code**，支持 **GitHub 远程仓库编辑**、**扩展市场**、**语法高亮**与**代码补全**，可一键部署到 [Vercel](https://vercel.com) 等静态托管平台。

**在线演示**：[https://vscode.legspcpd.top](https://vscode.legspcpd.top)

**部署文档**：[https://github.com/LegspCpd/vscode-web-docs](https://github.com/LegspCpd/vscode-web-docs)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/LegspCpd/vscode-web)

---

## ✨ 功能特性

- 🐙 **GitHub 远程集成**：原生侧边栏浏览、打开、编辑远程 GitHub 仓库，无需安装 Git
- 🔐 **GitHub OAuth 登录**：授权弹窗一键登录，读取/编辑你的所有仓库（含私有仓库）
- 🎨 **语法高亮**：内置 17 种语言的 TextMate 语法高亮，与官方 vscode.dev 一致
- ✨ **代码补全**：关键字 + 内置函数 + 代码片段智能补全，支持 Tab 占位符跳转
- 🔌 **扩展支持**：集成 Open VSX 扩展市场，可在线安装扩展
- 🇨🇳 **中文界面**：默认简体中文，根据系统语言自动切换
- 🌙 **暗色主题**：默认暗色主题，代码编辑体验更佳
- 💾 **工作区持久化**：刷新后保留打开的文件夹、编辑器和布局
- ⚡ **一键部署**：无需服务器，直接部署到 Vercel

---

## 🚀 快速部署

### 一键部署到 Vercel

点击下方按钮，使用 GitHub 账号登录 Vercel 即可一键部署：

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/LegspCpd/vscode-web)

### 手动部署

1. **Fork 本仓库**：<https://github.com/LegspCpd/vscode-web>
2. **导入 Vercel**：在 [Vercel](https://vercel.com) → **Add New Project** → 选择你 Fork 的仓库
3. **部署**：保持默认构建设置（仓库已包含 `vercel.json`），点击 **Deploy**

### 命令行部署

```bash
git clone https://github.com/LegspCpd/vscode-web.git
cd vscode-web
npx vercel        # 开发部署
npx vercel --prod # 生产部署
```

---

## 🔑 环境变量

在 Vercel 项目 → **Settings** → **Environment Variables** 中配置：

| 变量名                 | 必需 | 用途                                    |
|----------------------|:--:|---------------------------------------|
| `GITHUB_CLIENT_ID`    | ✅  | GitHub OAuth App 的 Client ID         |
| `GITHUB_CLIENT_SECRET`| ✅  | GitHub OAuth App 的 Client Secret     |

> 未配置这两个变量时，**GitHub 登录功能不可用**，但本地编辑、语法高亮、代码补全等仍可正常使用。

### 创建 GitHub OAuth App

1. 打开 <https://github.com/settings/developers> → **New OAuth App**
2. 填写：
   - **Homepage URL**：你的部署域名
   - **Authorization callback URL**：`https://你的域名/api/auth/callback`
3. 注册后记录 **Client ID** 和 **Client Secret**，填入 Vercel 环境变量

---

## 📖 使用方法

### 编辑 GitHub 远程仓库

1. 打开站点，点击左侧 **GitHub** 图标
2. 点击 **登录**，完成授权（弹窗自动关闭，页面自动刷新）
3. 在侧边栏选择仓库和文件，文件在**主编辑器**中打开
4. 编辑后点击侧边栏 **保存当前** 按钮写回仓库

### 语法高亮与代码补全

- 打开文件后按 `Ctrl+K M` 切换语言模式，或使用带扩展名的文件自动识别
- 输入代码时自动弹出补全建议（关键字、内置函数、代码片段）
- 支持 17 种语言：JavaScript、TypeScript、JSON、HTML、CSS、Python、Markdown、YAML、C++、Go、Rust、PHP、Shell、Java、C#、XML、SQL

### 安装扩展

1. 点击左侧 **扩展** 图标（`Ctrl+Shift+X`）
2. 搜索扩展（如 `Chinese`、`Prettier`）并安装

---

## 📁 目录结构

```
.
├── index.html              # 入口页面（含 workbench 启动配置）
├── vercel.json             # Vercel 部署配置（headers / rewrites）
├── api/                    # Serverless Functions
│   ├── auth/callback.js    #   GitHub OAuth 回调
│   ├── proxy.js            #   GitHub API 代理
│   └── package.json        #   ESM 配置
├── vs/                     # VS Code 核心运行时资源
├── media/                  # 媒体资源
├── extensions/             # 本地内置扩展
│   ├── gh-views/           #   GitHub 原生侧边栏视图
│   └── language-basics/    #   语法高亮 + 代码补全
├── node_modules/           # TextMate / Oniguruma 等模块
└── nls.* / nls.messages.*  # 本地化（含中文）
```

---

## 🧩 目录详解

| 路径 | 说明 |
|------|------|
| `index.html` | 入口页面，通过 `create()` 启动 workbench，配置中文、暗色主题、扩展市场、GitHub 工作区等 |
| `api/auth/callback.js` | GitHub OAuth 回调，用授权码换取令牌写入本地存储 |
| `api/proxy.js` | 代理 GitHub API，供侧边栏读取仓库/文件 |
| `extensions/gh-views/` | GitHub 原生侧边栏视图扩展（仓库列表、打开/保存文件） |
| `extensions/language-basics/` | 语法高亮（TextMate 语法）+ 代码补全（关键字/片段）扩展 |
| `node_modules/vscode-oniguruma/` | 正则引擎（onig.wasm） |
| `node_modules/vscode-textmate/` | TextMate 语法解析引擎 |

---

## 🛠️ 本地开发

```bash
# 克隆仓库
git clone https://github.com/LegspCpd/vscode-web.git
cd vscode-web

# 本地静态预览
npx serve .
# 或
python -m http.server 3000

# 本地调试 Serverless API
npx vercel dev
```

> 本地调试 OAuth 时，GitHub OAuth App 回调地址配置为 `http://localhost:3000/api/auth/callback`。

---

## 📄 文档

详细的部署、配置与使用文档见：

**[VS Code Web 部署文档站](https://github.com/LegspCpd/vscode-web-docs)**

---

## 📝 更新日志

最新版本与功能更新见 [Releases](https://github.com/LegspCpd/vscode-web/releases)。

---

## 📜 许可证

本项目采用 **MIT License**。

基于微软官方 [Visual Studio Code - Open Source (Code - OSS)](https://github.com/microsoft/vscode)（MIT License）进行二次开发。感谢微软与社区贡献者。

---

## 🙏 致谢

- [microsoft/vscode](https://github.com/microsoft/vscode) — 原始开源项目
- [Open VSX](https://open-vsx.org) — 开源扩展市场
- VS Code 社区与所有贡献者

---

## ⚠️ 免责声明

本项目为非官方二次开发版本，与 Microsoft 无直接关联。浏览器环境受沙箱限制，部分桌面版功能（完整终端、本地进程调试等）可能不可用。
