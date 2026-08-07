// GitHub 原生视图扩展（Web）
// 在 VS Code 原生活动栏/侧边栏注册一个 webview 视图。点击活动栏 GitHub 图标即切换到此视图
// （与资源管理器同一套原生侧边栏容器），不再弹出浮动窗口。
// 数据流：webview (跨域 vscode-cdn.net) --postMessage--> 扩展宿主(同源) --fetch /api/proxy--
// token 经 context.secrets（secretStorageProvider=localStorage，同源）读取 OAuth 回调写入的 token。
const vscode = require('vscode');

class GitHubViewProvider {
    constructor(context) { this._ctx = context; this._currentFile = null; }

    resolveWebviewView(webviewView, context, token) {
        this._view = webviewView;
        const wv = webviewView.webview;
        wv.options = {
            enableScripts: true,
            enableForms: true,
            localResourceRoots: []
        };
        wv.html = getHtml();

        // 处理来自 webview 的消息（API 请求/登录/登出/取 token）
        wv.onDidReceiveMessage(async (msg) => {
            try {
                if (msg.type === 'api') {
                    const id = msg.id;
                    const data = await this._proxyApi(msg.method, msg.url, msg.body);
                    wv.postMessage({ type: 'apiResult', id, ok: data.ok, status: data.status, data: data.data });
                } else if (msg.type === 'login') {
                    // 构造授权 URL 返回给 webview，由 webview 用 window.open 打开（web 扩展的
                    // openExternal 在 webview 沙箱中可能被阻止，导致授权页弹不出来）
                    const loginUrl = await this._login();
                    wv.postMessage({ type: 'loginUrl', url: loginUrl });
                } else if (msg.type === 'logout') {
                    await this._ctx.secrets.delete('gh_auth');
                    wv.postMessage({ type: 'logoutDone' });
                } else if (msg.type === 'getToken') {
                    const t = await this._ctx.secrets.get('gh_auth');
                    wv.postMessage({ type: 'getTokenResult', id: msg.id, token: t || null });
                } else if (msg.type === 'openFile') {
                    // 在主编辑器打开文件（用户在主界面写代码处编辑）
                    await this._openInEditor(msg);
                } else if (msg.type === 'save') {
                    const r = await this._saveCurrent();
                    wv.postMessage({ type: 'saveResult', ok: r.ok, message: r.message });
                }
            } catch (e) {
                wv.postMessage({ type: 'error', message: String((e && e.message) || e) });
            }
        });
    }

    async _proxyApi(method, url, body) {
        const token = await this._ctx.secrets.get('gh_auth');
        const headers = {};
        if (token) headers['Authorization'] = 'Bearer ' + token;
        if (body !== undefined) headers['Content-Type'] = 'application/json';
        // 用扩展 URI 推断站点 origin（扩展运行在 web worker，无 location 全局变量）
        // 用 query 传 path，确保精确路由到 /api/proxy（Vercel 的 api/proxy.js 不匹配子路径）
        const base = new URL('/api/proxy', this._ctx.extensionUri).href;
        const apiUrl = base + '?path=' + encodeURIComponent(url);
        try {
            const res = await fetch(apiUrl, {
                method: method || 'GET',
                headers,
                body: body !== undefined ? (typeof body === 'string' ? body : JSON.stringify(body)) : undefined
            });
            const text = await res.text();
            let data;
            try { data = text ? JSON.parse(text) : null; } catch (e) { data = text; }
            return { ok: res.ok, status: res.status, data };
        } catch (e) {
            return { ok: false, status: 0, data: { error: String((e && e.message) || e) } };
        }
    }

    async _login() {
        const clientId = 'Ov23liDtRHzVSs0Pued6';
        // 从扩展 URI 推断站点 origin（不依赖 worker 的 location）
        const origin = new URL(this._ctx.extensionUri).origin;
        const state = 'gh_' + Date.now();
        // redirect_uri 保持干净 URL（无 query）。GitHub 会在其后追加 ?code=..&state=..
        const redirectUri = origin + '/api/auth/callback';
        const url = 'https://github.com/login/oauth/authorize?client_id=' + clientId +
            '&redirect_uri=' + encodeURIComponent(redirectUri) + '&scope=repo&state=' + state;
        return url;
    }

