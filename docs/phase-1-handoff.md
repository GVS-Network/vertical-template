# Phase 1 handoff — SiteConfig & seams (v0.2.0)

**Closed:** 2026-05-21 · tag `v0.2.0`

## What's true now

- Twin `SiteConfig` + `ThemeTokens` types (`client/src/types/`, `server/src/types/`), `defaultSiteConfig`, `npm run contract:check` (doctor + prebuild).
- `getSiteConfig(req)` → singleton `defaultSiteConfig` today; `attachSiteConfig` sets `req.siteConfig` on every request.
- `getPaymentProvider(siteConfig)` throwing stub; `PaymentProvider` interface type-only in `server/src/types/payment-provider.ts`.
- `tenantId` helpers: `tenantIdSchemaDefinition`, `applyTenantCompoundIndex`, `scoped(Model, req)` in `server/src/db/`. No Mongoose schemas yet (demo removed in 1.1).
- `/api/health` returns `site` from `req.siteConfig.branding.name`.
- Demo User/Item routes and client dashboard removed.

## Prompt log

| Prompt | Outcome |
|--------|---------|
| **1.1** | Open questions resolved — `docs/phase-1-prompt-1.1-resolutions.md` |
| **1.2** | `SiteConfig` + `ThemeTokens` types; demo removal prep |
| **1.3** | `defaultSiteConfig` both sides |
| **1.4** | `scripts/contract-check.ts` |
| **1.5** | `getSiteConfig` seam + middleware |
| **1.6** | `getPaymentProvider` stub + interface |
| **1.7** | `scoped()` + tenant schema helpers — `docs/phase-1-prompt-1.7-tenant-audit.md` |
| **1.8** | Docs + `v0.2.0` tag |

## Phase 2 entry

Read `docs/prompts/phase-2-feature-packs.html`. Open questions: `docs/phase-2-open-questions.md`.
