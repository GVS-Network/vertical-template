# Phase 5 close verification

**Tag:** `v0.6.0` · **Date:** 2026-05-21

## Fresh-clone checklist

From a clean tree with `server/.env` and `client/.env` copied from examples (MongoDB URI required for full `doctor` bound-tenant checks):

```bash
npm run install:all
npm run contract:check
npm run test:resolve-tokens
npm run build
npm run test:vertical-registry
```

With MongoDB + `BOUND_TENANT_ID` set (optional):

```bash
npm run doctor
npm run test:bar-restaurant-preset
```

Dev walk (API must run for theme CSS):

```bash
npm run dev
# confirm GET /api/_meta/theme.css returns vertical-specific --color-accent
# confirm http://localhost:5173 loads theme link in <head>
```

## Phase 5 acceptance

| Criterion | Status |
|-----------|--------|
| `ThemeTokens` full leaf set + dual-file contract | ✓ |
| `foundation.tokens.ts` + contract-check coverage | ✓ |
| Four `theme/verticals/*.tokens.ts` (L2) | ✓ |
| Tenant pick + override stubs + `tenants/registry.ts` | ✓ |
| `resolveTokens()` + leaf-only validator + smoke tests | ✓ |
| WCAG contrast validator in contract-check + doctor | ✓ |
| `emitCssVars()` + dev `/api/_meta/theme.css` + prod HTML injection | ✓ |
| Feature pack components use `var(--…)` | ✓ |
| App shell (Navbar, Layout, Home) token-backed | ✓ |
| Tagged `v0.6.0` | ✓ |

## Visual system shipped

Four-layer resolution: **foundation → vertical → tenant pick → tenant override**

| Layer | Location |
|-------|----------|
| L1 Foundation | `theme/foundation.tokens.ts` |
| L2 Vertical | `theme/verticals/<key>.tokens.ts` |
| L3 Pick | `theme/tenants/<tenant>.pick.ts` |
| L4 Override | `theme/tenants/<tenant>.override.ts` |

Resolver: `theme/resolve.ts` · Emission: `theme/emit-css-vars.ts` · Contrast: `theme/validate-contrast.ts`
