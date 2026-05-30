# Changelog

All notable changes to the vertical-template project are documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

### Added

- Doctor Phase 6.12 checks: client Auth0 env when auth on; admin-without-auth warning; intake notification env (`RESEND_API_KEY` when provider is resend; `contact.email` warning — P6-7).
- Admin submissions inbox (Phase 6.11): `/admin/submissions` with paginated list, filter tabs, and mark processed/unprocessed via intake API.
- Admin products UI (Phase 6.10): `/admin/products` list + create/edit form (name, slug, price, description in attributes, status); catalog write API.
- Admin events UI (Phase 6.9): `/admin/events` list + create/edit form with event fields; `tag=event` on save; timezone-aware datetime editors (P6-6).
- Admin pages UI (Phase 6.8): `/admin/pages` list + create/edit form; auth-gated `GET /api/admin/pages` reads; writes via content API.
- Public Markdown rendering (Phase 6.7): `client/src/shared/MarkdownBody.tsx` with `react-markdown`; wired in PageRenderer + PostDetail.
- `features.admin` pack (Phase 6.6): dual SiteConfig boolean, registry gate, lazy client `/admin/*`, doctor warning when admin without auth.
- Intake submissions inbox API (Phase 6.5): auth-gated `GET /api/intake/submissions` (paginated) and `PATCH` mark processed.
- Intake email notifications (Phase 6.4): `providers/notifications/` + Resend adapter, `getNotificationProvider()` seam, hook in `createSubmission`; closes P4-7.
- Post event metadata (Phase 6.3): optional `eventStart`, `eventEnd`, `eventLocation`, `links` on Post schema + zod writes; client `ContentPost` shape updated.
- Content write API: `POST/PUT` pages and posts with zod validation, `scoped(Model, req)` writes, and `test:content` smoke (Phase 6.2).

### Fixed

- `npm run dev`: Vite no longer starts until `GET /api/health` succeeds, avoiding a one-shot `ECONNREFUSED` on `/api/_meta/theme.css` when the client wins the startup race.

### Thesis

- Build phase plan amended (v1): insert **Phase 6 · Operator surface** (tenant `/admin`, content writes, intake email, Markdown); renumber first client → Phase 7 (`v0.8.0`), multi-tenant → Phase 8 (`v1.0.0`). See `docs/amendments/phase-plan-amendment-v1.md`.
- `template-architecture-brief.html` v0.1 → v0.2: tenant admin in core Phase 6; sixth pack `admin`; platform `/__admin` stays Phase 8.

### Docs

- Phase **6.1** resolutions confirmed: Resend, structured event fields, explicit `features.admin`, submissions inbox MVP, TG/Barry payment notes; open index P6-2–P6-7.
- Added `docs/amendments/`, `docs/prompts/phase-6-operator-surface.html`; renamed first-client and multi-tenant prompts to phase 7/8.
- Updated `phase-6-prompt-6.1-resolutions.md` (TG Square, Barry Stripe); added `customers/_template/onboarding/brief.md`.
- Added `docs/phase-6-open-questions.md`, `docs/phase-6-prompt-6.1-resolutions.md`, `docs/phase-6-handoff.md`; renumbered `phase-7-open-questions.md`.
- Updated `docs/README.html` to doc set v0.7.0 and phases 0–8 index.

## [0.6.0] — 2026-05-21

Phase 5 (Visual system) closed. Four-layer token resolution, WCAG contrast validation, CSS variable emission, and token-backed UI across feature packs and app shell.

### Phase 5 — closed (prompt log)

| Prompt | Outcome |
|--------|---------|
| **5.1** | Opinionated brand confirmed; `theme/verticals/*.brief.md`; resolutions doc |
| **5.2** | Full `ThemeTokens` leaf set; `DeepPartial` helper |
| **5.3** | `theme/foundation.tokens.ts`; contract-check covers all leaves |
| **5.4** | L2 `theme/verticals/*.tokens.ts` (one commit per vertical) |
| **5.5** | Tenant pick + override stubs; `theme/tenants/registry.ts` |
| **5.6** | `resolveTokens()` + leaf-only override validator + smoke tests |
| **5.7** | WCAG contrast validator; wired to doctor, contract-check, CI prebuild |
| **5.8** | `emitCssVars()`; `/api/_meta/theme.css`; production SPA injection |
| **5.9** | All five feature packs → `var(--…)` via `pack-*` classes |
| **5.10** | Docs + tag `v0.6.0`; Phase 6 open questions |

