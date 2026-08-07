// 配置接口：返回运行时功能开关（读自环境变量）
// 目前用于控制 GitHub 打开仓库功能。
// 环境变量 GH-BATE-OPEN=turn 时开启 GitHub 功能（默认关闭）。
export default async function handler(req, res) {
    const githubOpen = process.env['GH-BATE-OPEN'] === 'turn';
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Cache-Control', 'no-store');

    if (req.method === 'OPTIONS') {
        res.status(204).end();
        return;
    }

    res.status(200).json({
        githubOpen: !!githubOpen
    });
}
