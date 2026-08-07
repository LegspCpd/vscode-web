# Deploy on Vercel

The easiest way to deploy, all from the web UI.

## Prerequisites

- A [GitHub](https://github.com) account (to host code and create the OAuth app)
- A [Vercel](https://vercel.com) account (sign in with GitHub)

## Step 1: One-click Deploy

Click the button below to import and deploy this repo with your GitHub account:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/LegspCpd/vscode-web)

Or manually:
1. Fork <https://github.com/LegspCpd/vscode-web>
2. In Vercel → **Add New Project** → import your fork
3. Keep Framework Preset as **Other** and click **Deploy**

> The repo already contains `vercel.json`, no extra build config needed.

## Step 2: Create a GitHub OAuth App

1. Go to <https://github.com/settings/developers> → **New OAuth App**
2. Fill in:
   - **Application name**: e.g. `VS Code Web`
   - **Homepage URL**: your domain, e.g. `https://vscode.legspcpd.top`
   - **Authorization callback URL**: `https://your-domain/api/auth/callback`
3. Register and copy the **Client ID** and **Client Secret**

## Step 3: Configure Environment Variables

In Vercel → **Settings** → **Environment Variables**:

| Name                  | Required | Purpose                           |
|-----------------------|:--:|-----------------------------------|
| `GITHUB_CLIENT_ID`    | ✅  | GitHub OAuth Client ID           |
| `GITHUB_CLIENT_SECRET`| ✅  | GitHub OAuth Client Secret       |

## Step 4: Redeploy

After adding variables, go to **Deployments** → latest deployment → **Redeploy**.

## Done

Open your Vercel domain, click the **GitHub** icon in the sidebar and **Login** to start editing your remote repos.
