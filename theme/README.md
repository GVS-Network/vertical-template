# Theme (Phase 5)

Four-layer token resolution: **foundation → vertical → tenant pick → tenant override**. Spec: [`docs/visual-system-brief.html`](../docs/visual-system-brief.html).

## Brand voice before tokens

Each vertical's written brief is the source of truth for palette, type, and density decisions. Do not add token values without reading the brief first.

| Vertical | Brief | Tokens |
|----------|--------|--------|
| `screen-printer` | [`verticals/screen-printer.brief.md`](verticals/screen-printer.brief.md) | [`verticals/screen-printer.tokens.ts`](verticals/screen-printer.tokens.ts) |
| `bar-restaurant` | [`verticals/bar-restaurant.brief.md`](verticals/bar-restaurant.brief.md) | [`verticals/bar-restaurant.tokens.ts`](verticals/bar-restaurant.tokens.ts) |
| `food-truck` | [`verticals/food-truck.brief.md`](verticals/food-truck.brief.md) | [`verticals/food-truck.tokens.ts`](verticals/food-truck.tokens.ts) |
| `farm-source` | [`verticals/farm-source.brief.md`](verticals/farm-source.brief.md) | [`verticals/farm-source.tokens.ts`](verticals/farm-source.tokens.ts) |

**Build order for `*.tokens.ts`:** screen-printer → bar-restaurant → food-truck → farm-source (locked @ [`docs/phase-5-prompt-5.1-resolutions.md`](../docs/phase-5-prompt-5.1-resolutions.md)).

## Folder map (Prompt 5.2+)

```
theme/
├── README.md
├── foundation.tokens.ts          # Prompt 5.3
├── verticals/
│   ├── *.brief.md                # Prompt 5.1 — words first
│   └── *.tokens.ts               # Prompt 5.4 — one commit per vertical
├── tenants/
│   ├── registry.ts               # Prompt 5.5
│   └── demo-*.pick.ts / override.ts
├── resolve.ts                    # Prompt 5.6 — resolveTokens()
├── deep-merge-tokens.ts
├── validate-leaf-override.ts
├── validate-contrast.ts          # Prompt 5.7 — WCAG pairs
├── emit-css-vars.ts              # Prompt 5.8 — :root emission
├── inject-theme-html.ts          # Prompt 5.8 — `<head>` injection helper
└── resolve.smoke.ts
```

Implementation lives under `client/src/theme/` once types and resolver are wired (Prompt 5.2–5.7).
