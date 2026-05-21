# Vertical presets (Phase 4)

Four opinionated starting points for `SiteConfig`, seed data, product attribute shapes, and payment defaults. Each lives in `verticals/<key>/` once built.

**Phase 4 prompt log:** decisions in `docs/phase-4-prompt-4.1-resolutions.md`.  
**Preset pattern:** [`_preset-pattern.md`](_preset-pattern.md) · **Registry:** [`registry.ts`](registry.ts) (`npm run test:vertical-registry`).

---

## Build order (locked @ Prompt 4.1)

We ship **one preset at a time**, in this sequence. Prompts **4.4 → 4.5** follow it; do not reorder without a brief-level revision.

| # | Preset | Why this position |
|---|--------|-------------------|
| **1** | `screen-printer` | **Operator knowledge (a).** Closest to live practice today: `askanddeliverwebapp` quote → invoice → Stripe Payment Links, portfolio-style catalog, long conditional intake. First preset surfaces flaws in the pattern using a domain we can validate against real engagements—not lorem. |
| **2** | `bar-restaurant` | **Square cluster, simpler fixed-location food.** Validates preset pattern for menu catalog, staff-only Square payments, reservations intake—without food-truck schedule complexity. |
| **3** | `food-truck` | **Square cluster + mobility.** Reuses bar-restaurant learnings; adds location-of-the-day and catering intake conditionals. |
| **4** | `farm-source` | **Pattern stress-test (b).** All **five** feature packs (including `auth`), public Square checkout, inventory sync flag, CSA/wholesale intake—built last so it inherits the cleanest pattern from 1–3. |

```text
screen-printer → bar-restaurant → food-truck → farm-source
     (Stripe)         (Square)        (Square)      (Square, 5 packs)
```

---

## Go-to-market order (selling ≠ build order)

**Build order** optimizes for learning and pattern quality. **GTM order** is which vertical we pitch first to paying clients:

| Priority | Preset | Rationale |
|----------|--------|-----------|
| 1 | `screen-printer` | Agency pipeline already exists; Stripe workflow is production-tested in `askanddeliverwebapp`. |
| 2 | `bar-restaurant` | High local density; Square POS norm; menu site is a fast win. |
| 3 | `food-truck` | Same Square cluster; slightly more moving parts (schedule). |
| 4 | `farm-source` | Strongest commerce surface (checkout + inventory + accounts); sell once Square path is boring. |

---

## Payment provider defaults (P4-1)

One `payment.provider` per site (Phase 3). Preset defaults follow **`docs/template-architecture-brief.html` §04**—not the draft table in `phase-4-verticals.html` (farm-source is **Square**, not Stripe).

| Preset | `payment.provider` | Checkout posture |
|--------|-------------------|------------------|
| `screen-printer` | `stripe` | Staff-driven quotes / Payment Links pattern |
| `bar-restaurant` | `square` | Staff-only (menu, no public cart) |
| `food-truck` | `square` | Staff-only |
| `farm-source` | `square` | **Public checkout on** + inventory sync intent |

Overrides remain Type C (`site.config.ts`) per tenant.

---

## Feature packs per preset (target)

| Preset | catalog | content | intake | payments | auth |
|--------|---------|---------|--------|----------|------|
| `screen-printer` | ✓ portfolio | ✓ | ✓ quote | ✓ | ✓ |
| `bar-restaurant` | ✓ menu | ✓ | ✓ events | ✓ | — |
| `food-truck` | ✓ menu | ✓ | ✓ catering | ✓ | — |
| `farm-source` | ✓ inventory | ✓ | ✓ wholesale | ✓ | ✓ |

Exact flags land in each `site-config.preset.ts` at build time (4.4–4.5).

---

## Deferred to later prompts / phases

| Topic | Status |
|-------|--------|
| Square inventory sync trigger (cron vs mutation vs manual) | Decide when building Square presets (#2–4); default **push on `init-vertical` seed only** until catalog write hooks exist |
| Catalog ↔ checkout (demo line items) | Wire in preset seeds + client cart in 4.4+ |
| Square POS read-sync | Out of scope (Phase 3 push-only) |
| Dual provider per site | Rejected (thesis) |
| Intake email | Deferred from 2.6 |

---

## Folder layout

```
verticals/
├── README.md
├── _preset-pattern.md        ← source of truth (4.2)
├── merge-preset.ts
├── registry.ts               ← all four presets keyed by vertical
├── registry.smoke.ts
├── screen-printer/           ← stub @ 4.2; full seed @ 4.4
├── bar-restaurant/           ← stub @ 4.2; full seed @ 4.5
├── food-truck/               ← stub @ 4.2; full seed @ 4.5
└── farm-source/              ← stub @ 4.2; full seed @ 4.5
```

Each `<key>/` ships: `site-config.preset.ts`, `product-attributes.schema.ts`, `brand-stub.ts`, `seed/*.json`, `README.md`.
