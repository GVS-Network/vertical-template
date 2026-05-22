# Open questions for Phase 6 (First client)

**Status:** Phase 5 closed @ **v0.6.0** (2026-05-21).  
**Prerequisite:** Visual system end-to-end — see [`phase-5-close-verification.md`](phase-5-close-verification.md)  
**Phase prompt:** [`prompts/phase-6-first-client.html`](prompts/phase-6-first-client.html)

---

## P6-1 — Pick list doesn't offer what the client wants

**The question:** When a client wants something the curated pick list doesn't offer — a palette tone, a type pairing, a density — what's the workflow?

| Option | When | Cost |
|--------|------|------|
| **A. New pick bundle** | Second client (or same vertical) would choose the same thing | Add named bundle to L3 registry (Type B); update foundation if new leaves needed |
| **B. Leaf override** | One-off tweak inside an existing leaf (exact hex, one font swap) | `theme/tenants/<client>.override.ts` — validated, contrast-checked |
| **C. Vertical token change** | Every tenant in that vertical should inherit it | Edit `theme/verticals/<key>.tokens.ts` + brief (Type B propagation) |
| **D. Reject / defer** | Structural ask (new token category, fifth vertical, new pack) | Brief revision or "not what this template does" |

**Recommendation for 6.1 discussion:** Default path is **B → A → C → D**. Override first for client-specific tweaks; promote to pick bundle on second use (visual brief register-before-second-use rule); vertical change only when the whole vertical should shift; brief moment for anything that adds leaves or categories.

---

## Carried forward from Phase 4 / 5

| ID | Topic | Notes |
|----|--------|--------|
| **P4-4** | Catalog ↔ checkout | Wire `CheckoutButton` to seeded catalog products (not demo line items) |
| **P4-7** | Intake email notifications | Deferred from 2.6 |
| **P5-4** | `brand-stub.ts` vs `theme/verticals/*.tokens.ts` | Wire `brand-stub` to tenant override path when first real client ships |

---

## Phase 6 scope reminders

- **Single-tenant deploy** — client's own fork/branch, `tenantId='default'` on their DB; not phase 7 multi-tenant.
- **Real client required** — must map to one of four verticals; no fifth vertical mid-build.
- **Discoveries log** — `build-docs/discoveries/<client>-phase-6.md`; contradictions → brief revision proposals, not silent hacks.
- **Live mode** — production doctor checks for live payment keys, reachable webhooks, backups.

---

## Resolved — do not re-litigate

- Phase 5 opinionated brand per vertical — `phase-5-prompt-5.1-resolutions.md`
- Phase 5 token build order — screen-printer → bar-restaurant → food-truck → farm-source
- Dev theme load via `/api/_meta/theme.css` — not startup-only Vite injection
- Dual payment provider per site — rejected @ v0.4.0
