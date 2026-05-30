# food-truck

Mobile food truck: menu catalog with daily availability, location-of-the-day content, catering intake, Square staff-only payments.

## Who it's for

Food trucks and pop-ups that need a simple web menu and a clear “where are you today?” page without building a full ordering app.

## Assumptions

| Setting | Value |
|---------|--------|
| `payment.provider` | `square` |
| Feature packs | catalog, content, intake, payments — **auth off** in preset seed |
| Self-service tenants | Enable `features.auth` + `features.admin` in tenant site config (Type C) — see below |
| Catalog mode | Menu — `dailyAvailable` and `locationToday` on attributes |
| Checkout | Window + Square POS; catering invoiced separately |

## Self-service tenants (auth + admin)

The preset seeds **auth off** so `demo-food-truck` walks work without Auth0. Tenants who edit their own menu, events, and pages need operator login:

1. In the tenant **Type C** `site.config.ts`, set:
   ```ts
   features: {
     ...existing,
     auth: true,
     admin: true,
   }
   ```
2. Configure Auth0 in `server/.env` (`AUTH0_ISSUER_BASE_URL`, `AUTH0_AUDIENCE`) and `client/.env` (`VITE_AUTH0_DOMAIN`, `VITE_AUTH0_CLIENT_ID`, `VITE_AUTH0_AUDIENCE`).
3. Run `npm run doctor` — verifies auth env when the bound tenant has auth on; warns on admin without auth.
4. Sign in on the public site, then open `/admin` (pages, events, products, submissions inbox).

**Intake email (optional):** set `contact.email` in site config, then `NOTIFICATION_PROVIDER=resend` and `RESEND_API_KEY` in `server/.env`. See `server/.env.example`. Submissions save without email when notifications are off.

Terrible Gerald's (Phase 7 first client) follows this pattern with auth on; payment provider per site config.

## Day one after `init-vertical`

```bash
npm run init:vertical -- --preset=food-truck --tenant=demo-food-truck --force
```

Set in `server/.env`:

```
BOUND_TENANT_ID=demo-food-truck
PAYMENT_PROVIDER=square
```

Restart `npm run dev`, then walk:

| Pack | URL | Expect |
|------|-----|--------|
| Catalog | `/catalog` | 8 items; truck vs catering-only flagged |
| Content | `/home`, `/about`, `/locations` | Sidewalk Tacos copy + weekly stops |
| Intake | `/forms/catering` | Catering form with service style |
| Payments | `/` + checkout button | Square when configured |
| Auth | — | Pack off in preset; enable with admin for self-service (see above) |

## Seed inventory

- **8 products** — tacos, sides, drinks, catering pack
- **3 pages** — `home`, `about`, `locations`
- **1 form** — `catering`

## Product attributes (Zod)

`dailyAvailable`, `locationToday` — see `product-attributes.schema.ts`.

## Event posts (Phase 6.3)

Posts support optional structured event metadata: `eventStart`, `eventEnd`, `eventLocation`, `links.map`, `links.facebook`. Tag posts with `event` for public listing via `GET /api/content/posts?tag=event`.

This preset has **no post seeds** today — only pages (`home`, `about`, `locations`). No breaking change for `demo-food-truck`; add event posts in admin (Phase 6.9) or a future `seed/posts.json` when needed.
