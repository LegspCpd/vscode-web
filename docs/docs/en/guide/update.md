# Project Update

Keep VS Code Web up to date.

## Pull Upstream Updates

```bash
git remote add upstream https://github.com/LegspCpd/vscode-web.git
git fetch upstream
git checkout main
git merge upstream/main
git push origin main
```

Pushing triggers auto-deploy (if GitHub Actions is configured), otherwise redeploy manually in Vercel.

## Redeploy in Vercel

1. Vercel project → **Deployments**
2. Latest deployment → **More → Redeploy**

## Check OAuth Config

If login breaks after an update, verify the callback URL and environment variables.

## Changelog

See releases: <https://github.com/LegspCpd/vscode-web/releases>
