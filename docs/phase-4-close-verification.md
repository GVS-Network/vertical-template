# Phase 4 close verification

**Tag:** `v0.5.0` · **Date:** 2026-05-21

## Fresh-clone checklist

From a clean tree with `server/.env` and `client/.env` copied from examples (MongoDB URI required for doctor bound-tenant checks):

```bash
npm run install:all
npm run doctor
npm run contract:check
npm run build
npm run test:vertical-registry
```

Optional (requires seeded demo tenants in MongoDB):

```bash
npm run test:screen-printer-preset
# BOUND_TENANT_ID=demo-screen-printer in server/.env for bound doctor line
```

## Phase 4 acceptance

| Criterion | Status |
|-----------|--------|
| Four preset folders conform to `_preset-pattern.md` | ✓ |
| `init-vertical` idempotent per preset | ✓ |
| `BOUND_TENANT_ID` shows preset seed data (API) | ✓ |
| `scoped()` — no cross-tenant leakage | ✓ (phase 1 investment) |
| Provider defaults via `getPaymentProvider` | ✓ |
| Tagged `v0.5.0` | ✓ |

## Presets shipped (build order)

1. `screen-printer` — Stripe
2. `bar-restaurant` — Square
3. `food-truck` — Square
4. `farm-source` — Square, five packs