    // 在主编辑器打开 GitHub 文件（用户在主界面写代码处编辑，而非侧边栏小编辑框）
    async _openInEditor(msg) {
        const repo = msg.repo, path = msg.path, branch = msg.branch;
        const res = await this._proxyApi('GET', '/repos/' + repo + '/contents/' + encodeURIComponent(path) + '?ref=' + branch);
        if (!res.ok) {
            if (this._view) this._view.webview.postMessage({ type: 'error', message: '无法读取文件：' + ((res.data && res.data.message) || res.status) });
            return;
        }
        let content = '';
        if (res.data.encoding === 'base64') content = this._decodeBase64(res.data.content);
        else if (typeof res.data.content === 'string') content = res.data.content;
        const doc = await vscode.workspace.openTextDocument({ content: content, language: this._guessLang(path) });
        await vscode.window.showTextDocument(doc, { preview: true });
        this._currentFile = { repo: repo, path: path, branch: branch, sha: res.data.sha };
    }

    // 把当前主编辑器文档内容保存回 GitHub
    async _saveCurrent() {
        if (!this._currentFile) return { ok: false, message: '未打开任何 GitHub 文件' };
        const editor = vscode.window.activeTextEditor;
        if (!editor) return { ok: false, message: '没有活动的编辑器' };
        const content = editor.document.getText();
        const f = this._currentFile;
        const body = { message: 'Update ' + f.path, content: this._encodeBase64(content), branch: f.branch };
        if (f.sha) body.sha = f.sha;
        const res = await this._proxyApi('PUT', '/repos/' + f.repo + '/contents/' + encodeURIComponent(f.path), body);
        if (res.ok) {
            if (res.data && res.data.content && res.data.content.sha) this._currentFile.sha = res.data.content.sha;
            return { ok: true, message: '已保存到 ' + f.repo + ':' + f.path };
        }
        return { ok: false, message: '保存失败：' + ((res.data && res.data.message) || res.status) };
    }

    _guessLang(path) {
        const p = path.toLowerCase();
        const map = {
            '.js': 'javascript', '.mjs': 'javascript', '.cjs': 'javascript', '.jsx': 'javascript',
            '.ts': 'typescript', '.tsx': 'typescript',
            '.json': 'json', '.jsonc': 'json',
            '.html': 'html', '.htm': 'html',
            '.css': 'css',
            '.py': 'python', '.pyw': 'python', '.pyi': 'python',
            '.md': 'markdown', '.markdown': 'markdown',
            '.yaml': 'yaml', '.yml': 'yaml',
            '.c': 'cpp', '.cpp': 'cpp', '.cc': 'cpp', '.h': 'cpp', '.hpp': 'cpp', '.hxx': 'cpp',
            '.go': 'go', '.rs': 'rust', '.php': 'php',
            '.sh': 'shellscript', '.bash': 'shellscript', '.zsh': 'shellscript',
            '.java': 'java', '.cs': 'csharp',
            '.xml': 'xml', '.svg': 'xml', '.sql': 'sql'
        };
        for (const ext in map) if (p.endsWith(ext)) return map[ext];
        return 'plaintext';
    }

    _decodeBase64(s) {
        try {
            const bin = atob(s.replace(/\s/g, ''));
            const bytes = new Uint8Array(bin.length);
            for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
            return new TextDecoder('utf-8').decode(bytes);
        } catch (e) { return s; }
    }

    _encodeBase64(s) {
        try {
            const bytes = new TextEncoder().encode(s);
            let bin = '';
            bytes.forEach(b => { bin += String.fromCharCode(b); });
            return btoa(bin);
        } catch (e) { return btoa(unescape(encodeURIComponent(s))); }
    }
}

