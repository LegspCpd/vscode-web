// Vercel Serverless Function: GitHub API 代理
// 前端带 token 请求本代理，代理转发到 api.github.com，避免 CORS 并集中处理请求。
// Token 由前端通过 Authorization: Bearer <token> 传入，本函数只转发，不读取 Secret 环境变量。

const GITHUB_API = 'https://api.github.com';

function applyCors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,PATCH,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, If-Match, X-Requested-With');
}

// 把请求解析为真实 GitHub API 路径。
// Vercel 的 api/proxy.js 只精确匹配 "/api/proxy"，不匹配子路径，因此前端用
// query 传 path（?path=/user/repos...），这里优先读 query；否则回退解析 pathname。
function toApiPath(url, reqHost) {
  const u = new URL(url, 'https://' + (reqHost || 'localhost'));
  const qPath = u.searchParams.get('path');
  if (qPath) {
    return GITHUB_API + qPath;
  }
  let path = decodeURIComponent(u.pathname);
  const prefix = '/api/proxy';
  if (path.startsWith(prefix)) {
    path = path.slice(prefix.length);
  }
  // 保留 query
  return GITHUB_API + path + u.search;
}

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    applyCors(res);
    return res.status(204).end();
  }
  applyCors(res);

  const auth = req.headers.authorization || '';
  if (!auth) {
    return res.status(401).json({ error: 'missing authorization token' });
  }

  // 读取请求体（JSON）
  let body = null;
  try {
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const raw = Buffer.concat(chunks).toString('utf8');
    if (raw) body = raw;
  } catch (e) { body = null; }

  let url;
  try {
    url = toApiPath(req.url, req.headers.host);
  } catch (e) {
    return res.status(400).json({ error: 'bad url' });
  }

  const headers = {
    'Authorization': auth,
    'Accept': 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28'
  };
  if (body) headers['Content-Type'] = 'application/json';

  try {
    const upstream = await fetch(url, {
      method: req.method,
      headers: headers,
      body: body || undefined
    });
    const text = await upstream.text();
    res.status(upstream.status);
    // 转发 content-type（如果上游返回 JSON 则按 JSON 返回）
    const ct = upstream.headers.get('content-type') || '';
    if (ct.includes('json')) {
      res.setHeader('Content-Type', 'application/json');
      let parsed;
      try { parsed = JSON.parse(text); } catch (e) { parsed = text; }
      return res.send(parsed === undefined ? text : JSON.stringify(parsed));
    }
    res.setHeader('Content-Type', ct || 'text/plain');
    return res.send(text);
  } catch (err) {
    return res.status(502).json({ error: 'proxy upstream error' });
  }
}
