# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev      # start dev server (Turbopack)
npm run build    # production build
npm run lint     # ESLint
```

No test runner is configured beyond the single `Hero.test.tsx` file — check `package.json` before assuming tests can be run.

## Environment

Requires `NEXT_PUBLIC_TMDB_TOKEN` in `.env` — this is the TMDB Bearer token used for all API requests.

## Architecture

**Next.js 16 / React 19 app** using the App Router. All pages under `src/app/` are React Server Components by default; client components are explicitly marked `'use client'`.

### Data flow

- `src/movieService.ts` — all TMDB API calls. Most functions are marked `'use server'` and use Next.js `'use cache'` with `cacheLife`/`cacheTag` for server-side caching. `fetchMovies` is the exception: it has no cache directive and is called client-side from `useMovies`.
- `src/actions/watchlist.ts` — Server Actions that read/write watchlist state to a cookie (`watchlist` key, JSON array of movie IDs). Calls `revalidatePath` after mutations.
- `src/hooks/useMovies.ts` — Client-side hook that owns filter/search/pagination state, syncs it to URL search params, and calls `fetchMovies` directly.

### Pages

| Route | Description |
|---|---|
| `/` | Hero (first trending movie) + `MovieSection` (filterable grid) |
| `/movie/[id]` | Movie details, trailer, cast/crew, watchlist button. Uses `generateStaticParams` to pre-render top 20 trending movies. |
| `/watchlist` | Reads watchlist cookie server-side, fetches each movie's details. |

### Component split

- Server components fetch data and pass it as props.
- `MovieSection` is the main client boundary: it wraps `Filters`, `ContentGrid`, and `Pagination`, all driven by `useMovies`.
- `WatchlistButton` is a client component that calls the `addToWatchlist`/`removeFromWatchlist` Server Actions.

### Caching strategy

TMDB responses are cached at the function level using Next.js `'use cache'`:
- Trending: `cacheLife('hours')`
- Movie details/videos/credits: `cacheLife('days')`
- Genres: `cacheLife('max')`

Tags follow the pattern `movie-{id}` for per-movie invalidation.
