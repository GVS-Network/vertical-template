# Open questions for Phase 7 (First client)

**Status:** Phase 7 **active** — Phase 6 closed @ **`v0.7.0`** (2026-05-30).  
**Prerequisite:** [`phase-6-close-verification.md`](phase-6-close-verification.md) · [`phase-6-handoff.md`](phase-6-handoff.md)  
**Phase prompt:** [`prompts/phase-7-first-client.html`](prompts/phase-7-first-client.html)  
**Target tag:** `v0.8.0` at Phase 7 close

---

## P7-1 — Pick list doesn't offer what the client wants

**The question:** When a client wants something the curated pick list doesn't offer — a palette tone, a type pairing, a density — what's the workflow?

| Option | When | Cost |
|--------|------|------|
| **A. New pick bundle** | Second client (or same vertical) would choose the same thing | Add named bundle to L3 registry (Type B); update foundation if new leaves needed |
| **B. Leaf override** | One-off tweak inside an existing leaf (exact hex, one font swap) | `theme/tenants/<client>.override.ts` — validated, contrast-checked |
| **C. Vertical token change** | Every tenant in that vertical should inherit it | Edit `theme/verticals/<key>.tokens.ts` + brief (Type B propagation) |
| **D. Reject / defer** | Structural ask (new token category, fifth vertical, new pack) | Brief revision or "not what this template does" |

**Recommendation for 7.1 discussion:** Default path is **B → A → C → D**.

---

## Terrible Gerald's (planned first client)

| Setting | Value |
|---------|--------|
| Vertical | `food-truck` |
| Tenant | `terrible-geralds` |
| Auth + admin | on (Phase 6 operator surface — no rebuild) |
| Payments | Per `phase-6-prompt-6.1-resolutions.md` — site config at client build |
| External CMS | none (platform posts/events via `/admin`) |
| Custom frontend | Type C — port Astro styling |
| Phase 7 gate | P4-4 catalog checkout when payments on; Square queue validation with client |

## Barry O's Tavern (planned)

| Setting | Value |
|---------|--------|
| Vertical | `bar-restaurant` |
| Website payments | **Stripe** (event tickets); in-bar POS stays Square |
| Announcements | Posts `tag: announcement`; events `tag: event` |
| Onboarding template | `customers/_template/onboarding/brief.md` |

---

## Open during Phase 7 build

| ID | Topic | Notes |
|----|--------|--------|
| **P7-1** | Visual pick-list workflow | Lock in prompt 7.1 or first brand session |
| **P4-4** | Catalog ↔ checkout | Required when `features.payments: true` on client site |
| **P5-4** | `brand-stub.ts` wiring | Tenant pick/override in client build |

---

## Phase 7 scope reminders

- **Single-tenant deploy** — separate infra until Phase 8.
- **No rebuilding admin** — Phase 6 owns operator surface (`/admin`, content writes, intake email, Markdown).
- **Payment acceptance** — only when `features.payments: true`.
- **Intake form editor** — still defer; seed forms via `init-vertical`.

---

## Resolved — do not re-litigate

- P4-7 intake email — closed Phase 6 @ v0.7.0
- Phase 6 operator surface — closed @ v0.7.0
- Phase plan renumber — amendment v1 (6 operator → 7 first client → 8 multi-tenant)
- WYSIWYG admin — Markdown textarea MVP @ Phase 6.1
