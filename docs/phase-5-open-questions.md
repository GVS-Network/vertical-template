# Open questions for Phase 5 (Visual system)

**Status:** Phase 5 **closed** @ **v0.6.0** (2026-05-21).  
**Verification:** [`phase-5-close-verification.md`](phase-5-close-verification.md)  
**Resolutions:** [`phase-5-prompt-5.1-resolutions.md`](phase-5-prompt-5.1-resolutions.md)

---

## Resolved @ 5.1

| ID | Question | Outcome |
|----|----------|---------|
| **P5-1** | Opinionated vs neutral brand per vertical? | **Opinionated** |
| **P5-2** | Brand documented outside code? | **`theme/verticals/*.brief.md`** |
| **P5-3** | Token build order? | **screen-printer → bar-restaurant → food-truck → farm-source** |

---

## Resolved @ 5.5–5.10

| ID | Topic | Outcome |
|----|--------|---------|
| **P5-4** | `brand-stub.ts` vs L2 tokens | L2 in `theme/verticals/`; stub wired in Phase 6 |
| **P5-5** | CSS var delivery | Dev: `/api/_meta/theme.css` link; prod: inline `<style>` in SPA fallback |
| **P5-6** | Pick registry shape | `tenantThemes[tenantId].pick` + `.override` |

---

## Carried to Phase 6

See [`phase-6-open-questions.md`](phase-6-open-questions.md) — especially **P6-1** (pick-list workflow).

| ID | Topic |
|----|--------|
| **P4-4** | Catalog ↔ checkout |
| **P4-7** | Intake email |

---

## Resolved — do not re-litigate

- Phase 4 preset build order, provider defaults
- Dual payment provider — rejected @ v0.4.0
- P4-3 inventory sync trigger — push on stock write @ 5.1
