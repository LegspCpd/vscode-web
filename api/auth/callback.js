// Vercel Serverless Function: GitHub OAuth 回调
// 作用：用 code + client_secret 换取 access_token（Secret 只在服务端，不进入浏览器）
// 环境变量：GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET

const clientId = process.env.GITHUB_CLIENT_ID;
const clientSecret = process.env.GITHUB_CLIENT_SECRET;

function html(token, origin) {
  // 同源页面直接把 token 写入 localStorage 后跳回首页
  const safeToken = JSON.stringify(token || '');
  return `<html><body><script>
    (function(){
      try {
        var t = ${safeToken};
        // 统一的会话 key（旧 initGitHub 用）
        localStorage.setItem('gh_auth', JSON.stringify({ token: t, time: Date.now() }));
        // secretStorageProvider 键：供扩展宿主 context.secrets.get('gh_auth') 读取
        localStorage.setItem('gh_secret_gh_auth', t || '');
      } catch (e) {}
      window.location.replace(${JSON.stringify(origin)} + "/");
    })();
  </script></body></html>`;
}

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return res.status(204).end();
  }

  const url = new URL(req.url, 'https://' + (req.headers.host || 'localhost'));
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const error = url.searchParams.get('error');
  const origin = url.searchParams.get('origin') || '';

  if (error) {
    return res.status(200).end(html(null, origin));
  }
  if (!code) {
    return res.status(400).json({ error: 'missing code' });
  }
  if (!clientId || !clientSecret) {
    return res.status(500).json({ error: 'GitHub OAuth env vars not configured' });
  }

  try {
    const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code: code,
        state: state || undefined
      })
    });
    const data = await tokenRes.json();
    if (!data.access_token) {
      return res.status(200).end(html(null, origin) + '<!-- ' + (data.error_description || data.error || 'exchange failed') + ' -->');
    }
    return res.status(200).end(html(data.access_token, origin));
  } catch (err) {
    return res.status(500).json({ error: 'exchange failed' });
  }
}
