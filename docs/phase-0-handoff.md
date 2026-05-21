# Phase 0 → Phase 1 handoff

**Template version:** v0.1.0 (tagged)  
**Docs version:** v0.1.0

## Paste into session-starter `{OPEN_QUESTIONS}`

**Superseded by Prompt 1.1** — see `docs/phase-1-prompt-1.1-resolutions.md`.

```
none — Phase 0 carry-forward closed. Next code: demo removal + vite alias (1.2 prep), then SiteConfig type.
```

## Surprises from inventory (inform Phase 1 prompts)

- Package still structurally baseapp demo (Home/Dashboard/Profile, Item CRUD) — not template domain yet.
- `getSiteConfig(req)` and `scoped()` / `tenantId` schema helpers exist (phase 1); no Mongoose models until phase 2 feature packs.
- Client uses global `hooks/useApiAuth.ts` — convention drift vs rules.
- Health returns `{ status: 'ok' }` not `{ ok: true }` — sufficient for ops.
- Node 25 works; `.nvmrc` pins 20 for team consistency.

## Type A / B / C confirmation

**None this phase.** No changes to core types, vertical presets, or per-build `site.config.ts` / `site.theme.ts`. Phase 0 was bootstrap only.
