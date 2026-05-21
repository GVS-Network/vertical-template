# Phase 2.9 — Pack-pattern compliance audit

**Date:** 2026-05-21  
**Reference:** `server/src/features/_pack-pattern.md`  
**Smoke:** `npm run test:pack-compliance` (sets `SKIP_PACK_SEEDS=1`; sibling mount checks use auth `401`/`400` or payments webhook `200` — no MongoDB)

## Summary

| Pack | Exports | tenantId | scoped() | Toggle off → 404 | Cross-pack imports | Client |
|------|---------|----------|----------|-------------------|-------------------|--------|
| catalog | ✅ | ✅ | ✅ | ✅ verified | ✅ fixed | ✅ |
| content | ✅ | ✅ | ✅ | ✅ verified | ✅ fixed | ✅ |
| intake | ✅ | ✅ | ✅ | ✅ verified | ✅ | ✅ |
| payments | ✅ | ✅ | ✅ | ✅ verified | ✅ (seam only) | ✅ |
| auth | ✅ | N/A | N/A | ✅ verified | ✅ | ✅ (no routes) |

**Fixes in this commit:** moved `writeGuards` to `server/src/shared/write-guards.ts`; added `client/src/features/registry.tsx`; added `pack-compliance.smoke.ts`.

---

## Per-pack detail

### catalog

| Check | Result |
|-------|--------|
| `packKey` + `register(app, siteConfig)` | ✅ `index.ts` |
| Folder shape | ✅ schemas, service, controller, router, seed |
| tenantId + compound index | ✅ `(tenantId, slug)` on Product |
| Queries | ✅ `scopedForTenant` in service/seed (tenantId from controller) |
| Toggle off | ✅ `GET /api/catalog/products` → 404 |
| Cross-pack | ✅ was `../auth/write-guards` → **fixed** to `@/shared/write-guards` |
| Client | ✅ `CatalogRoutes` via `FeatureRoutes` registry |

### content

| Check | Result |
|-------|--------|
| Exports / shape | ✅ + `README.md` body-format decision |
| tenantId | ✅ Page, Post |
| Queries | ✅ `scopedForTenant` throughout |
| Toggle off | ✅ `GET /api/content/posts` → 404 |
| Cross-pack | ✅ **fixed** shared write-guards |
| Client | ✅ `/about`, `/blog`, `/blog/:slug` via registry |

### intake

| Check | Result |
|-------|--------|
| Exports / shape | ✅ |
| tenantId | ✅ FormDefinition, Submission |
| Queries | ✅ `scopedForTenant` |
| Toggle off | ✅ `GET /api/intake/forms/contact` → 404 |
| Cross-pack | ✅ none |
| Client | ✅ `/forms/:slug` via registry |

### payments

| Check | Result |
|-------|--------|
| Exports / shape | ✅ `providers/` placeholder only |
| tenantId | ✅ Order |
| Queries | ✅ `scopedForTenant` in service |
| Toggle off | ✅ `POST /api/payments/checkout/intent` → 404 |
| Cross-pack | ✅ only `getPaymentProvider(siteConfig)` seam — allowed |
| Client | ✅ `CheckoutButton` on Home (feature-flagged); no pack routes |

### auth

| Check | Result |
|-------|--------|
| `packKey` + `register` | ✅ |
| `service.ts` / `schemas/` | ⚪ **Exempt** — JWT middleware pack, no Mongoose layer |
| tenantId / scoped | N/A |
| Toggle off | ✅ `GET /api/auth/me` → 404 |
| Cross-pack | ✅ none from other packs into auth |
| Client | ⚪ No `routes.tsx` — **Exempt**; `LoginButton`/`LogoutButton`/`useSession` exported from `index.ts` (shell components) |

---

## Documented exceptions (pattern evolution candidates)

1. **auth** — No `service.ts` or `schemas/`; middleware + single route is intentional.
2. **auth (client)** — No route file; auth UI mounts in `Navbar` / `Home` via components.
3. **payments (client)** — Demo `CheckoutButton` on `Home` instead of pack routes (acceptable for scaffold).
4. **shared/write-guards** — Uses auth middleware but lives in `shared/` so catalog/content stay pack-isolated.

---

## Toggle verification

`pack-compliance.smoke.ts` asserts:

- All features `false` → every probe path returns **404**.
- Each pack individually `false` (others `true`) → that pack's probe **404**, sibling catalog/content probe **not 404**.

Probe paths: see `PROBES` in `server/src/features/pack-compliance.smoke.ts`.
