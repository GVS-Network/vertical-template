# Demo public shell — operator notes

**Status:** Pre–Phase 7 · complements [`phase-6-close-verification.md`](phase-6-close-verification.md)  
**Audience:** Operator testing vertical presets before first client (Type C) frontend

---

## What the demo shell is

The shared client shell (`Layout`, `Navbar`, `pages/Home.tsx`) is a **pack-exercise scaffold**. It proves feature toggles, Auth0, `/admin`, and API wiring. It is **not** the customer-facing site. Phase 7 replaces it per client with `Custom*.tsx` components.

---

## Navigation vs CMS pages

| Source | Behavior |
|--------|----------|
| **Admin → Pages** | Full CMS page list for the tenant (e.g. `home`, `about`, `csa`) |
| **Public navbar** | Hardcoded in `client/src/components/Navbar.tsx` — Home, Catalog, About, Blog, primary intake form |

Routes exist for many slugs (`/csa`, `/locations`, `/events`, …) via `contentRouteElements()`, but the navbar does not link to all of them. A page can be **published and reachable by URL** without appearing in the nav.

---

## Home route split

| URL | Renders |
|-----|---------|
| `/` | `pages/Home.tsx` — branding tagline + demo actions (payments/login) |
| `/home` | CMS page slug `home` via `PageRenderer` — seeded markdown + hero |

Editing the "home" page in `/admin` updates `/home`, not `/`. Phase 7 `CustomHome` typically wires `/` to CMS content.

---

## Events

| Layer | Status |
|-------|--------|
| **Admin** | `/admin/events` — CRUD on posts tagged `event` with structured fields |
| **API** | `GET /api/content/posts?tag=event` — published events only (public) |
| **Public UI** | **Not shipped** in demo shell. Route `/events` renders a CMS **page** slug `events`, not a dynamic event feed |

Bar-restaurant seed includes a static `events` page (private events marketing copy). Food-truck / farm-source may have no `events` page — `/events` can 404.

**Phase 7:** `CustomEvents.tsx` (Type C) using `usePosts('event')`, or generalize a core `EventList` if multiple verticals need the same component.

---

## Media uploads (post–v0.7.0)

Hero image/video upload in `/admin/pages` requires `CLOUDINARY_URL` in `server/.env`. See [`phase-7-media-upload-resolutions.md`](phase-7-media-upload-resolutions.md).

---

## Auth / admin access

- Auth0 SPA uses `cacheLocation="localstorage"` so `/admin` survives refresh.
- Unauthenticated `/admin` visits redirect to Auth0 login with return path.
- API bearer token is attached only after Auth0 session restore completes (avoids `/api/auth/me` 400 races).

Details in `CHANGELOG.md` [Unreleased] and `client/src/features/auth/components/Auth0ProviderWithNavigate.tsx`.
