# Feature pack pattern

**Source of truth for Phase 2+.** Locked in `docs/phase-2-prompt-2.1-resolutions.md` (toggle gate **registry option b**).

Paths below use `server/src/features/` and `client/src/features/` (TypeScript `rootDir` is `src/`).

---

## Canonical packs

| Pack key | `SiteConfig.features` flag | Typical API prefix |
|----------|---------------------------|-------------------|
| `catalog` | `features.catalog` | `/api/catalog` |
| `content` | `features.content` | `/api/content` |
| `intake` | `features.intake` | `/api/intake` |
| `payments` | `features.payments` | `/api/payments` |
| `auth` | `features.auth` | `/api/auth` |
| `admin` | `features.admin` + `features.auth` | `/api/admin` (tenant CMS; Phase 6) |

**Naming:** camelCase pack ids only (`catalog`, not `feature-catalog` or `feature_catalog`). Config keys match: `features.catalog`, `features.content`, `features.intake`, `features.payments`, `features.auth`. No kebab-case pack identifiers.

Flags are **booleans** on `SiteConfig.features` (not `.enabled` suffixes).

---

## Server folder shape

Each pack: `server/src/features/<pack>/`

```
features/<pack>/
  index.ts          # pack entry — exports register()
  schemas/          # Mongoose models (tenantId on every schema)
  service.ts        # business logic — no req/res
  controller.ts     # thin Express handlers → service
  router.ts         # Express Router factory
  validators/       # optional — zod schemas at route boundary (may colocate as schemas/*.ts)
```

Phase 2 prompts may add pack-specific files; do not rename the core five without updating this doc.

### Layer rules

| File | Responsibility |
|------|----------------|
| `schemas/` | Mongoose `Schema` + model export. Spread `tenantIdSchemaDefinition`; call `applyTenantCompoundIndex(schema, '<lookup>')`. |
| `service.ts` | Pure functions. Accept `tenantId` or scoped collections — **no** `req`/`res`. |
| `controller.ts` | Parse/validate input (zod), call service, map errors to HTTP. |
| `router.ts` | Wire paths to controller methods. **Assumes pack is already enabled** (see registry). |
| `index.ts` | Export `register` (required). |

---

## Client folder shape

Each pack: `client/src/features/<pack>/`

```
features/<pack>/
  index.ts          # exports routes (and public components)
  components/       # pack-owned UI — namespaced, no global leakage
  hooks/            # data hooks → pack API
  routes.tsx        # route elements merged by client registry when flag is on
  pages/            # optional — top-level page components (alias of components/ for large packs)
```

Client must not send `tenantId` on API calls (server resolves tenant). Display-only `tenantId` may arrive from future `/api/_meta/config` in phase 7.

---

## Required exports

### Server — `index.ts`

Every pack exports:

```ts
import type { Express } from 'express';
import type { SiteConfig } from '@/types/site-config';

export const packKey = 'catalog' as const; // one of: catalog | content | intake | payments | auth

export function register(app: Express, siteConfig: SiteConfig): void {
  // mount router and/or middleware — only called when features.<pack> === true
}
```

| Pack | `register` behavior |
|------|---------------------|
| `catalog`, `content`, `intake`, `payments` | `app.use('/api/<pack>', createRouter(siteConfig))` |
| `auth` | Mount `/api/auth` routes **and** export `requireAuth` from `middleware.ts` (no `schemas/` or `service.ts` — JWT-only pack) |

Do **not** export a `null` router as the toggle. Do **not** read `siteConfig.features.<pack>` inside `register` to no-op — the registry already skipped disabled packs.

Optional exports: `requireAuth` (auth), typed constants, test helpers.

### Client — `index.ts`

```ts
export { routes } from './routes'; // RouteObject[] or equivalent for client registry
// optional: named components other packs may compose (avoid deep cross-pack imports)
```

---

## Registry (`server/src/features/registry.ts`)

**The only server toggle gate (option b).** Implemented in Prompt 2.3; contract defined here.

1. At **app boot**, load `SiteConfig` (today: same source as `getSiteConfig` — `defaultSiteConfig`).
2. Iterate the pack table in fixed order: `catalog`, `content`, `intake`, `payments`, `auth`.
3. If `siteConfig.features.<pack> === true`:
   - `await import('./<pack>')` (dynamic import)
   - `register(app, siteConfig)`
4. If `false`:
   - `console.log('[feature:off] <pack>')` **once**
   - no import, no `register`, no `app.use`

```ts
// Illustrative — not the final implementation
const PACKS = ['catalog', 'content', 'intake', 'payments', 'auth'] as const;

for (const key of PACKS) {
  if (!siteConfig.features[key]) {
    console.log(`[feature:off] ${key}`);
    continue;
  }
  const mod = await import(`./${key}`);
  mod.register(app, siteConfig);
}
```

**Forbidden:** static `import` of every pack at top of `registry.ts` then mount non-null routers. **Forbidden:** per-request toggle checks that register routes on first hit.

`server/src/index.ts` calls `await mountFeaturePacks(app, siteConfig)` after global middleware (including `attachSiteConfig`).

### Client registry

`client/src/features/registry.ts` (or `App.tsx` table) mirrors the same flags: lazy `import()` of `./<pack>` only when `features.<pack> === true`. Disabled packs must not appear in the React router.

---

## Tenant discipline

### Schemas

```ts
import { Schema } from 'mongoose';
import { tenantIdSchemaDefinition, applyTenantCompoundIndex } from '@/db/tenant-schema';

const productSchema = new Schema({
  ...tenantIdSchemaDefinition,
  slug: { type: String, required: true },
  // ...
});
applyTenantCompoundIndex(productSchema, 'slug', { unique: true });
```

### Queries

| Context | Use |
|---------|-----|
| HTTP handlers | `scoped(Model, req)` from `@/db/scoped` |
| Seeds, webhooks, jobs | `scopedForTenant(Model, tenantId)` (same merge; explicit tenant id) |

Never `Model.find({ ... })` without `tenantId` unless documented as a system model (`Tenant`, etc.) — see `docs/phase-1-prompt-1.7-tenant-audit.md`.

Services receive `tenantId` or a scoped collection from the controller — not raw models without scope.

### Auth `User` model (when added)

Compound unique index: `(tenantId, auth0Id)`.

---

## Cross-pack rules

- No deep imports across packs — lift shared code to `server/src/shared/` or `client/src/shared/`.
- Write-route JWT guards: `server/src/shared/write-guards.ts` (uses `requireAuth` from auth middleware when `features.auth` is on).
- No reading another pack's `features.*` flag from inside a pack.
- No direct writes to another pack's Mongoose models.
- Payments: routes call `getPaymentProvider(siteConfig)`; no Stripe/Square SDK outside `server/src/providers/` (phase 3).

---

## Checklist (per pack PR)

- [ ] Folder matches layout above
- [ ] `packKey` + `register` exported; registry entry added
- [ ] Every schema has `tenantId` + compound index on natural key
- [ ] Every query uses `scoped` or `scopedForTenant`
- [ ] With flag `false` in `defaultSiteConfig`, pack routes 404 (not 500, not mounted stub)
- [ ] Client routes omitted when flag `false`
- [ ] zod validation at route boundary for mutating endpoints
- [ ] No kebab-case pack or `features.*` naming drift

---

## References

- Phase sequence: `docs/prompts/phase-2-feature-packs.html` §03
- Toggle decision: `docs/phase-2-prompt-2.1-resolutions.md` §1
- Cursor rules: `.cursor/rules/40-feature-packs.mdc`, `70-multi-tenant-seams.mdc`
