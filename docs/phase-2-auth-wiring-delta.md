# Phase 2.8 — Auth wiring delta

**Commit:** `phase-2: features/auth + wire requireAuth into other packs`

## New files

| File | Purpose |
|------|---------|
| `server/src/features/auth/middleware.ts` | `requireAuth`, `optionalAuth`, `authSubject` (Auth0 JWT) |
| `server/src/features/auth/controller.ts` | `GET /me` handler |
| `server/src/features/auth/router.ts` | `/api/auth/me` |
| `server/src/features/auth/write-guards.ts` | `writeGuards(siteConfig)` → `[requireAuth]` when `features.auth` |
| `server/src/features/auth/index.ts` | Pack `register` + re-exports |
| `client/src/features/auth/components/LoginButton.tsx` | Universal login redirect |
| `client/src/features/auth/components/LogoutButton.tsx` | Universal logout |
| `client/src/features/auth/hooks/useSession.ts` | `GET /api/auth/me` |
| `client/src/features/auth/index.ts` | Client exports |

## Modified files (line-level)

### `server/.env.example`

- Replaced required `AUTH0_DOMAIN` with `AUTH0_ISSUER_BASE_URL` + documented `AUTH0_DOMAIN` as legacy fallback in comment.

### `server/src/middleware/auth.ts`

- Replaced inline `checkJwt` implementation with re-exports from `@/features/auth/middleware` (`requireAuth`, `checkJwt` alias, `optionalAuth`, `authSubject`).

### `server/src/features/catalog/controller.ts`

- **Removed** `createProduct` / `updateProduct` 501 stubs and TODO comments.
- **Added** real `createProduct` and `updateProduct` handlers calling `catalogService`.

### `server/src/features/catalog/router.ts`

- **Changed** `createCatalogRouter()` → `createCatalogRouter(siteConfig)`.
- **Added** `writeGuards(siteConfig)` on `POST /products` and `PUT /products/:slug`.

### `server/src/features/catalog/index.ts`

- **Changed** `createCatalogRouter()` → `createCatalogRouter(siteConfig)`.

### `server/src/features/content/controller.ts`

- **Updated** `writeNotReady` message (still 501 — write CRUD not implemented).
- **Removed** TODO about auth pack.

### `server/src/features/content/router.ts`

- **Changed** `createContentRouter()` → `createContentRouter(siteConfig)`.
- **Added** `writeGuards(siteConfig)` on all four write routes (`POST/PUT` pages and posts).

### `server/src/features/content/index.ts`

- **Changed** `createContentRouter()` → `createContentRouter(siteConfig)`.

### `server/src/types/site-config.defaults.ts` + `client/src/types/site-config.defaults.ts`

- **Changed** `features.auth: false` → `features.auth: true`.

### `client/src/components/Navbar.tsx`

- **Added** imports: `LoginButton`, `LogoutButton`, `useSession`.
- **Replaced** inline login/logout buttons with auth pack components when `features.auth`.
- **Added** `useSession` for avatar/name from `/api/auth/me`.

### `client/src/pages/Home.tsx`

- **Replaced** inline Auth0 login with `LoginButton` when `features.auth`.

## Not changed (intentional)

| Area | Why |
|------|-----|
| `features/intake` POST `/forms/:slug` | Public form submission — no `requireAuth`. |
| `features/payments` checkout/webhook | Public checkout intent + provider webhooks — no write-guard from 2.4–2.7. |
| `features/catalog` GET routes | Public read. |
| `features/content` GET routes | Public read. |

## `writeGuards` behavior

When `siteConfig.features.auth === true`, write routes run `requireAuth` before the controller. When `false`, writes are unauthenticated (dev only — all flags true in defaults today).
