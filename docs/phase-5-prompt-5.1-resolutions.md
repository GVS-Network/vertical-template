# Phase 5.1 — Resolutions (carry-forward + brand direction)

**Date:** 2026-05-21  
**Prerequisite:** Phase 4 closed @ **v0.5.0**  
**Authoritative brand voice (words):** [`theme/verticals/`](../theme/verticals/) · `*.brief.md`  
**Phase 5 open index:** [`phase-5-open-questions.md`](phase-5-open-questions.md)

---

## P5-1 — Opinionated brand per vertical

**Decision: opinionated.** We do **not** ship neutral foundation-only defaults for vertical presets.

| Source | Position |
|--------|----------|
| Platform concept brief | Vertical opinionation is the wedge vs generic site builders |
| Visual system brief L2 | Each vertical overrides foundation selectively — farm earthy, print graphic, bar warm |
| Phase 5 prompt draft | Assumes opinionated unless operator overrules |

**Operator override (neutral):** Not taken. No brief revision required. A neutral-only path would force every client to pick before the site looks credible — contradicting day-one preset value from Phase 4.

**Implication for code:** `theme/verticals/<key>.tokens.ts` (Prompt 5.4) must be a real brand expression, not `{}`. `verticals/<key>/brand-stub.ts` remains the Type-C seam for tenant-specific leaf overrides after init.

---

## P5-2 — Brand directions documented outside code?

**Before 5.1:** Partially — scattered in `docs/visual-system-brief.html`, `docs/prompts/phase-5-visual-system.html` §5.4 (one-line hints), and seed copy in `verticals/*/README.md`. **No Figma, no mood board, no single canonical doc.**

**After 5.1:** Canonical word briefs live at:

```
theme/verticals/
  screen-printer.brief.md
  bar-restaurant.brief.md
  food-truck.brief.md
  farm-source.brief.md
```

**Rule (locked):** Tokens are derived from briefs, not invented in `.tokens.ts` without updating the brief first. If implementation discovers a missing leaf, stop — update `ThemeTokens` + foundation (Prompt 5.2–5.3), then continue.

---

## P5-3 — Token build order (which vertical first?)

Locked for Prompt 5.4 (one commit per vertical, same order as Phase 4 build):

| # | Vertical | Rationale |
|---|----------|-----------|
| **1** | `screen-printer` | Strongest operator + agency reference (`askanddeliverwebapp`); Inkline seed copy is production-shaped; contrast-validator golden path starts where we can validate against live engagements |
| **2** | `bar-restaurant` | Clearest written visual direction in phase-5 prompt (warm, low-light, ink-on-cream); proves second vertical diverges from print without sharing palette |
| **3** | `food-truck` | High-contrast mobile story; reuses Square-cluster learnings from bar |
| **4** | `farm-source` | Earthy commerce palette last — inherits cleanest resolver; most UI surface (checkout + auth) still catching up on P4-4 |

---

## Phase 4 carry-forward — resolved or re-homed

| ID | Topic | 5.1 resolution |
|----|--------|----------------|
| **P4-3** | Square inventory sync trigger | **Default: push on catalog stock write** when product `stock` is mutated server-side. Until write hooks exist: seed-only + optional manual `syncInventory` (existing provider API). No cron in template core. Document in payments pack README when hook lands. |
| **P4-4** | Catalog ↔ checkout | **Deferred to Phase 6** (first client / commerce wiring). Demo `CheckoutButton` line items remain until then; does not block visual system. |
| **P4-5** | Square POS read-sync | **Out of scope** — thesis-level; unchanged |
| **P4-7** | Intake email | **Deferred** — unchanged from 2.6 |
| **P4-6** | Dual provider | **Rejected** — do not re-litigate |

---

## Platform seams noted for Phase 5

| Topic | Status |
|-------|--------|
| Client runtime config | `GET /api/_meta/config` + `SiteConfigProvider` (Phase 4.4+ walk fix) — sufficient for bound-tenant demo until phase 7 |
| CSS variable emission | Per phase-5 prompt 5.8 — server-injected `:root` block; not started in 5.1 |
| `brand-stub.ts` vs `theme/verticals/*.tokens.ts` | **Both:** L2 vertical tokens in `theme/verticals/`; `brand-stub.ts` becomes thin re-export or tenant Type-C override path after 5.4 — align in 5.5 |

---

## Next prompt

**5.2** — Fill `ThemeTokens` leaf set + dual-file contract extension.
