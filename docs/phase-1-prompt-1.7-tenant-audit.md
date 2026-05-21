# Phase 1.7 — tenantId threading audit

**Date:** 2026-05-21  
**Commit message:** `phase-1: thread tenantId through all models (Type-C, defaulted 'default')`

## Mongoose schemas found

| Schema | Path | Action |
|--------|------|--------|
| *(none)* | — | Demo `User` / `Item` removed in 1.1 prep (before 1.2). No Mongoose schemas remain in the repo. |

Phase 2 feature packs will add schemas; each must use `tenantIdSchemaDefinition`, `applyTenantCompoundIndex`, and `scoped()` for queries.

## Infrastructure added

| File | Why |
|------|-----|
| `server/src/db/tenant-schema.ts` | Shared `tenantId` field + compound index helper |
| `server/src/db/scoped.ts` | `scoped(Model, req)` — tenant filter on all read/write helpers |
| `server/src/db/index.ts` | Barrel export |

Prompt 1.7 path `server/db/scoped.ts` maps to `server/src/db/scoped.ts` (TypeScript `rootDir` is `src/`).

## Controllers / services updated

| File | Why |
|------|-----|
| *(none)* | No routes query Mongoose after demo removal. Only `health` uses `mongoose.connection` (connection state, not a model). |

## Models that must NOT use `scoped()` (call out, do not hide)

| Model | Phase | Reason |
|-------|-------|--------|
| **Tenant** | 7 | Registry of tenants; `_id` is the tenant key. Admin/host-resolution reads span tenants by design. Document queries with explicit comments. |
| **WebhookEventLog** (planned) | 3 | Idempotency key may be global per provider+eventId; confirm tenant routing in webhook handler before choosing scoped vs explicit filter. |

No other exceptions identified in this repo today.

## Tests

No `test` script in root `package.json`. Verified: `npm run build` (server), `npm run doctor`.
