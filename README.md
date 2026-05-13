# Movie List App

Next.js 16 / React 19 app that consumes the TMDB API. Includes authentication (NextAuth) with Postgres and a per-user persisted watchlist.

## Setup

Requires Node, Docker and a `.env` file at the root with:

```
NEXT_PUBLIC_TMDB_TOKEN=...    # TMDB Bearer token
DATABASE_URL=postgresql://user:password@localhost:5440/postgresDB
AUTH_SECRET=...               # openssl rand -base64 32
AUTH_GOOGLE_ID=...
AUTH_GOOGLE_SECRET=...
```

Start the database:

```bash
docker compose up --build -d
```

Install dependencies, run the migrations and start the dev server:

```bash
npm install
npx prisma generate
npx prisma migrate deploy
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) (or whichever localhost URL is shown in your terminal).

## Commands

```bash
npm run dev      # dev server (Turbopack)
npm run build    # production build
npm run start    # serve the build
npm run lint     # ESLint
```

## Stack

- Next.js 16 (App Router, Server Components, Server Actions)
- NextAuth v5 + Prisma adapter
- Postgres (via docker-compose)
- Tailwind v4
- TMDB API
