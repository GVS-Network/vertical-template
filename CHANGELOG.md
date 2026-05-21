# Changelog

All notable changes to the vertical-template project are documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

### Added

- `features/catalog` — Product schema, REST list/detail, dev seed, client ProductList/Detail + `useProducts`; `features.catalog` enabled in defaults.
- `server/src/features/registry.ts` + `createApp()` — registry gate (b); stub pack entrypoints; `npm run test:registry` smoke (all features off → 404).
- `scopedForTenant(Model, tenantId)` for non-request queries.
- `server/src/features/_pack-pattern.md` — feature pack source of truth (registry gate, exports, tenant rules).

### Docs

- Phase 2.1: open questions resolved (`docs/phase-2-prompt-2.1-resolutions.md`) — registry toggle gate (b), `scopedForTenant`, auth/user uniqueness, client tenantId server-only.

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
