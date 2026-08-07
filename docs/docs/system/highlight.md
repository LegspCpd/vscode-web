# 语法高亮与代码补全

VS Code Web 内置了 **17 种语言**的语法高亮和轻量级代码补全，与官方 vscode.dev 的体验一致。

## 语法高亮

基于 **TextMate 语法** 实现，打开对应语言的文件后自动应用：

- 关键字、字符串、注释、数字、函数名等以不同颜色区分
- 与官方 VS Code 的 Dark+ 配色一致

**支持的语言**：

JavaScript、TypeScript、JSON、HTML、CSS、Python、Markdown、YAML、C++、Go、Rust、PHP、Shell、Java、C#、XML、SQL

### 切换语言

- 新文件默认是纯文本。打开后按 `Ctrl+K M` 或点击右下角语言模式，选择目标语言
- 带扩展名的文件（如 `.js`、`.py`）会自动识别语言

## 代码补全

输入代码时自动弹出补全建议，包含：

- **关键字**：语言关键字（如 `function`、`const`、`return`）
- **内置函数**：语言全局对象（如 `console`、`print`、`fmt.Println`）
- **代码片段**：常用代码结构，支持 Tab 占位符跳转

### 手动触发补全

- 输入时自动触发
- 或按 `Ctrl+Space` 手动触发

### 片段示例（JavaScript）

输入 `function` 并选择"函数声明"片段，会自动展开为：

```javascript
function name(params) {
    
}
```

光标自动定位到占位符位置，按 Tab 可跳转填写。

## 与官方 vscode.dev 的差异

本项目内置的是**轻量级补全**（关键字 + 内置函数 + 代码片段），不包含完整的语言服务器（IntelliSense）语义分析。若需要更完整的智能感知，可通过 [扩展市场](/system/extensions) 安装相应的语言服务扩展。
