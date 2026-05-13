# Auth System Design — Movie List App

**Date:** 2026-05-11  
**Status:** Approved

---

## Context

The app currently has no authentication. The watchlist is persisted via cookies with no user identity. The goal is to add a full auth system so each user has their own account and watchlist, with session expiration.

---

## Requirements

- Login and logout
- Credentials auth (email + password)
- Google OAuth
- User persistence in PostgreSQL (Neon serverless)
- Watchlist migrated from cookies to DB, per-user
- Session expiration: 30 days (JWT-based)
- All routes protected except `/login` and Auth.js callbacks

---

## Stack

| Concern | Technology |
|---------|-----------|
| Auth library | Auth.js v5 (`next-auth@beta`) |
| ORM | Prisma |
| Database | Neon (PostgreSQL serverless) |
| Input validation | Zod |
| Password hashing | bcrypt |

---

## Architecture — Layered

```
src/
├── dal/                        # Data Access Layer — Prisma queries only, no business logic
│   ├── users.dal.ts            # findByEmail(email), createUser(input)
│   └── watchlist.dal.ts        # findByUserId(userId), add(userId, movieId), remove(userId, movieId)
│
├── services/                   # Services Layer — business logic
│   ├── auth.service.ts         # register(input), validateCredentials(email, password)
│   └── watchlist.service.ts    # add(userId, movieId), remove(userId, movieId), getForUser(userId)
│
├── lib/
│   ├── prisma.ts               # Prisma Client singleton
│   └── validations/
│       ├── auth.ts             # RegisterSchema, LoginSchema + inferred types
│       └── watchlist.ts        # AddMovieSchema
│
├── types/
│   ├── movie.ts                # (existing)
│   └── db.ts                   # Re-exports: User, Watchlist, Account from @prisma/client
│
├── actions/
│   └── watchlist.ts            # Server Actions — thin, calls watchlist.service
│
└── app/
    └── login/
        └── page.tsx            # Login + Register form + Google button
```

**Root level:**
- `auth.ts` — Auth.js configuration (providers, adapter, callbacks, session maxAge)
- `middleware.ts` — Route protection
- `prisma/schema.prisma` — DB schema

---

## Database Schema (Prisma)

```prisma
model User {
  id        String      @id @default(cuid())
  name      String?
  email     String      @unique
  password  String?     // null for Google-only users
  accounts  Account[]
  watchlist Watchlist[]
}

// Required by Auth.js Prisma Adapter — links Google accounts to User
model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text
  session_state     String?
  user              User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  @@unique([provider, providerAccountId])
}

model Watchlist {
  id        String   @id @default(cuid())
  userId    String
  movieId   Int
  createdAt DateTime @default(now())
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  @@unique([userId, movieId])
}
```

No `Session` table — JWT strategy stores session entirely in a signed cookie (30-day expiry).

---

## Auth.js Configuration (`auth.ts`)

```ts
// auth.ts (project root)
export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt", maxAge: 30 * 24 * 60 * 60 }, // 30 days
  providers: [
    Google,
    Credentials({
      authorize: async ({ email, password }) => {
        return authService.validateCredentials(email, password)
      },
    }),
  ],
})
```

---

## Authentication Flows

### Google OAuth
1. User clicks "Continue with Google"
2. Auth.js redirects to Google
3. Google returns user profile
4. Prisma Adapter finds or creates `User` + `Account`
5. JWT cookie set (30 days), redirect to `/`

### Credentials Login
1. User submits login form → Server Action calls `signIn("credentials", { email, password })`
2. Auth.js calls `authorize()` → delegates to `authService.validateCredentials()`
3. DAL fetches user by email, bcrypt compares password
4. JWT cookie set, redirect to `/`

### Registration
Server Action (not Auth.js built-in):
1. Validate input with `RegisterSchema.safeParse()`
2. `authService.register()` → checks email uniqueness, bcrypt hashes password, DAL creates user
3. Auto sign-in with `signIn("credentials")` to create session

### Logout
`signOut()` called from Header → clears JWT cookie → redirect to `/login`

---

## Route Protection (middleware.ts)

```ts
export { auth as middleware } from "./auth"
export const config = {
  matcher: ["/((?!login|api/auth|_next|favicon).*)"],
}
```

Unauthenticated requests to any protected route are redirected to `/login`.

---

## Watchlist Migration

`src/actions/watchlist.ts` is refactored to use `watchlist.service` instead of cookies:
- `addToWatchlist(movieId)` — gets `userId` from `auth()`, calls service
- `removeFromWatchlist(movieId)` — same
- `getWatchlist()` — used by server components in `/watchlist` page

The cookie-based implementation is fully replaced.

---

## UI Changes

**`/login` page:** Two tabs — "Sign in" (email + password) and "Register" (name + email + password) — plus a "Continue with Google" button.

**`Header` component:** Becomes a Server Component. Shows user avatar/name + "Sign out" button when authenticated; "Sign in" link when not.

---

## Environment Variables

```env
DATABASE_URL=          # Neon connection string
AUTH_SECRET=           # openssl rand -base64 32
AUTH_GOOGLE_ID=        # Google Cloud Console OAuth client ID
AUTH_GOOGLE_SECRET=    # Google Cloud Console OAuth client secret
```

---

## Verification

1. `npx prisma migrate dev` runs without errors
2. Register a new user with email/password → appears in DB
3. Login with those credentials → JWT cookie set, app accessible
4. Login with Google → User + Account created in DB
5. Access `/watchlist` without session → redirected to `/login`
6. Add/remove watchlist items → persisted in DB per user, not cookies
7. Wait for session expiry (or manually clear cookie) → redirected to `/login`
