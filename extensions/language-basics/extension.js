// Language Basics - syntax highlighting extension (web)
// 纯语法贡献扩展，无需运行时逻辑；入口仅为触发扩展激活，
// 确保 contributes.grammars 被 workbench 正确收集。
const vscode = require('vscode');

function activate(context) {
    // 无需额外逻辑
}

function deactivate() { }

module.exports = { activate, deactivate };
