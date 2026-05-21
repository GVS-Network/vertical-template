# Changelog

All notable changes to the vertical-template project are documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

### Added

- `getSiteConfig(req)` seam, `attachSiteConfig` middleware, `Express.Request.siteConfig` augmentation; `/api/health` returns `site` from config.
- `PaymentProvider` interface (type-only) and `getPaymentProvider(siteConfig)` throwing stub until phase 3.
- `scripts/contract-check.ts` — twin type-file parity + `defaultSiteConfig` required-field validation; wired to `doctor`, `prebuild`, and `contract:check`.

### Docs

- Phase 1.1: open questions from Phase 0 resolved (`docs/phase-1-prompt-1.1-resolutions.md`).

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
