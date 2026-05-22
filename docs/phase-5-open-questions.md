# Open questions for Phase 5 (Visual system)

**Status:** Prompt **5.1** closed (2026-05-21). Resolutions: [`phase-5-prompt-5.1-resolutions.md`](phase-5-prompt-5.1-resolutions.md)  
**Prerequisite:** Phase 4 closed @ **v0.5.0**

---

## Resolved @ 5.1

| ID | Question | Outcome |
|----|----------|---------|
| **P5-1** | Opinionated vs neutral brand per vertical? | **Opinionated** — per concept + visual briefs; no operator override |
| **P5-2** | Brand documented outside code? | **Yes** — `theme/verticals/*.brief.md` (no Figma/mood board) |
| **P5-3** | Token build order? | **screen-printer → bar-restaurant → food-truck → farm-source** |

---

## Carried forward (implementation prompts)

| ID | Topic | Target |
|----|--------|--------|
| **P4-4** | Catalog ↔ checkout | Phase 6 — wire `CheckoutButton` to seeded products |
| **P4-7** | Intake email | Deferred |
| **P5-4** | `brand-stub.ts` vs `theme/verticals/*.tokens.ts` | Align when first vertical tokens ship (5.4) |

---

## Resolved from Phase 4 @ 5.1

| ID | Topic | Outcome |
|----|--------|---------|
| **P4-3** | Inventory sync trigger | Push on catalog **stock write**; manual/seed until hook exists |
| **P4-5** | Square POS read-sync | Out of scope |

---

## Still open (Phase 5+)

| ID | Topic | Notes |
|----|--------|--------|
| **P5-5** | Server `:root` injection vs client-only CSS vars | Decide in Prompt 5.8 |
| **P5-6** | Curated pick registry shape | Prompt 5.5 — named bundles vs raw partials |

---

## Resolved — do not re-litigate

- Phase 4 preset build order, provider defaults — `phase-4-prompt-4.1-resolutions.md`
- Dual payment provider — rejected @ v0.4.0
- Opinionated vertical presets (SiteConfig/features) — Phase 4