### Added

- **`theme/`** — foundation, vertical, tenant layers; `resolve.ts`, `emit-css-vars.ts`, `validate-contrast.ts`, `validate-leaf-override.ts`.
- **`ThemeTokens`** — 38 primitive leaves (color, type, size, space, radius, shadow, motion); byte-identical client/server types.
- **`resolveTokens(siteConfig, tenantId)`** — L1→L4 deep merge; L4 leaf-only guardrail.
- **`GET /api/_meta/theme.css`** — per-request resolved `:root` CSS variables.
- **`npm run test:resolve-tokens`** — resolver, contrast matrix, emit smoke tests.
- **Token-backed UI** — `pack-*` component classes; shell (`Navbar`, `Layout`, `Home`, `Loading`).

### Fixed

- Dev theme injection: runtime `/api/_meta/theme.css` link (startup-only Vite fetch was silently skipped).
- Shell components converted from Tailwind `primary-*` to CSS variables so vertical accent/type are visible.

### Changed

- `contract-check` validates `ThemeTokens` foundation + WCAG contrast matrix (vertical × demo-tenant).
- `prebuild` runs `contract:check` and `test:resolve-tokens`.
- Root, client, server `package.json` → **0.6.0**.

### Docs

- `docs/phase-5-prompt-5.1-resolutions.md`, `docs/phase-5-close-verification.md`
- Phase plan 0–8; `docs/phase-6-open-questions.md` for operator surface; `docs/phase-7-open-questions.md` for first client (P7-1 pick-list)
- `docs/contexts/repo-context.html` §05, `glossary.html` (visual-system terms)
- Build docs family **v0.6.0** in `docs/README.html`

## [0.5.0] — 2026-05-21

Phase 4 (Vertical presets) closed. Four opinionated vertical presets, `init-vertical` provisioning, `BOUND_TENANT_ID` local binding, tenant-aware doctor, and per-preset verification smokes.

### Phase 4 — closed (prompt log)

| Prompt | Outcome |
|--------|---------|
| **4.1** | Build order locked: `screen-printer` → `bar-restaurant` → `food-truck` → `farm-source`; provider defaults in `verticals/README.md` |
| **4.2** | `verticals/_preset-pattern.md`, `registry.ts`, `mergePreset`, stub folders, `test:vertical-registry` |
| **4.3** | `npm run init:vertical` + `_tenants` registry; idempotent `--force` re-seed |
| **4.4** | First full preset: `screen-printer` (Stripe, 8 products, portfolio page, project-quote form); `BOUND_TENANT_ID` seam |
| **4.5** | Presets #2–#4: `bar-restaurant`, `food-truck`, `farm-source` (one commit each); `verify-vertical-preset.ts` |
| **4.6** | `doctor` — bound-tenant `_tenants`, preset, and per-pack seed checks |
| **4.7** | Docs + tag `v0.5.0`; `docs/phase-5-open-questions.md` |

### Build order & presets shipped

```text
screen-printer → bar-restaurant → food-truck → farm-source
```

| Preset | Provider | Packs on | Demo tenant | Vertical-specific page |
|--------|----------|----------|-------------|------------------------|
| `screen-printer` | Stripe | all five | `demo-screen-printer` | `portfolio` |
| `bar-restaurant` | Square | catalog, content, intake, payments | `demo-bar-restaurant` | `events` |
| `food-truck` | Square | catalog, content, intake, payments | `demo-food-truck` | `locations` |
| `farm-source` | Square | all five | `demo-farm-source` | `csa` |

### Added

- **`verticals/<key>/`** — `site-config.preset.ts`, `product-attributes.schema.ts` (Zod), `brand-stub.ts`, `seed/*.json`, `README.md` per preset.
- **`npm run init:vertical`** — `--preset` / `--tenant` / `--force`; stamps `tenantId` on Product, Page, FormDefinition; writes `_tenants` row.
- **`BOUND_TENANT_ID`** — `server/src/seams/bound-site-config.ts`; `getSiteConfig` returns bound preset merge for local demo.
- **`scripts/verify-vertical-preset.ts`** — DB + HTTP walk per preset (`test:*-preset` npm scripts).
- **Doctor (4.6)** — when `BOUND_TENANT_ID` set: registry row, registered preset, seeded catalog/content/intake; payment/auth checks use bound features.
- **Content routes** — `/home`, `/portfolio`, `/events`, `/locations`, `/csa` for preset page slugs.

