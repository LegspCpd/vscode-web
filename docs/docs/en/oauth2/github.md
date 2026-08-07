# GitHub OAuth

VS Code Web uses **GitHub OAuth** for remote repo browsing and editing.

## Create an OAuth App

1. <https://github.com/settings/developers> → **New OAuth App**
2. Fill in:
   - **Application name**: e.g. `VS Code Web`
   - **Homepage URL**: your domain
   - **Authorization callback URL**: `https://your-domain/api/auth/callback`
3. Register and copy the **Client ID** and **Client Secret**

## Configure Environment Variables

In Vercel → **Settings → Environment Variables**:

| Name                  | Required | Purpose                    |
|-----------------------|:--:|-----------------------------|
| `GITHUB_CLIENT_ID`    | ✅  | GitHub OAuth Client ID     |
| `GITHUB_CLIENT_SECRET`| ✅  | GitHub OAuth Client Secret |

Then redeploy.

## Login Flow

Click **GitHub** in the sidebar → **Login** → authorize in the popup. It closes automatically and the page reloads to show your repos.

See [GitHub Integration](/en/system/github) for usage.
