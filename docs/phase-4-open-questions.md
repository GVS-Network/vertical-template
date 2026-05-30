# Open questions for Phase 4

**Status:** Phase 4 **closed** @ **v0.5.0** (2026-05-21).  
**Authoritative:** [`verticals/README.md`](../verticals/README.md) · [`docs/phase-4-prompt-4.1-resolutions.md`](phase-4-prompt-4.1-resolutions.md)  
**Phase 5 lead:** [`docs/phase-5-open-questions.md`](phase-5-open-questions.md)

---

## Resolved @ 4.1

| ID | Question | Outcome |
|----|----------|---------|
| **P4-1** | Provider defaults + GTM | See README — screen-printer **Stripe**; bar / food-truck / farm **Square** (farm = public checkout per architecture brief §04) |
| **P4-2** | Ship all presets at once? | **No** — staggered: screen-printer → bar-restaurant → food-truck → farm-source |

### Build order (locked) — all shipped @ v0.5.0

1. `screen-printer` — operator knowledge (`askanddeliverwebapp`)
2. `bar-restaurant` — Square, fixed-location
3. `food-truck` — Square, mobile/schedule
4. `farm-source` — five-pack stress test (last / cleanest)

---

## Carried to Phase 5

| ID | Topic | Status |
|----|--------|--------|
| **P4-3** | Square inventory sync trigger | **Resolved @ 5.1** — push on stock write; see `phase-5-prompt-5.1-resolutions.md` |
| **P4-4** | Catalog ↔ checkout | **Deferred to Phase 7** @ 5.1 |
| **P4-5** | Square POS read-sync | Out of scope |
| **P4-7** | Intake email notifications | Deferred from 2.6 |

---

## Resolved in Phase 3 (do not re-litigate)

`docs/phase-3-open-questions.md` · `server/src/features/payments/README.md`
