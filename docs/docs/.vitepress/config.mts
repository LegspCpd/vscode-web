import {defineConfig} from 'vitepress'

export default defineConfig({
    locales: {
        root: {
            head: [
                [
                    'link',
                    { rel: 'icon', type: 'image/x-icon', href: '/images/logo.png' }
                ]
            ],
            label: '中文简体',
            lang: 'zh',
            themeConfig: {
                siteTitle: 'VS Code Web',
                logo: '/images/logo.png',
                nav: [
                    {text: '首页', link: '/'},
                    {text: '文档', link: '/preview/description'},
                    {text: '在线演示', link: 'https://vscode.legspcpd.top'},
                    {text: '仓库', link: 'https://github.com/LegspCpd/vscode-web'}
                ],

                sidebar: [
                    {
                        text: '项目预览',
                        items: [
                            {text: '项目介绍', link: '/preview/description'},
                            {text: '更新日志', link: 'https://github.com/LegspCpd/vscode-web/releases'},
                        ]
                    },
                    {
                        text: '部署教程',
                        items: [
                            {text: 'Vercel 界面部署', link: '/guide/dashboard'},
                            {text: 'Action 部署', link: '/guide/action'},
                            {text: '命令部署', link: '/guide/command'},
                            {text: '环境变量', link: '/guide/environment'},
                            {text: '项目更新', link: '/guide/update'}
                        ]
                    },
                    {
                        text: '功能配置',
                        items: [
                            {text: 'GitHub 远程集成', link: '/system/github'},
                            {text: '扩展市场', link: '/system/extensions'},
                            {text: '语法高亮与代码补全', link: '/system/highlight'},
                            {text: '主题与中文', link: '/system/theme'},
                        ]
                    },
                    {
                        text: '第三方登录',
                        items: [
                            {text: 'GitHub OAuth', link: '/oauth2/github.md'},
                        ]
                    },
                    {
                        text: '开放 API',
                        items: [
                            {text: '接口说明', link: '/api/api-doc'},
                        ]
                    },
                    {
                        text: '联系', link: '/contact'
                    }
                ],

                socialLinks: [
                    {icon: 'github', link: 'https://github.com/LegspCpd/vscode-web'},
                ]
            }
        },
        en: {
            head: [
                [
                    'link',
                    { rel: 'icon', type: 'image/x-icon', href: '/images/logo.png' }
                ]
            ],
            label: 'English',
            lang: 'en',
            link: '/en/',
            themeConfig: {
                siteTitle: 'VS Code Web',
                logo: '/images/logo.png',
                nav: [
                    { text: 'Home', link: '/en/' },
                    { text: 'Docs', link: '/en/preview/description' },
                    { text: 'Live Demo', link: 'https://vscode.legspcpd.top' },
                    { text: 'Repo', link: 'https://github.com/LegspCpd/vscode-web' }
                ],

                sidebar: [
                    {
                        text: 'Project Preview',
                        items: [
                            { text: 'Description', link: '/en/preview/description' },
                            { text: 'Changelog', link: 'https://github.com/LegspCpd/vscode-web/releases' },
                        ]
                    },
                    {
                        text: 'Deployment Guide',
                        items: [
                            { text: 'Vercel Dashboard', link: '/en/guide/dashboard'},
                            { text: 'GitHub Actions', link: '/en/guide/action' },
                            { text: 'CLI Deployment', link: '/en/guide/command' },
                            {text: 'Environment Variables', link: '/en/guide/environment'},
                            { text: 'Project Update', link: '/en/guide/update' }
                        ]
                    },
                    {
                        text: 'Features',
                        items: [
                            {text: 'GitHub Integration', link: '/en/system/github'},
                            {text: 'Extension Market', link: '/en/system/extensions'},
                            {text: 'Syntax Highlighting & Completion', link: '/en/system/highlight'},
                            {text: 'Theme & Chinese', link: '/en/system/theme'}
                        ]
                    },
                    {
                        text: 'OAuth',
                        items: [
                            { text: 'GitHub OAuth', link: '/en/oauth2/github.md' },
                        ]
                    },
                    {
                        text: 'Contact', link: '/en/contact'
                    }
                ],

                socialLinks: [
                    { icon: 'github', link: 'https://github.com/LegspCpd/vscode-web' },
                ]
            }
        }
    },
    title: "VS Code Web",
    description: "在浏览器中运行 VS Code - 部署到 Vercel"
})
