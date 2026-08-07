# CLI Deployment

Deploy with the Vercel CLI.

## Prerequisites

- [Node.js](https://nodejs.org) v18+
- [Vercel CLI](https://vercel.com/docs/cli) (`npm i -g vercel`)

## Local Preview

```bash
git clone https://github.com/LegspCpd/vscode-web.git
cd vscode-web
npx serve .
# or
python -m http.server 3000
```

## Deploy

```bash
npx vercel login
npx vercel          # development
npx vercel --prod   # production
```

## Environment Variables

```bash
npx vercel env add GITHUB_CLIENT_ID production
npx vercel env add GITHUB_CLIENT_SECRET production
```

## Local API Testing

```bash
npx vercel dev
```

Set the OAuth callback to `http://localhost:3000/api/auth/callback` when testing locally.
