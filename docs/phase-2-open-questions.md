# Open questions for Phase 2 (from Phase 1 close)

**Status:** Closed in Prompt 2.1 (2026-05-21).  
**Authoritative outcomes:** [`docs/phase-2-prompt-2.1-resolutions.md`](phase-2-prompt-2.1-resolutions.md)

## Summary

| # | Topic | Outcome |
|---|--------|---------|
| 1 | Feature-pack mounting | **(b)** Registry gates at boot; off packs never `import` / `register` |
| 2 | `scoped()` without `req` | **`scopedForTenant(Model, tenantId)`** |
| 3 | Auth0 + `tenantId` | Unique `(tenantId, auth0Id)` per tenant |
| 4 | Client `tenantId` | Server-only; never client-sent in phase 2 |
| 5 | WebhookEventLog | **Defer phase 3** — unique `(tenantId, provider, eventId)` |
| 6 | `scoped()` extras | Current API enough for phase 2; extend when needed |

Do not re-litigate these in pack PRs unless a new fact contradicts the resolution doc.
