# Prompt 2.1 — Open questions resolved

**Date:** 2026-05-21  
**Template:** v0.2.0  
**Gate:** No feature-pack code until every item below has an outcome.

Sources: `docs/phase-2-open-questions.md`, `docs/prompts/phase-2-feature-packs.html` (Prompt 2.1), `.cursor/rules/40-feature-packs.mdc`, `server/src/types/site-config.ts`.

---

## 1. Feature-pack mounting (server + client)

| Outcome | **Resolve now — option (b)** |
|---------|------------------------------|
| **Decision** | **`server/src/features/registry.ts` is the only gate.** At app boot it reads `SiteConfig.features` (today: `defaultSiteConfig` / same source as `getSiteConfig`). For each pack whose flag is `true`, it dynamically imports the pack and calls `register(app, siteConfig)`. For `false`, it logs `[feature:off] <pack>` once and does **not** import the pack, does **not** call `register`, and does **not** `app.use()` any router. |
| **Rejected: (a)** | Pack `router.ts` returning `null` when off is **not** the toggle. That still loads pack modules and invites “mount everything, skip null” bugs. Belt-and-suspenders checks inside a pack are fine; the registry already decided the pack is on. |
| **Pack contract** | `createRouter(siteConfig)` (or `register`) assumes its feature flag is **on** — no null return as the gate. |
| **Client** | Mirror the registry: a single `client/src/features/registry.ts` (or equivalent in `App.tsx`) conditionally lazy-imports pack routes/components only when the flag is `true`. Off packs must not appear in the router tree (tree-shake / no import). |
| **Prompt 2.3 alignment** | Phase doc line “import every pack's index.ts” means **register every enabled pack from the registry table**, not unconditional static imports of all pack code. Implementation uses conditional `import()` per enabled flag. |
| **Rationale** | Matches template invariant: disabled pack = **zero API surface** (not empty router, not 501). Matches `.cursor/rules/40-feature-packs.mdc` (“import doesn't happen”). One place to audit toggles before phase 7 per-tenant config. |
| **SiteConfig shape** | Flags are top-level booleans: `features.catalog`, not `features.catalog.enabled` (Phase 1 contract). Briefs that say `.enabled` mean this boolean slice. |

---

## 2. `scoped()` without an Express `req`

| Outcome | **Resolve now** |
|---------|-----------------|
| **Decision** | Add **`scopedForTenant(Model, tenantId: string)`** in `server/src/db/scoped.ts` — same `withTenantFilter` merge as `scoped(Model, req)`, no `req` required. |
| **Use when** | Startup seeds, webhooks (after tenant resolved), cron/background jobs, tests. Pass explicit `tenantId` from `defaultSiteConfig.tenantId`, webhook metadata, or `Tenant._id` — never omit the filter. |
| **Rejected** | Mock `req` objects — brittle and hides missing `siteConfig`. Raw `Model.find({ … })` without `tenantId` — forbidden except documented system models (see 1.7 audit). |
| **Land in code** | First commit that touches `scoped.ts` for phase 2 (registry commit or pack pattern commit). |
| **Rationale** | Phase 2 catalog seed (“zero products for `default`”) and phase 3 webhooks need one blessed pattern; keeps rule 70 honest. |

---

## 3. Auth0 user records vs `tenantId`

| Outcome | **Resolve now** |
|---------|-----------------|
| **Decision** | Auth pack `User` schema (when added): **`tenantId` required**; compound **unique** index on `(tenantId, auth0Id)`. One row per Auth0 subject **per tenant**. |
| **Phase 7** | Same human operating multiple tenants may have multiple rows (same or different `auth0Id` per tenant policy). **Platform admin** on dedicated admin host (phase 7) does not use tenant-scoped `User` — separate admin auth path. |
| **Deferred edge** | Cross-tenant operator SSO linking — **defer to phase 7**; do not weaken uniqueness in phase 2. |
| **Rationale** | Matches agency `workspaceOwnerId` isolation; avoids login leaking across tenants. |

---

## 4. Client `tenantId` exposure

| Outcome | **Resolve now** |
|---------|-----------------|
| **Decision** | **`tenantId` is server-authoritative.** Client does not send `tenantId` in query, body, or headers for phase 2 APIs. |
| **Phase 7** | Client may **display** `tenantId` from `GET /api/_meta/config` (read-only mirror of server resolution). It is not a control plane — server resolves tenant from host + `getSiteConfig` / `Tenant` document. |
| **Rationale** | Prevents dual source of truth before multi-tenant; client mirrors config, does not drive it. |

---

## 5. Webhook and idempotency models (`WebhookEventLog`)

| Outcome | **Defer — phase 3** (direction locked) |
|---------|----------------------------------------|
| **Direction** | Schema includes **`tenantId`**; compound **unique** on `(tenantId, provider, eventId)`. Webhook handler resolves `tenantId` from provider metadata / signing secret mapping **before** idempotency check. |
| **Rejected for phase 3** | Global unique on `(provider, eventId)` only — risks cross-tenant false dedupe when one Stripe account serves multiple tenants. |
| **Rationale** | No webhook code in phase 2; locking direction now avoids a phase-3 rewrite. |

---

## 6. `scoped()` coverage gaps (`aggregate`, `bulkWrite`, …)

| Outcome | **Resolve now (minimum) + defer extensions** |
|---------|------------------------------------------------|
| **Decision** | Phase 2 packs use existing `ScopedCollection` methods (`find`, `findOne`, `findById`, `countDocuments`, `create`, `findOneAndUpdate`, `updateOne`, `deleteOne`, `deleteMany`). **Sufficient for catalog/content/intake/payments/auth scaffolding.** |
| **Defer** | Add `aggregate`, `distinct`, `bulkWrite` to `scoped` / `scopedForTenant` when a pack PR needs them — same tenant merge, one implementation. |
| **Rationale** | Avoid speculative API surface; extend once with a real caller. |

---

## Carried from phase 2 doc (not in open-questions file)

| Topic | Outcome |
|-------|---------|
| Auth0 env placeholders | **Defer** — unchanged from 1.1; configure real Auth0 before testing JWT routes in auth pack. |
| MDX vs rich text (content pack) | **Defer** — document in catalog/content pack prompt (2.5+); default plain string body in phase 2. |
| Intake email integration | **Defer** — store-only in phase 2; email in later pack-internal or phase 6 client need. |

---

## Updated `{OPEN_QUESTIONS}` for session-starter (after 2.1)

```
none — closed in docs/phase-2-prompt-2.1-resolutions.md. Toggle gate: registry (b). Next code: pack pattern doc (2.2), then registry + scopedForTenant (2.3).
```

## Phase 2 implementation order (post-2.1)

1. **2.2** — `server/src/features/_pack-pattern.md` (registry gate documented).  
2. **2.3** — `registry.ts` + `scopedForTenant` + toggle-mount smoke check.  
3. **2.4–2.9** — One pack per commit (`catalog` → … → `auth`).  
4. **2.10** — Close phase, `v0.3.0`.