function getHtml() {
    return `<!DOCTYPE html>
<html lang="zh-cn">
<head>
<meta charset="UTF-8">
<meta http-equiv="Content-Security-Policy"
  content="default-src 'none'; style-src 'unsafe-inline'; img-src * data:; script-src 'unsafe-inline'; connect-src 'self' http: https:; frame-src * http: https:;">
<style>
  *{box-sizing:border-box}
  html,body{margin:0;height:100%;background:#252526;color:#cccccc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI','Microsoft YaHei',sans-serif;font-size:13px}
  body{display:flex;flex-direction:column;overflow:hidden}
  .tb{flex:0 0 auto;display:flex;align-items:center;justify-content:space-between;padding:6px 10px;border-bottom:1px solid #3c3c3c;background:#2d2d2d}
  .title{font-weight:600;color:#fff;font-size:12px}
  .btn{background:#3c3c3c;color:#ddd;border:1px solid #4a4a4a;border-radius:3px;padding:4px 9px;cursor:pointer;font-size:12px}
  .btn:hover{background:#454545}
  .btn-primary{background:#0e639c;border-color:#0e639c;color:#fff}
  .btn-primary:hover{background:#1177bb}
  .auth{padding:10px 12px}
  .login{display:block;width:100%;padding:5px 10px;font-size:12px;line-height:1.3;text-align:center;border-radius:3px}
  .picker{padding:8px 10px;border-bottom:1px solid #3c3c3c}
  .lbl{font-size:11px;color:#9d9d9d;margin-bottom:4px}
  .repos{max-height:50vh;overflow:auto}
  .repo{display:grid;grid-template-columns:20px 1fr;grid-template-rows:auto auto;gap:0 6px;align-items:center;padding:7px 6px;border-radius:4px;cursor:pointer}
  .repo:hover{background:rgba(255,255,255,0.06)}
  .repo .ic{grid-row:1/3;color:#c5c5c5}
  .repo .nm{font-size:12.5px;color:#e8e8e8;font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  .repo .ds{font-size:11px;color:#9d9d9d;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  .tabs{display:flex;border-bottom:1px solid #3c3c3c;flex:0 0 auto}
  .tab{background:transparent;border:none;color:#9d9d9d;padding:7px 12px;cursor:pointer;font-size:12px;border-bottom:2px solid transparent}
  .tab:hover{color:#fff}
  .tab.on{color:#fff;border-bottom-color:#007acc}
  .body{flex:1 1 auto;display:flex;flex-direction:column;overflow:hidden}
  .tree,.prev{flex:1 1 auto;overflow:auto;padding:6px 4px}
  .tf,.td{display:flex;align-items:center;gap:6px;padding:4px 8px;cursor:pointer;color:#ccc;font-size:12.5px}
  .tf:hover,.td:hover{background:rgba(255,255,255,0.06)}
  .root{font-weight:600;color:#fff;padding-left:8px}
  .ind{margin-left:14px}
  .empty{color:#9d9d9d;padding:12px;font-size:12.5px}
  .et{padding:8px 12px;color:#d4d4d4;font-weight:500;font-size:12.5px;background:#1f1f1f;border-bottom:1px solid #3c3c3c}
  .ed{flex:1 1 auto;display:flex;flex-direction:column;overflow:hidden}
  .ed textarea{flex:1 1 auto;width:100%;min-height:150px;background:#1e1e1e;color:#d4d4d4;border:none;padding:10px;font-family:Consolas,monospace;font-size:12px;resize:none;outline:none;line-height:1.5}
  .ea{flex:0 0 auto;display:flex;gap:8px;padding:8px 12px;border-top:1px solid #3c3c3c;background:#2d2d2d}
  .st{flex:0 0 auto;padding:4px 10px;font-size:11px;color:#9d9d9d;border-top:1px solid #3c3c3c;background:#1f1f1f;min-height:22px}
</style>
</head>
<body>
  <div class="tb"><span class="title">GitHub 仓库</span><div><button class="btn" id="save">保存当前</button><button class="btn" id="refresh">↻</button></div></div>
  <div class="auth" id="auth"><button class="btn btn-primary login" id="login">↗ 使用 GitHub 登录</button></div>
  <div class="picker" id="picker" hidden><div class="repos" id="repos"></div></div>
  <div class="tabs" id="tabs" hidden><button class="tab on" data-t="tree">文件</button><button class="tab" data-t="prev">内容</button></div>
  <div class="body"><div class="tree" id="tree" hidden></div><div class="prev" id="prev" hidden></div></div>
  <div class="st" id="st">&nbsp;</div>
<script>
(function () {
  var vscode = acquireVsCodeApi();
  var seq = 0, pending = {};

  function send(type, payload, cb) {
    var msg = { type: type };
    if (payload) Object.assign(msg, payload);
    if (cb) { var id = ++seq; msg.id = id; pending[id] = cb; }
    vscode.postMessage(msg);
  }

  function gh(url, opts) {
    var o = opts || {};
    return new Promise(function (resolve) {
      send('api', { method: o.method || 'GET', url: url, body: o.body }, function (r) { resolve(r); });
    });
  }

  var authEl = document.getElementById('auth');
  var loginBtn = document.getElementById('login');
  var picker = document.getElementById('picker');
  var reposEl = document.getElementById('repos');
  var tabsEl = document.getElementById('tabs');
  var treeEl = document.getElementById('tree');
  var prevEl = document.getElementById('prev');
  var stEl = document.getElementById('st');
  var refreshBtn = document.getElementById('refresh');

  var username = null, repos = [], currentRepo = null, currentBranch = 'main', treeCache = [], curPath = null, curSha = null;

  function setStatus(s) { stEl.textContent = s || '\\u00a0'; }

  function setTab(n) {
    document.querySelectorAll('.tab').forEach(function (t) { t.classList.toggle('on', t.dataset.t === n); });
    if (n === 'tree') { prevEl.hidden = true; treeEl.hidden = false; }
    else { treeEl.hidden = true; prevEl.hidden = false; }
  }

  async function refreshView() {
    send('getToken', null, async function (r) {
      if (!r.token) {
        treeEl.innerHTML = ''; treeEl.hidden = true; prevEl.hidden = true;
        authEl.hidden = false; picker.hidden = true; tabsEl.hidden = true;
        return;
      }
      authEl.hidden = true;
      await loadRepos();
    });
  }

  async function loadRepos() {
    picker.hidden = true; treeEl.hidden = false;
    treeEl.innerHTML = '<div class="empty">加载仓库…</div>';
    var r = await gh('/user/repos?per_page=100&sort=updated');
    if (!r.ok) { treeEl.innerHTML = '<div class="empty">无法读取仓库：' + ((r.data && r.data.message) || r.status) + '</div>'; return; }
    repos = r.data;
    reposEl.innerHTML = '';
    repos.forEach(function (repo) {
      var it = document.createElement('div'); it.className = 'repo';
      var ic = document.createElement('span'); ic.className = 'ic'; ic.textContent = '\\ud83d\\udce6';
      var nm = document.createElement('span'); nm.className = 'nm'; nm.textContent = repo.name + (repo.private ? ' \\ud83d\\udd12' : '');
      var ds = document.createElement('div'); ds.className = 'ds'; ds.textContent = (repo.description || repo.full_name) + (repo.default_branch ? ' \\u00b7 ' + repo.default_branch : '');
      it.appendChild(ic); it.appendChild(nm); it.appendChild(ds);
      it.title = '双击打开 ' + repo.full_name;
      it.addEventListener('dblclick', function () { openRepoTree(repo); });
      reposEl.appendChild(it);
    });
    picker.hidden = false; tabsEl.hidden = true; treeEl.hidden = true; prevEl.hidden = true;
  }

  async function openRepoTree(repo) {
    currentRepo = repo.full_name; currentBranch = repo.default_branch || 'main';
    curPath = null; curSha = null;
    picker.hidden = true; tabsEl.hidden = false; treeEl.hidden = false; prevEl.hidden = true;
    setTab('tree');
    treeEl.innerHTML = '<div class="td root">' + repo.full_name + '</div><div class="empty">加载文件树…</div>';
    var t = await gh('/repos/' + repo.full_name + '/git/trees/' + currentBranch + '?recursive=1');
    if (!t.ok) { treeEl.innerHTML = '<div class="empty">无法加载文件树：' + ((t.data && t.data.message) || t.status) + '</div>'; return; }
    treeCache = (t.data.tree || []).filter(function (x) { return x.type === 'blob'; }).map(function (x) { return { path: x.path, sha: x.sha }; });
    renderTree();
  }

  function renderTree() {
    treeEl.innerHTML = '<div class="td root">' + currentRepo + '（分支 ' + currentBranch + '）</div>';
    var sorted = treeCache.slice().sort(function (a, b) {
      var da = a.path.split('/').length, db = b.path.split('/').length;
      return da !== db ? da - db : a.path.localeCompare(b.path);
    });
    sorted.forEach(function (f) {
      var parts = f.path.split('/'); var depth = parts.length - 1;
      var div = document.createElement('div');
      div.className = 'tf' + (depth > 0 ? ' ind' : '');
      div.style.paddingLeft = (8 + depth * 14) + 'px';
      div.textContent = '\\ud83d\\udcc4 ' + parts[parts.length - 1];
      div.title = f.path;
      div.addEventListener('click', function () { openFile(f.path, f.sha); });
      treeEl.appendChild(div);
    });
    if (sorted.length === 0) treeEl.innerHTML += '<div class="empty">（空仓库）</div>';
  }

  function openFile(path, sha) {
    curPath = path; curSha = sha;
    // 在主编辑器打开（扩展侧 openTextDocument + showTextDocument），不在此小面板渲染
    setStatus('正在主编辑器打开 ' + path + ' …');
    send('openFile', { repo: currentRepo, path: path, branch: currentBranch, sha: sha });
    // 切回文件树视图，把编辑区交给主编辑器
    tabsEl.hidden = true; treeEl.hidden = false; prevEl.hidden = true;
    setTab('tree');
  }

  function decodeBase64(s) {
    try {
      if (typeof atob !== 'undefined') {
        var bin = atob(s.replace(/\\s/g, '')); var bytes = new Uint8Array(bin.length);
        for (var i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
        return new TextDecoder('utf-8').decode(bytes);
      }
    } catch (e) {}
    return s;
  }
  function encodeBase64(s) {
    try {
      var bytes = new TextEncoder().encode(s); var bin = '';
      bytes.forEach(function (b) { bin += String.fromCharCode(b); });
      return btoa(bin);
    } catch (e) { return btoa(unescape(encodeURIComponent(s))); }
  }

  window.addEventListener('message', function (ev) {
    var msg = ev.data;
    if (!msg) return;
    if (msg.type === 'apiResult' && pending[msg.id]) {
      var cb = pending[msg.id]; delete pending[msg.id];
      cb({ ok: msg.ok, status: msg.status, data: msg.data });
    } else if (msg.type === 'getTokenResult' && pending[msg.id]) {
      var cb = pending[msg.id]; delete pending[msg.id];
      cb({ token: msg.token });
    } else if (msg.type === 'loginUrl') {
      // 用浏览器居中的弹窗打开 GitHub 授权页（验证完自动关闭，主页面自动刷新）
      var wdt = 640, hgt = 780;
      var left = Math.max(0, (window.screen.width - wdt) / 2);
      var top = Math.max(0, (window.screen.height - hgt) / 2);
      var w = window.open(msg.url, 'gh-oauth',
        'width=' + wdt + ',height=' + hgt + ',left=' + left + ',top=' + top +
        ',resizable=yes,scrollbars=yes,menubar=no,status=no');
      if (!w) { window.location.href = msg.url; }
    } else if (msg.type === 'saveResult') {
      setStatus(msg.message);
    } else if (msg.type === 'error') {
      setStatus(msg.message || '出错');
    }
  });

  loginBtn.addEventListener('click', function () { send('login'); });
  refreshBtn.addEventListener('click', function () { refreshView(); });
  document.querySelectorAll('.tab').forEach(function (t) { t.addEventListener('click', function () { setTab(t.dataset.t); }); });
  var saveBtn = document.getElementById('save');
  if (saveBtn) saveBtn.addEventListener('click', function () { setStatus('正在保存到 GitHub …'); send('save'); });

  refreshView();
})();
</script>
</body>
</html>`;
}

