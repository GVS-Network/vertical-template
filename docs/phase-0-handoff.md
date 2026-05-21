# Phase 0 → Phase 1 handoff

**Template version:** v0.1.0 (tagged)  
**Docs version:** v0.1.0

## Paste into session-starter `{OPEN_QUESTIONS}`

```
Phase 1 first: remove demo User/Item routes and models (kept through 0.7 only).
Tailwind frozen until Phase 5 — no new utility classes.
Vite @ alias in vite.config.ts still wrong ('/src' absolute) — fix if @/ imports fail.
Auth0 env vars may still be placeholders until admin routes are tested.
```

## Surprises from inventory (inform Phase 1 prompts)

- Package still structurally baseapp demo (Home/Dashboard/Profile, Item CRUD) — not template domain yet.
- `getSiteConfig(req)` and `tenantId` on models do not exist; cursor rules describe targets, not current code.
- Client uses global `hooks/useApiAuth.ts` — convention drift vs rules.
- Health returns `{ status: 'ok' }` not `{ ok: true }` — sufficient for ops.
- Node 25 works; `.nvmrc` pins 20 for team consistency.

## Type A / B / C confirmation

**None this phase.** No changes to core types, vertical presets, or per-build `site.config.ts` / `site.theme.ts`. Phase 0 was bootstrap only.