### Changed

- Dev pack seeds skip non-`default` tenants (`skipDevSeedsForTenant`).
- Root, client, server `package.json` → **0.5.0**.

### Docs

- `docs/phase-4-prompt-4.1-resolutions.md`, `docs/phase-4-open-questions.md` (closed)
- `docs/phase-5-open-questions.md` — Phase 5 kickoff (visual system lead: brand test-case preset)
- `docs/contexts/repo-context.html` §05, `glossary.html`, `session-starter.html`, `stack-context.html`
- Build docs family **v0.5.0** in `docs/README.html`

## [0.4.0] — 2026-05-21

Phase 3 (Payments) closed. Stripe and Square adapters behind `getPaymentProvider`, checkout Sessions / Square Payment Links, signature-verified webhooks with `WebhookEventLog` idempotency, Square inventory push, doctor provider checks.

### Phase 3 — closed (prompt log)

| Prompt | Outcome |
|--------|---------|
| **3.1** | Open questions in `server/src/features/payments/README.md` — one provider per site, Square inventory push |
| **3.2** | `PaymentProvider` + `WebhookEvent` contract (`server/src/types/payment-provider.ts`) |
| **3.3** | `server/src/providers/stripe.ts` — Checkout Sessions, webhooks, `test:stripe-happy-path` |
| **3.4** | `server/src/providers/square.ts` — Orders + Payment Links, HMAC webhooks, `syncInventory`, Square smokes |
| **3.5** | `WebhookEventLog` model + idempotent webhook pipeline, `test:webhook-idempotency` |
| **3.6** | `scripts/doctor.ts` — provider env + live API credential checks |
| **3.7** | Docs + tag `v0.4.0`; `docs/phase-4-open-questions.md` |

### Added

- **Stripe provider** — `createCheckout` (Checkout Sessions), `verifyWebhook` / `parseWebhookEvent`, `syncInventory` → `NotSupported`.
- **Square provider** — `createCheckout` (Order + Payment Link), HMAC webhooks, `syncInventory` push to Catalog Inventory API.
- **`WebhookEventLog`** Mongoose model — `tenantId`, `provider`, `eventId`, `eventType`, `processedAt`, optional `payloadHash`; compound **unique** index on `(tenantId, provider, eventId)`.
- **Webhook pipeline** — `POST /api/payments/webhook/:provider`: verify signature → dedupe by `eventId` → apply `order.paid` / `order.failed` / `order.refunded`.
- **Dependencies (server):** `stripe` ^17.7.0 (resolved **17.7.0**), `square` ^43.2.1 (resolved **43.2.1**).
- **Smokes:** `test:stripe-happy-path`, `test:square-happy-path`, `test:square-sync-inventory`, `test:webhook-idempotency`.
- **Doctor:** payment provider env validation + Stripe balance / Square locations API ping when `features.payments` is on.

### Changed

- `getPaymentProvider(siteConfig)` returns Stripe or Square adapter (no longer throws for configured providers).
- `POST /api/payments/checkout/intent` → `{ url, orderId, providerRef }`; attaches `paymentRef` on order.
- Raw body parser on `/api/payments/webhook/*` for signature verification.
- `PAYMENT_PROVIDER` in `server/.env` overrides `defaultSiteConfig.payment.provider` for local dev.
- Root, client, server `package.json` → **0.4.0**.

### Schema / migration — `WebhookEventLog`

- **Additive only.** New MongoDB collection `webhookeventlogs` (Mongoose default pluralization); no changes to `Order` or existing collections.
- **No data migration** required for upgrades from v0.3.0 — collection and unique index are created on first deploy / first `WebhookEventLog` insert.
- **Operational note:** Point webhooks at the new handler **before** relying on idempotency in production; events delivered only to the pre-3.5 stub could have updated orders without a log row (acceptable for dev; re-send or reconcile in prod if cutover mid-flight).
- **Race-safe dedupe:** duplicate concurrent deliveries may hit unique-index `11000`; handler treats that as idempotent **200**.

### Docs

- `docs/phase-3-handoff.md`, `docs/phase-3-close-verification.md`
- `docs/phase-4-open-questions.md` — vertical presets, provider defaults, go-to-market order
- `docs/contexts/repo-context.html` §05, `glossary.html`, `stack-context.html`, `session-starter.html`
- Build docs family **v0.4.0** in `docs/README.html`

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
