// Language Basics - syntax highlighting + code completion extension (web)
// 提供 17 种语言的 TextMate 语法贡献与轻量级代码补全（关键字 + 常用代码片段）。
const vscode = require('vscode');

// ---------------------------------------------------------------------------
// 各语言补全数据：关键字 + 常用代码片段
// ---------------------------------------------------------------------------
const COMPLETIONS = {
    javascript: {
        keywords: [
            'function', 'return', 'const', 'let', 'var', 'if', 'else', 'for', 'while',
            'do', 'switch', 'case', 'break', 'continue', 'class', 'extends', 'new',
            'import', 'export', 'from', 'default', 'async', 'await', 'try', 'catch',
            'finally', 'throw', 'typeof', 'instanceof', 'in', 'of', 'this', 'super',
            'null', 'undefined', 'true', 'false', 'void', 'delete', 'yield', 'static',
            'get', 'set'
        ],
        globals: ['console', 'document', 'window', 'globalThis', 'JSON', 'Math', 'Date', 'Promise', 'Set', 'Map', 'Array', 'Object', 'String', 'Number', 'Boolean', 'RegExp'],
        snippets: [
            { label: 'console.log', detail: '打印到控制台', body: 'console.log($1);$0' },
            { label: 'function declaration', detail: '函数声明', body: 'function ${1:name}(${2:params}) {\n\t$0\n}' },
            { label: 'arrow function', detail: '箭头函数', body: 'const ${1:name} = (${2:params}) => {\n\t$0\n};' },
            { label: 'if', detail: 'if 语句', body: 'if (${1:condition}) {\n\t$0\n}' },
            { label: 'for loop', detail: 'for 循环', body: 'for (let ${1:i} = 0; ${1:i} < ${2:len}; ${1:i}++) {\n\t$0\n}' },
            { label: 'forEach', detail: 'forEach 遍历', body: '${1:arr}.forEach((${2:item}) => {\n\t$0\n});' },
            { label: 'class', detail: '类定义', body: 'class ${1:Name} {\n\tconstructor(${2:args}) {\n\t\t$0\n\t}\n}' },
            { label: 'async function', detail: '异步函数', body: 'async function ${1:name}(${2:params}) {\n\t$0\n}' },
            { label: 'try-catch', detail: '异常处理', body: 'try {\n\t$0\n} catch (${1:err}) {\n\t${1:err}\n}' },
            { label: 'import', detail: '导入模块', body: 'import ${1:name} from \'${2:module}\';' }
        ]
    },
    typescript: {
        keywords: [
            'function', 'return', 'const', 'let', 'var', 'if', 'else', 'for', 'while',
            'class', 'extends', 'implements', 'interface', 'type', 'new', 'import',
            'export', 'from', 'default', 'async', 'await', 'try', 'catch', 'throw',
            'typeof', 'instanceof', 'this', 'super', 'null', 'undefined', 'true',
            'false', 'readonly', 'public', 'private', 'protected', 'static', 'enum',
            'namespace', 'declare', 'abstract', 'as', 'keyof', 'infer', 'unknown', 'never'
        ],
        globals: ['console', 'document', 'window', 'JSON', 'Math', 'Date', 'Promise', 'Set', 'Map', 'Array', 'Object', 'String', 'Number', 'Boolean', 'RegExp', 'Record', 'Partial', 'Pick', 'Omit'],
        snippets: [
            { label: 'console.log', detail: '打印到控制台', body: 'console.log($1);$0' },
            { label: 'interface', detail: '接口定义', body: 'interface ${1:Name} {\n\t${2:prop}: ${3:type};\n}' },
            { label: 'type alias', detail: '类型别名', body: 'type ${1:Name} = ${2:type};' },
            { label: 'arrow function', detail: '箭头函数', body: 'const ${1:name} = (${2:params}) => {\n\t$0\n};' },
            { label: 'class', detail: '类定义', body: 'class ${1:Name} {\n\tconstructor(${2:args}) {\n\t\t$0\n\t}\n}' },
            { label: 'function declaration', detail: '函数声明', body: 'function ${1:name}(${2:params}): ${3:ret} {\n\t$0\n}' },
            { label: 'if', detail: 'if 语句', body: 'if (${1:condition}) {\n\t$0\n}' }
        ]
    },
    json: {
        keywords: [],
        globals: [],
        snippets: [
            { label: 'Object', detail: 'JSON 对象', body: '{\n\t"${1:key}": ${2:value}\n}' },
            { label: 'Array', detail: 'JSON 数组', body: '[\n\t${1:value}\n]' }
        ]
    },
    html: {
        keywords: [],
        globals: [],
        snippets: [
            { label: 'html', detail: 'HTML5 骨架', body: '<!DOCTYPE html>\n<html lang="zh-CN">\n<head>\n\t<meta charset="UTF-8">\n\t<title>${1:title}</title>\n</head>\n<body>\n\t$0\n</body>\n</html>' },
            { label: 'div', detail: 'div 容器', body: '<div class="${1:cls}">\n\t$0\n</div>' },
            { label: 'span', detail: 'span 元素', body: '<span>${1:text}</span>' },
            { label: 'a', detail: '链接', body: '<a href="${1:url}">${2:text}</a>' },
            { label: 'img', detail: '图片', body: '<img src="${1:src}" alt="${2:alt}">' },
            { label: 'script', detail: '脚本标签', body: '<script>\n\t$0\n</script>' },
            { label: 'style', detail: '样式标签', body: '<style>\n\t$0\n</style>' },
            { label: 'button', detail: '按钮', body: '<button type="button">${1:text}</button>' },
            { label: 'form', detail: '表单', body: '<form action="${1:url}" method="${2:post}">\n\t$0\n</form>' },
            { label: 'ul', detail: '无序列表', body: '<ul>\n\t<li>${1:item}</li>\n</ul>' }
        ]
    },
    css: {
        keywords: [],
        globals: [],
        snippets: [
            { label: 'flexbox', detail: 'Flex 布局', body: 'display: flex;\njustify-content: ${1:center};\nalign-items: ${2:center};' },
            { label: 'grid', detail: 'Grid 布局', body: 'display: grid;\ngrid-template-columns: ${1:1fr};' },
            { label: 'media query', detail: '媒体查询', body: '@media (max-width: ${1:768px}) {\n\t$0\n}' },
            { label: 'transition', detail: '过渡动画', body: 'transition: ${1:all} ${2:0.3s} ${3:ease};' },
            { label: 'animation', detail: '动画', body: '@keyframes ${1:name} {\n\tfrom { ${2:opacity: 0;} }\n\tto { ${3:opacity: 1;} }\n}' },
            { label: 'centered', detail: '水平垂直居中', body: 'display: flex;\njustify-content: center;\nalign-items: center;' }
        ]
    },
    python: {
        keywords: [
            'def', 'return', 'import', 'from', 'as', 'class', 'if', 'elif', 'else',
            'for', 'while', 'in', 'not', 'and', 'or', 'is', 'None', 'True', 'False',
            'try', 'except', 'finally', 'raise', 'with', 'lambda', 'pass', 'break',
            'continue', 'yield', 'global', 'nonlocal', 'assert', 'del', 'async', 'await'
        ],
        globals: ['print', 'len', 'range', 'type', 'str', 'int', 'float', 'list', 'dict', 'set', 'tuple', 'enumerate', 'zip', 'map', 'filter', 'sorted', 'sum', 'min', 'max', 'open'],
        snippets: [
            { label: 'print', detail: '打印输出', body: 'print(${1:value})' },
            { label: 'def function', detail: '函数定义', body: 'def ${1:name}(${2:params}):\n\t${3:pass}' },
            { label: 'class', detail: '类定义', body: 'class ${1:Name}:\n\tdef __init__(self, ${2:args}):\n\t\t$0\n\n\tdef ${3:method}(self):\n\t\t${4:pass}' },
            { label: 'for loop', detail: 'for 循环', body: 'for ${1:item} in ${2:iterable}:\n\t$0' },
            { label: 'if', detail: 'if 语句', body: 'if ${1:condition}:\n\t$0' },
            { label: 'try-except', detail: '异常处理', body: 'try:\n\t$0\nexcept ${1:Exception} as ${2:e}:\n\t${2:e}' },
            { label: 'with open', detail: '文件读写', body: 'with open(\'${1:file}\', \'${2:r}\') as ${3:f}:\n\t$0' },
            { label: 'import', detail: '导入模块', body: 'import ${1:module}' }
        ]
    },
    markdown: {
        keywords: [],
        globals: [],
        snippets: [
            { label: 'heading', detail: '标题', body: '## ${1:标题}' },
            { label: 'link', detail: '链接', body: '[${1:text}](${2:url})' },
            { label: 'image', detail: '图片', body: '![${1:alt}](${2:url})' },
            { label: 'code block', detail: '代码块', body: '```${1:language}\n$0\n```' },
            { label: 'inline code', detail: '行内代码', body: '`${1:code}`' },
            { label: 'bold', detail: '加粗', body: '**${1:text}**' },
            { label: 'italic', detail: '斜体', body: '*${1:text}*' },
            { label: 'list', detail: '无序列表', body: '- ${1:item}' },
            { label: 'ordered list', detail: '有序列表', body: '1. ${1:item}' }
        ]
    },
    yaml: {
        keywords: [],
        globals: [],
        snippets: [
            { label: 'key-value', detail: '键值对', body: '${1:key}: ${2:value}' },
            { label: 'list', detail: '列表', body: '${1:key}:\n  - ${2:item}' },
            { label: 'nested', detail: '嵌套对象', body: '${1:key}:\n  ${2:sub}: ${3:value}' }
        ]
    },
    cpp: {
        keywords: [
            'int', 'float', 'double', 'char', 'bool', 'void', 'auto', 'const',
            'return', 'if', 'else', 'for', 'while', 'do', 'switch', 'case', 'break',
            'continue', 'class', 'struct', 'public', 'private', 'protected', 'virtual',
            'new', 'delete', 'namespace', 'using', 'template', 'typename', 'typedef',
            'sizeof', 'this', 'nullptr', 'true', 'false', 'static', 'extern', 'inline'
        ],
        globals: ['std', 'cout', 'cin', 'endl', 'string', 'vector', 'map', 'set', 'printf'],
        snippets: [
            { label: 'main', detail: '主函数', body: 'int main() {\n\t$0\n\treturn 0;\n}' },
            { label: 'include', detail: '包含头文件', body: '#include <${1:iostream}>' },
            { label: 'for loop', detail: 'for 循环', body: 'for (int ${1:i} = 0; ${1:i} < ${2:n}; ${1:i}++) {\n\t$0\n}' },
            { label: 'class', detail: '类定义', body: 'class ${1:Name} {\npublic:\n\t${1:Name}() {}\n\t$0\n};' },
            { label: 'if', detail: 'if 语句', body: 'if (${1:condition}) {\n\t$0\n}' },
            { label: 'printf', detail: '格式化输出', body: 'printf("${1:%s}", ${2:arg});' }
        ]
    },
    go: {
        keywords: [
            'package', 'import', 'func', 'return', 'if', 'else', 'for', 'range',
            'switch', 'case', 'break', 'continue', 'go', 'defer', 'chan', 'map',
            'struct', 'interface', 'type', 'var', 'const', 'select', 'fallthrough',
            'true', 'false', 'nil', 'default'
        ],
        globals: ['fmt', 'Println', 'Printf', 'len', 'make', 'new', 'append', 'error'],
        snippets: [
            { label: 'package main', detail: '主程序', body: 'package main\n\nimport (\n\t"fmt"\n)\n\nfunc main() {\n\t$0\n}' },
            { label: 'func', detail: '函数定义', body: 'func ${1:name}(${2:params}) ${3:ret} {\n\t$0\n}' },
            { label: 'for loop', detail: 'for 循环', body: 'for ${1:i} := 0; ${1:i} < ${2:n}; ${1:i}++ {\n\t$0\n}' },
            { label: 'if', detail: 'if 语句', body: 'if ${1:condition} {\n\t$0\n}' },
            { label: 'struct', detail: '结构体', body: 'type ${1:Name} struct {\n\t${2:field} ${3:type}\n}' },
            { label: 'Println', detail: '打印', body: 'fmt.Println(${1:value})' }
        ]
    },
    rust: {
        keywords: [
            'fn', 'let', 'mut', 'const', 'static', 'return', 'if', 'else', 'match',
            'for', 'while', 'loop', 'in', 'break', 'continue', 'struct', 'enum', 'impl',
            'trait', 'use', 'mod', 'pub', 'crate', 'self', 'Self', 'super', 'where',
            'async', 'await', 'unsafe', 'ref', 'move', 'type', 'true', 'false', 'dyn'
        ],
        globals: ['println', 'vec', 'String', 'Option', 'Result', 'Some', 'None', 'Ok', 'Err'],
        snippets: [
            { label: 'main', detail: '主函数', body: 'fn main() {\n\t$0\n}' },
            { label: 'fn', detail: '函数定义', body: 'fn ${1:name}(${2:params}) -> ${3:ret} {\n\t$0\n}' },
            { label: 'for loop', detail: 'for 循环', body: 'for ${1:item} in ${2:iterable} {\n\t$0\n}' },
            { label: 'struct', detail: '结构体', body: 'struct ${1:Name} {\n\t${2:field}: ${3:type},\n}' },
            { label: 'impl', detail: '实现块', body: 'impl ${1:Name} {\n\tfn ${2:method}(&self) {\n\t\t$0\n\t}\n}' },
            { label: 'match', detail: '模式匹配', body: 'match ${1:value} {\n\t${2:pattern} => ${3:result},\n\t_ => ${4:default},\n}' }
        ]
    },
    php: {
        keywords: [
            'function', 'return', 'if', 'else', 'elseif', 'for', 'foreach', 'while',
            'switch', 'case', 'break', 'continue', 'class', 'public', 'private',
            'protected', 'static', 'extends', 'implements', 'interface', 'namespace',
            'use', 'new', 'echo', 'print', 'true', 'false', 'null', 'isset', 'empty'
        ],
        globals: ['echo', 'print', 'array', 'isset', 'empty', 'count', 'json_encode', 'json_decode', 'var_dump'],
        snippets: [
            { label: 'php', detail: 'PHP 标签', body: '<?php\n$0\n?>' },
            { label: 'function', detail: '函数定义', body: 'function ${1:name}(${2:params}) {\n\t$0\n}' },
            { label: 'class', detail: '类定义', body: 'class ${1:Name} {\n\tpublic function ${2:method}() {\n\t\t$0\n\t}\n}' },
            { label: 'foreach', detail: 'foreach 循环', body: 'foreach (${1:$arr} as ${2:$item}) {\n\t$0\n}' },
            { label: 'if', detail: 'if 语句', body: 'if (${1:condition}) {\n\t$0\n}' },
            { label: 'echo', detail: '输出', body: 'echo ${1:value};' }
        ]
    },
    shellscript: {
        keywords: [
            'if', 'then', 'else', 'elif', 'fi', 'for', 'while', 'until', 'do', 'done',
            'case', 'esac', 'function', 'return', 'exit', 'break', 'continue', 'in',
            'select', 'read', 'echo', 'export', 'local', 'set', 'unset', 'shift'
        ],
        globals: ['echo', 'cat', 'grep', 'sed', 'awk', 'ls', 'cd', 'mkdir', 'rm', 'cp', 'mv', 'chmod', 'curl', 'wget', 'source'],
        snippets: [
            { label: 'shebang', detail: 'Shebang', body: '#!/bin/bash' },
            { label: 'if', detail: 'if 语句', body: 'if [ ${1:condition} ]; then\n\t$0\nfi' },
            { label: 'for loop', detail: 'for 循环', body: 'for ${1:item} in ${2:list}; do\n\t$0\ndone' },
            { label: 'while loop', detail: 'while 循环', body: 'while [ ${1:condition} ]; do\n\t$0\ndone' },
            { label: 'function', detail: '函数定义', body: '${1:name}() {\n\t$0\n}' },
            { label: 'echo', detail: '输出', body: 'echo "${1:message}"' }
        ]
    },
    java: {
        keywords: [
            'public', 'private', 'protected', 'static', 'final', 'class', 'interface',
            'extends', 'implements', 'void', 'int', 'long', 'float', 'double', 'boolean',
            'char', 'String', 'return', 'if', 'else', 'for', 'while', 'do', 'switch',
            'case', 'break', 'continue', 'new', 'try', 'catch', 'finally', 'throw',
            'throws', 'package', 'import', 'this', 'super', 'true', 'false', 'null', 'abstract'
        ],
        globals: ['System', 'out', 'println', 'print', 'Math', 'String', 'Integer', 'ArrayList', 'HashMap', 'List', 'Map'],
        snippets: [
            { label: 'main', detail: '主方法', body: 'public static void main(String[] args) {\n\t$0\n}' },
            { label: 'class', detail: '类定义', body: 'public class ${1:Name} {\n\tpublic static void main(String[] args) {\n\t\t$0\n\t}\n}' },
            { label: 'method', detail: '方法定义', body: 'public ${1:void} ${2:method}(${3:params}) {\n\t$0\n}' },
            { label: 'println', detail: '输出', body: 'System.out.println(${1:value});' },
            { label: 'for loop', detail: 'for 循环', body: 'for (int ${1:i} = 0; ${1:i} < ${2:n}; ${1:i}++) {\n\t$0\n}' },
            { label: 'if', detail: 'if 语句', body: 'if (${1:condition}) {\n\t$0\n}' }
        ]
    },
    csharp: {
        keywords: [
            'public', 'private', 'protected', 'internal', 'static', 'readonly', 'class',
            'interface', 'namespace', 'using', 'void', 'int', 'long', 'float', 'double',
            'bool', 'char', 'string', 'var', 'return', 'if', 'else', 'for', 'foreach',
            'while', 'switch', 'case', 'break', 'continue', 'new', 'try', 'catch',
            'finally', 'throw', 'this', 'base', 'true', 'false', 'null', 'async', 'await', 'get', 'set'
        ],
        globals: ['Console', 'WriteLine', 'Write', 'ReadLine', 'List', 'Dictionary', 'var', 'int', 'string', 'Task', 'await'],
        snippets: [
            { label: 'main', detail: '主方法', body: 'public static void Main(string[] args) {\n\t$0\n}' },
            { label: 'class', detail: '类定义', body: 'public class ${1:Name} {\n\tpublic ${1:Name}() {\n\t\t$0\n\t}\n}' },
            { label: 'WriteLine', detail: '输出', body: 'Console.WriteLine(${1:value});' },
            { label: 'foreach', detail: 'foreach 循环', body: 'foreach (var ${1:item} in ${2:collection}) {\n\t$0\n}' },
            { label: 'if', detail: 'if 语句', body: 'if (${1:condition}) {\n\t$0\n}' },
            { label: 'namespace', detail: '命名空间', body: 'namespace ${1:Name} {\n\t$0\n}' }
        ]
    },
    xml: {
        keywords: [],
        globals: [],
        snippets: [
            { label: 'xml declaration', detail: 'XML 声明', body: '<?xml version="1.0" encoding="UTF-8"?>' },
            { label: 'element', detail: 'XML 元素', body: '<${1:tag}>\n\t$0\n</${1:tag}>' },
            { label: 'attribute', detail: '带属性元素', body: '<${1:tag} ${2:attr}="${3:value}">${4:text}</${1:tag}>' }
        ]
    },
    sql: {
        keywords: [
            'SELECT', 'FROM', 'WHERE', 'INSERT', 'INTO', 'VALUES', 'UPDATE', 'SET',
            'DELETE', 'CREATE', 'TABLE', 'ALTER', 'DROP', 'INDEX', 'JOIN', 'LEFT',
            'RIGHT', 'INNER', 'OUTER', 'ON', 'GROUP', 'BY', 'ORDER', 'HAVING', 'LIMIT',
            'OFFSET', 'DISTINCT', 'AS', 'AND', 'OR', 'NOT', 'NULL', 'IN', 'BETWEEN',
            'LIKE', 'COUNT', 'SUM', 'AVG', 'MAX', 'MIN'
        ],
        globals: ['COUNT', 'SUM', 'AVG', 'MAX', 'MIN', 'NOW', 'CONCAT', 'COALESCE'],
        snippets: [
            { label: 'select', detail: '查询', body: 'SELECT ${1:columns} FROM ${2:table}\nWHERE ${3:condition};' },
            { label: 'insert', detail: '插入', body: 'INSERT INTO ${1:table} (${2:columns}) VALUES (${3:values});' },
            { label: 'update', detail: '更新', body: 'UPDATE ${1:table}\nSET ${2:column} = ${3:value}\nWHERE ${4:condition};' },
            { label: 'delete', detail: '删除', body: 'DELETE FROM ${1:table}\nWHERE ${2:condition};' },
            { label: 'create table', detail: '建表', body: 'CREATE TABLE ${1:table} (\n\t${2:id} INT PRIMARY KEY,\n\t${3:name} VARCHAR(100)\n);' },
            { label: 'join', detail: '联表查询', body: 'SELECT ${1:a}.*, ${2:b}.*\nFROM ${1:a}\nJOIN ${2:b} ON ${1:a}.${3:id} = ${2:b}.${3:id}\nWHERE ${4:condition};' }
        ]
    }
};

// ---------------------------------------------------------------------------
// 补全提供器工厂
// ---------------------------------------------------------------------------
function buildProvider(cfg) {
    return {
        provideCompletionItems() {
            const items = [];
            for (const k of (cfg.keywords || [])) {
                const item = new vscode.CompletionItem(k, vscode.CompletionItemKind.Keyword);
                item.detail = 'keyword';
                items.push(item);
            }
            for (const g of (cfg.globals || [])) {
                const item = new vscode.CompletionItem(g, vscode.CompletionItemKind.Function);
                item.detail = 'builtin';
                items.push(item);
            }
            for (const s of (cfg.snippets || [])) {
                const item = new vscode.CompletionItem(s.label, vscode.CompletionItemKind.Snippet);
                item.insertText = new vscode.SnippetString(s.body);
                if (s.detail) item.documentation = s.detail;
                items.push(item);
            }
            return items;
        }
    };
}

function activate(context) {
    for (const [langId, cfg] of Object.entries(COMPLETIONS)) {
        const provider = buildProvider(cfg);
        const disp = vscode.languages.registerCompletionItemProvider(langId, provider);
        context.subscriptions.push(disp);
    }
}

function deactivate() { }

module.exports = { activate, deactivate };
