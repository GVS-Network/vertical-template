# Open questions for Phase 7 (First client)

**Status:** Phase 6 not started (amendment applied 2026-05-29).  
**Prerequisite:** Phase 6 closed @ **v0.7.0** — see [`phase-6-handoff.md`](phase-6-handoff.md)  
**Phase prompt:** [`prompts/phase-7-first-client.html`](prompts/phase-7-first-client.html)

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

## Terrible Gerald's (planned)

| Setting | Value |
|---------|--------|
| Vertical | `food-truck` |
| Tenant | `terrible-geralds` |
| Payments | **Square** on (phased public checkout) — see `phase-6-prompt-6.1-resolutions.md` |
| Auth + admin | on |
| External CMS | none (platform posts/events) |
| Custom frontend | Type C — port Astro styling |
| Phase 7 gate | P4-4 catalog checkout + Square queue validation with client |

## Barry O's Tavern (planned)

| Setting | Value |
|---------|--------|
| Vertical | `bar-restaurant` |
| Website payments | **Stripe** (event tickets); in-bar POS stays Square |
| Announcements | Posts `tag: announcement`; events `tag: event` |
| Onboarding template | `customers/_template/onboarding/brief.md` |

---

## Carried forward

| ID | Topic | Notes |
|----|--------|--------|
| **P4-4** | Catalog ↔ checkout | N/A for TG if payments off |
| **P5-4** | brand-stub wiring | Tenant pick/override in Phase 7 |

---

## Phase 7 scope reminders

- **Single-tenant deploy** — separate infra until Phase 8.
- **No rebuilding admin** — Phase 6 owns operator surface.
- **Payment acceptance** — only when `features.payments: true`.

---

## Resolved — do not re-litigate

- P4-7 intake email — closed in Phase 6
- Phase renumber — amendment v1