// 读取运行时配置（环境变量 GH-BATE-OPEN=turn 时开启 GitHub 功能，默认关闭）
async function isGitHubOpen(context) {
    try {
        // 用扩展 URI 推断站点 origin（扩展运行在 web worker，无 location 全局变量）
        const base = new URL('/api/config', context.extensionUri).href;
        const res = await fetch(base);
        if (res.ok) {
            const cfg = await res.json();
            return !!cfg.githubOpen;
        }
    } catch (e) {
        // 读取失败则按关闭处理
    }
    return false;
}

async function activate(context) {
    // 判断 GitHub 功能是否开启（默认关闭，环境变量 GH-BATE-OPEN=turn 开启）
    const githubOpen = await isGitHubOpen(context);

    // 设置 context key，控制活动栏 GitHub 图标的显示/隐藏
    await vscode.commands.executeCommand('setContext', 'ghFeaturesEnabled', githubOpen);

    if (!githubOpen) {
        // 功能未开启：不注册 GitHub 视图
        return;
    }

    const provider = new GitHubViewProvider(context);
    context.subscriptions.push(
        vscode.window.registerWebviewViewProvider('githubReposView', provider, {
            webviewOptions: { retainContextWhenHidden: true }
        }),
        // 命令：把当前主编辑器内容保存到 GitHub（用户也可用命令面板执行）
        vscode.commands.registerCommand('github.saveFile', async () => {
            const r = await provider._saveCurrent();
            vscode.window.showInformationMessage(r.message);
        })
    );
}

function deactivate() { }

module.exports = { activate, deactivate };

