# Open questions for Phase 2 (from Phase 1 close)

Carry these into the first Phase 2 prompts. Resolve before or during pack scaffolding — do not let packs ship with ad-hoc answers.

## 1. Feature-pack mounting (server)

**Question:** Should disabled packs be filtered by server middleware before the request reaches the pack router, or should each pack's router read `req.siteConfig.features.<id>` and no-op?

**Why it matters:** Middleware-off = zero route registration (stronger "disabled = no surface"). In-router check = simpler mount in `index.ts` but routes still exist if mounted carelessly.

**Phase 1 state:** `attachSiteConfig` runs globally; no feature routers mounted yet. Phase 2 prompt 2.1 should lock this.

## 2. `scoped()` without an Express `req`

**Question:** How do startup seeds, webhooks, and background jobs scope queries when there is no `req.siteConfig`?

**Options to decide:**
- `scopedForTenant(Model, tenantId: string)` sibling helper (same merge logic, no `req`).
- Pass a minimal `{ siteConfig: defaultSiteConfig }` mock into `scoped()`.
- Explicit `Model.find({ tenantId: '...' })` only in documented system paths (discouraged by rule 70).

**Why it matters:** Phase 2 catalog seed ("if zero products for `default`") and Phase 3 webhooks need a consistent pattern.

## 3. Auth0 user records vs `tenantId`

**Question:** When the auth pack adds a `User` (or session) model, is the compound key `(tenantId, auth0Id)` unique? Can one Auth0 user belong to multiple tenants in phase 7?

**Why it matters:** Wrong uniqueness breaks multi-tenant login or blocks legitimate cross-tenant operators.

## 4. Client `tenantId` exposure

**Question:** Does the client ever send `tenantId`, or is it server-only via `getSiteConfig(req)` / future `/api/_meta/config`?

**Why it matters:** Phase 7 client config fetch must not introduce a second source of truth that disagrees with the server seam.

## 5. Webhook and idempotency models (preview)

**Question:** Is `WebhookEventLog` scoped per `tenantId` or globally unique on `(provider, eventId)` with tenant resolved from payload metadata?

**Why it matters:** Phase 3; wrong choice causes cross-tenant idempotency bugs or duplicate processing.

## 6. `scoped()` coverage gaps

**Question:** Which Mongoose APIs must `scoped()` wrap beyond find/findOne/create/update/delete? (e.g. `aggregate`, `bulkWrite`, `distinct`)

**Why it matters:** Phase 2 packs may need aggregates for catalog; extend `ScopedCollection` in one place rather than raw model calls.

---

*Resolved in Phase 1 (not open): SiteConfig shape, dual-file contract, demo removal, payment stub seam, tenantId field + helper with no live schemas.*
