# QXK24 Web

Next.js 15 frontend for the QXK24 Journal Contributor System (`qxk24.com`).

## Setup

```bash
cp .env.example .env.local
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Routes

| Path | Description |
|------|-------------|
| `/` | Home |
| `/journals` | Published journal list |
| `/journals/[slug]` | Journal reader + analysis |
| `/journals/submit` | 3-step contributor form |
| `/leaderboard` | Constitutional score rankings |

## API

All data from `NEXT_PUBLIC_API_URL` (default `https://api.qiubbx.com`):

- `GET /api/journals`
- `GET /api/journals/:slug`
- `POST /api/journals/submit`
- `GET /api/journals/leaderboard`

## Deploy

```bash
npm run build
npm start
```

Point `qxk24.com` DNS to your host (Vercel, VPS, etc.) and set `NEXT_PUBLIC_API_URL`.
