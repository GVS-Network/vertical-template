# Vertical preset pattern

**Source of truth for Phase 4+.** Build order: `verticals/README.md`. Locked in `docs/phase-4-prompt-4.1-resolutions.md`.

Every shipped preset is `verticals/<key>/` where `<key>` is `SiteConfig['vertical']` (not `generic`).

---

## Folder shape

```
verticals/<key>/
  site-config.preset.ts      # Partial<SiteConfig> merged onto defaultSiteConfig
  product-attributes.schema.ts # Zod schema for Product.attributes
  brand-stub.ts                # Partial<ThemeTokens> (phase 5 fills values)
  seed/
    products.json              # plain JSON array — no code
    pages.json
    forms.json
  README.md                    # operator-facing: who, assumptions, day-one outcome
```

---

## File contracts

### 1. `site-config.preset.ts`

```typescript
import type { SiteConfig } from '../../server/src/types/site-config';

export const preset: Partial<SiteConfig> = {
  vertical: '<key>',
  // features, payment.provider, branding, locale, contact — opinionated defaults
};
```

- Must set `vertical` to the folder name.
- Must set `payment.provider` per `verticals/README.md` (P4-1).
- `tenantId` is **not** set here — `init-vertical` stamps the target tenant.
- Merge via `mergePreset()` from `verticals/merge-preset.ts` (deep-merge `features`, shallow-merge other top-level keys).

### 2. `product-attributes.schema.ts`

```typescript
import { z } from 'zod';

export const productAttributesSchema = z.object({ /* vertical fields */ });
export type ProductAttributes = z.infer<typeof productAttributesSchema>;
```

- Validates `Product.attributes` for catalog writes (server) and future client forms.
- Unknown keys: use `.strict()` when the vertical's shape is locked; stubs may omit until 4.4.
- No Mongoose schema change — `attributes` stays `Mixed`.

### 3. `seed/*.json`

| File | Contents |
|------|----------|
| `products.json` | Array of `{ name, slug, sku, price, stock, status, attributes }` — no `tenantId` (stamped at seed time) |
| `pages.json` | Array of `{ slug, title, body, status?, hero? }` — add matching client routes in `content/routes.tsx` when introducing new slugs (e.g. `/portfolio`) |
| `forms.json` | Array of FormDefinition-shaped objects (intake pack) |

- **No lorem** in finished presets (4.4+).
- Verify after init: `npm run test:<preset>-preset` → `scripts/verify-vertical-preset.ts <key>` (DB + HTTP walk).
- Empty `[]` is valid for pattern stubs @ 4.2.

### 4. `README.md`

Operator-facing: who this preset is for, POS/payment assumptions, which packs are on, what `init-vertical` delivers.

### 5. `brand-stub.ts`

```typescript
import type { ThemeTokens } from '../../client/src/types/theme-tokens';

export const brandStub: Partial<ThemeTokens> = {};
```

Phase 5 replaces `{}` with vertical token overrides.

---

## Registry

`verticals/registry.ts` exports:

| Export | Purpose |
|--------|---------|
| `VERTICAL_PRESET_KEYS` | `['screen-printer', …]` — excludes `generic` |
| `verticalPresets` | `Record<key, VerticalPresetEntry>` |
| `mergePreset(partial)` | `Partial<SiteConfig>` → full `SiteConfig` |
| `isVerticalPresetKey(s)` | type guard for CLI / doctor |

`VerticalPresetEntry`: `{ preset, brandStub, productAttributesSchema }`.

`init-vertical` (4.3+) imports the registry — never hardcodes vertical list. Writes `server/src/models/tenant-registry.ts` → MongoDB collection `_tenants` (`_id` = tenant id, `preset`, `createdAt`, `seededAt`). Idempotent unless `--force` (wipes tenant-scoped Product/Page/Post/FormDefinition/Submission/Order rows).

---

## Rules

1. **No SDK imports** in `verticals/` — config and data only.
2. **No `tenantId` in seed JSON** — stamping is `init-vertical`'s job.
3. **Pattern changes apply to all four** — if 4.4 discovers a gap, update this doc + backfill earlier presets in the same PR.
4. **Type A** — preset files live in template core; client builds override via Type C (`site.config.ts`), not by editing `verticals/<key>/`.

---

## Prompt map

| Prompt | Work |
|--------|------|
| **4.2** | This doc + `registry.ts` + stubs |
| **4.3** | `scripts/init-vertical.ts` reads registry + seed |
| **4.4** | First preset (screen-printer) — full seed + README |
| **4.5** | Presets #2–#4 in build order |
