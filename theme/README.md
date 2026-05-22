# Theme (Phase 5)

Four-layer token resolution: **foundation → vertical → tenant pick → tenant override**. Spec: [`docs/visual-system-brief.html`](../docs/visual-system-brief.html).

## Brand voice before tokens

Each vertical's written brief is the source of truth for palette, type, and density decisions. Do not add token values without reading the brief first.

| Vertical | Brief |
|----------|--------|
| `screen-printer` | [`verticals/screen-printer.brief.md`](verticals/screen-printer.brief.md) |
| `bar-restaurant` | [`verticals/bar-restaurant.brief.md`](verticals/bar-restaurant.brief.md) |
| `food-truck` | [`verticals/food-truck.brief.md`](verticals/food-truck.brief.md) |
| `farm-source` | [`verticals/farm-source.brief.md`](verticals/farm-source.brief.md) |

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
└── resolve-tokens.ts             # Prompt 5.6
```

Implementation lives under `client/src/theme/` once types and resolver are wired (Prompt 5.2–5.7).
