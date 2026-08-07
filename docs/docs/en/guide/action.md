# GitHub Actions Deployment

Auto-deploy to Vercel on every push using GitHub Actions.

## Prerequisites

1. Fork <https://github.com/LegspCpd/vscode-web>
2. Complete the first manual deploy on Vercel (see [Vercel Dashboard](/en/guide/dashboard))

## Get Vercel Credentials

1. Create a Token at <https://vercel.com/account/tokens>
2. Get the **Org ID** and **Project ID** from the Vercel project → **Settings → General** (or via `npx vercel link`)

## Configure GitHub Secrets

In the repo → **Settings → Secrets and variables → Actions**:

| Secret              | Purpose                |
|---------------------|------------------------|
| `VERCEL_TOKEN`      | Vercel API token       |
| `VERCEL_ORG_ID`     | Vercel org ID          |
| `VERCEL_PROJECT_ID` | Vercel project ID      |

Also add `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET` to the **Vercel project environment variables**.

## Workflow File

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Vercel
on:
  push:
    branches: [ main ]
  workflow_dispatch:
jobs:
  deploy:
    runs-on: ubuntu-latest
    env:
      VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
      VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "22"
      - run: npm i -g vercel
      - run: vercel pull --yes --environment=production --token=${{ secrets.VERCEL_TOKEN }}
      - run: vercel build --prod --token=${{ secrets.VERCEL_TOKEN }}
      - run: vercel deploy --prebuilt --prod --token=${{ secrets.VERCEL_TOKEN }}
```

Push to `main` to trigger deployment.
