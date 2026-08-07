# 接口说明

本项目使用 Vercel Serverless Functions（`/api/*`）提供后端能力，主要包括 **GitHub OAuth 登录** 和 **GitHub API 代理**。

## GitHub OAuth 回调

**接口地址**：`GET /api/auth/callback`

**用途**：GitHub OAuth 授权回调，用授权码换取访问令牌并写入浏览器本地存储，完成登录。

**请求参数**（由 GitHub 自动拼接）

| 参数    | 说明            |
|--------|---------------|
| code   | GitHub 授权码   |

**说明**：
- 依赖环境变量 `GITHUB_CLIENT_ID`、`GITHUB_CLIENT_SECRET`
- 回调地址需与 GitHub OAuth App 中配置的一致
- 弹窗登录场景下，成功后通过 `postMessage` 通知父页面并自动关闭；否则跳转回首页

## GitHub API 代理

**接口地址**：`GET /api/proxy?path=...`

**用途**：代理请求 GitHub REST API，避免跨域问题。

**请求参数**

| 参数     | 说明                              |
|--------|---------------------------------|
| path   | GitHub API 路径（如 `user/repos`） |

**说明**：
- 扩展侧边栏通过该代理读取仓库列表、文件内容等
- 由于 Vercel 只能精确匹配 `/api/proxy`，因此用 `?path=` 传递目标路径

## 数据流

```
浏览器(侧边栏) ──> /api/proxy?path=user/repos ──> api.github.com ──> 仓库列表
浏览器(登录弹窗) ──> /api/auth/callback?code=xxx ──> GitHub OAuth ──> 写入 token
```

> 这些接口主要供项目内部使用，一般无需手动调用。
