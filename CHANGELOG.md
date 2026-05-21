# Changelog

All notable changes to the vertical-template project are documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

### Added

- Phase 3.5: `WebhookEventLog` model (`tenantId`, `provider`, `eventId`, `eventType`, `processedAt`, optional `payloadHash`); unique index on `(tenantId, provider, eventId)`; webhook handler idempotency + signature verification; `npm run test:webhook-idempotency`.
- Phase 3.4: Square provider (`server/src/providers/square.ts`) — Orders + Payment Links checkout, HMAC webhook verify/parse, `syncInventory` push to Square Catalog Inventory; `square` dependency; `npm run test:square-happy-path` and `test:square-sync-inventory`.
- Phase 3.3: Stripe provider (`server/src/providers/stripe.ts`), checkout Sessions, webhook verify/parse, `npm run test:stripe-happy-path`; `stripe` dependency.

### Changed

- Phase 3.3: `POST /api/payments/checkout/intent` returns `{ url, orderId, providerRef }`; webhook route applies `order.paid` → `markOrderPaid`; raw body on `/api/payments/webhook/*`.
- Phase 3.2: `PaymentProvider` + `WebhookEvent` contract (`server/src/types/payment-provider.ts`).

### Docs

- Phase 3.1: resolved open questions in `server/src/features/payments/README.md` (one provider per site, Square inventory push, adapter paths, webhooks).

## [0.3.0] — 2026-05-21

Phase 2 (Feature packs) closed. Five toggle-mounted packs on server and client, registry gate at boot, pack-pattern source of truth, compliance smokes. Payment checkout returns 501 until Phase 3 adapters.

### Phase 2 — closed (prompt log)

| Prompt | Outcome |
|--------|---------|
| **2.1** | Open questions resolved — `docs/phase-2-prompt-2.1-resolutions.md` (registry gate **b**, `scopedForTenant`, auth uniqueness, client never sends `tenantId`) |
| **2.2** | `server/src/features/_pack-pattern.md` — pack layout, exports, tenant rules |
| **2.3** | `registry.ts` + `createApp()`; stub entrypoints; `npm run test:registry` |
| **2.4** | **catalog** — Product schema, REST list/detail, dev seed, client ProductList/Detail |
| **2.5** | **content** — Page + Post (Markdown `body`), read API, client blog/about routes |
| **2.6** | **intake** — FormDefinition + Submission, GET/POST forms, `GenericFormRenderer`; email deferred |
| **2.7** | **payments** — Order schema, checkout intent (501 via seam), webhook stub; `CheckoutButton` on Home |
| **2.8** | **auth** — `requireAuth`, `GET /api/auth/me`, Login/Logout/`useSession`; `writeGuards` on catalog/content writes |
| **2.9** | Pack compliance audit — `docs/phase-2-pack-compliance-audit.md`; `shared/write-guards`; `test:pack-compliance` |
| **2.10** | Docs + tag `v0.3.0`; `docs/phase-3-open-questions.md` |

### Added — feature packs

| Pack | Server | Client |
|------|--------|--------|
| **catalog** | `Product` schema, `/api/catalog/products`, dev seed | `/catalog`, `/catalog/:slug`, `useProducts` |
| **content** | `Page` + `Post`, `/api/content/*`, Markdown body (see pack `README.md`) | `/about`, `/blog`, `/blog/:slug` |
| **intake** | `FormDefinition` + `Submission`, `/api/intake/forms/:slug` | `/forms/:slug`, `GenericFormRenderer` |
| **payments** | `Order`, `POST /checkout/intent` (501), `POST /webhook/:provider` stub | `CheckoutButton` on Home (no pack routes yet) |
| **auth** | `requireAuth` middleware, `GET /api/auth/me` | `LoginButton`, `LogoutButton`, `useSession` (shell; no `routes.tsx`) |

- `server/src/features/registry.ts` — dynamic `import()` + `register()` only when `features.<pack> === true`; `[feature:off]` log when false.
- `client/src/features/registry.tsx` — `FeatureRoutes()` mirrors server flags.
- `scopedForTenant(Model, tenantId)` for seeds, services, and non-request contexts.
- `server/src/shared/write-guards.ts` — JWT on catalog/content write routes when `features.auth` is on (no cross-pack imports).
- `server/src/shared/dev-seeds.ts` — `SKIP_PACK_SEEDS` for registry/compliance smokes without MongoDB.
- `npm run test:registry`, `npm run test:pack-compliance`.

### Pack-pattern revisions (vs draft in 2.2)

- Toggle gate is **registry option (b)** only — no per-pack `register` no-op, no static import-all.
- `SiteConfig.features.*` are **booleans** (not `.enabled` suffixes).
- **auth** pack: JWT middleware only — no `schemas/` or `service.ts` (documented exemption).
- **auth (client)**: components/hooks exported from `index.ts`; no `routes.tsx` (shell mounts in `Navbar` / Home).
- Cross-pack writes use **`shared/write-guards.ts`**, not `import` from `features/auth/`.
- HTTP handlers may pass `tenantId` into services using `scopedForTenant` (equivalent discipline to `scoped(Model, req)`).

