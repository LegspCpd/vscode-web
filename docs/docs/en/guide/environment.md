# Environment Variables

Configure these in **Vercel → Settings → Environment Variables**.

## Required Variables

| Name                  | Required | Default | Purpose                          |
|-----------------------|:--:|:----:|-----------------------------------|
| `GITHUB_CLIENT_ID`    | ✅  |  none | GitHub OAuth Client ID           |
| `GITHUB_CLIENT_SECRET`| ✅  |  none | GitHub OAuth Client Secret       |

These enable **GitHub OAuth login**, read by:
- `api/auth/callback.js` — exchanges the auth code for a token
- `api/proxy.js` — proxies GitHub API requests

## Getting Client ID / Secret

1. Go to <https://github.com/settings/developers> → **New OAuth App**
2. Set the callback URL to `https://your-domain/api/auth/callback`
3. Register to get the Client ID and Client Secret

## Notes

- Without these variables, GitHub login is disabled, but local editing, highlighting and completion still work.
- Environment variables are server-side only and are never sent to the browser.

## FAQ

**Login still fails after configuring variables?**
- Make sure the callback URL exactly matches the OAuth App (`https://your-domain/api/auth/callback`, no extra query params)
- Redeploy after changing variables