### Changed

- Root, client, server `package.json` → `0.3.0`.
- `server/src/middleware/auth.ts` — thin re-export of `features/auth/middleware` (legacy path).
- All five `features.*` default **true** in twin `defaultSiteConfig` files.

### Docs

- `docs/phase-2-handoff.md`, `docs/phase-3-open-questions.md`, `docs/phase-2-pack-compliance-audit.md`.
- `docs/contexts/repo-context.html` §05 — `features/*` file map; `glossary.html` — concrete feature-pack shape.
- `docs/contexts/stack-context.html`, `session-starter.html` — Phase 2 complete @ v0.3.0.
- Build docs family → **v0.3.0** (`docs/README.html`).

## [0.2.0] — 2026-05-21

Phase 1 (SiteConfig & seams) closed. One TypeScript shape, two seams, defaulted tenant infrastructure. No feature packs yet.

### Phase 1 — closed (prompt log)

| Prompt | Outcome |
|--------|---------|
| **1.1** | Open questions resolved (`docs/phase-1-prompt-1.1-resolutions.md`) |
| **1.2** | `SiteConfig` / `ThemeTokens` types; demo User/Item/routes removed |
| **1.3** | `defaultSiteConfig` (client + server) |
| **1.4** | `contract:check` script |
| **1.5** | `getSiteConfig(req)`, `attachSiteConfig`, health reads `site` |
| **1.6** | `getPaymentProvider` stub + `PaymentProvider` interface |
| **1.7** | `scoped()`, `tenantIdSchemaDefinition`; audit doc (zero live schemas) |
| **1.8** | Docs + tag `v0.2.0` |

### Added

- Twin `SiteConfig` types + `defaultSiteConfig`; `scripts/contract-check.ts` on doctor/prebuild.
- `server/src/seams/get-site-config.ts`, `get-payment-provider.ts`; `middleware/site-config.ts`.
- `server/src/db/scoped.ts`, `tenant-schema.ts` — tenant query discipline for phase 2 models.
- `PaymentProvider` type-only interface; throwing `getPaymentProvider(siteConfig)` until phase 3.

### Changed

- Root, client, server `package.json` → `0.2.0`.
- Demo CRUD and dashboard removed; minimal shell + `/api/health` only.

### Docs

- Glossary, repo-context §05 file map, stack-context status, session-starter standing rules; `70-multi-tenant-seams.mdc` aligned with `scoped()` + payment seam paths.
- `docs/phase-1-handoff.md`, `docs/phase-2-open-questions.md`.

## [0.1.0] — 2026-05-21

Phase 0 (Bootstrap) closed. Template is a owned fork of baseapp with docs, cursor rules, doctor script, and a verified dev loop. No SiteConfig, feature packs, or Type A/B/C taxonomy work yet.

### Phase 0 — closed (prompt log)

| Prompt | Outcome |
|--------|---------|
| **0.1** Inventory | `docs/inventory.md` — stack audit vs `stack-context.html` |
| **0.2** Stack-context | `stack-context.html` v0.1.1; env names, installed vs planned deps, phase-0 removal callouts |
| **0.3** Cursor rules | Verified `/.cursorrules` + 10 `.mdc` files; decisions locked (Tailwind→P5, `.nvmrc`→0.5, demo items→drop at P1) |
| **0.4** Build docs | `docs/` family verified; §02 links OK; `doc-system.css` on briefs |
| **0.5** Version cut | `vertical-template` @ 0.1.0, `.nvmrc`, removed `express-jwt` |
| **0.6** Doctor | `scripts/doctor.ts`, `npm run doctor` |
| **0.7** Dev loop | install:all, doctor, dev (5173/3001), `/api/health` green |
| **0.8** Close | This entry; tag `v0.1.0` |

### Added

- Forked [baseapp](https://github.com/misterlinderman/baseapp) into [GVS-Network/vertical-template](https://github.com/GVS-Network/vertical-template).
- Installed `docs/` family (README, three briefs, contexts, rules, phase prompts, `assets/doc-system.css`).
- Installed cursor rules (`.cursorrules` and `.cursor/rules/*.mdc`).
- `docs/inventory.md`, phase-0 verification notes (`phase-0-*-verification.md`).
- `scripts/doctor.ts` and `npm run doctor` — Node, env key parity, Mongo connectivity (3s timeout).
- `.nvmrc` — Node 20.

### Changed

- `docs/contexts/stack-context.html` reconciled against fork (v0.1.1); Phase 0 decisions in §07.
- Root, client, and server `package.json` identity → `vertical-template` @ `0.1.0`.
- Node engine requirement → `>=20.0.0`.
- Archived upstream baseapp markdown under `docs/baseapp-upstream/`.
- `docs/README.html` §03 — doctor callout.

### Removed

- Unused `express-jwt` server dependency (auth uses `express-oauth2-jwt-bearer` only).

### Docs

- Docs set version: **v0.1.0** (see `docs/README.html` header).
