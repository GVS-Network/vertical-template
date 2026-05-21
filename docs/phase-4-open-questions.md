# Open questions for Phase 4

**Status:** Prompt **4.1** closed (2026-05-21). Build order + provider defaults locked.  
**Authoritative:** [`verticals/README.md`](../verticals/README.md) · [`docs/phase-4-prompt-4.1-resolutions.md`](phase-4-prompt-4.1-resolutions.md)

---

## Resolved @ 4.1

| ID | Question | Outcome |
|----|----------|---------|
| **P4-1** | Provider defaults + GTM | See README — screen-printer **Stripe**; bar / food-truck / farm **Square** (farm = public checkout per architecture brief §04) |
| **P4-2** | Ship all presets at once? | **No** — staggered: screen-printer → bar-restaurant → food-truck → farm-source |

### Build order (locked)

1. `screen-printer` — operator knowledge (`askanddeliverwebapp`)
2. `bar-restaurant` — Square, fixed-location
3. `food-truck` — Square, mobile/schedule
4. `farm-source` — five-pack stress test (last / cleanest)

---

## Still open

| ID | Topic | Notes |
|----|--------|--------|
| **P4-3** | Square inventory sync trigger | Cron vs catalog mutation vs manual — decide when building Square presets (#2–4) |
| **P4-4** | Catalog ↔ checkout | Replace demo `CheckoutButton` items with seeded products |
| **P4-5** | Square POS read-sync | Out of scope Phase 3; still deferred |
| **P4-6** | Dual active providers | Rejected @ v0.4.0 |
| **P4-7** | Intake email notifications | Deferred from 2.6 |

---

## Resolved in Phase 3 (do not re-litigate)

`docs/phase-3-open-questions.md` · `server/src/features/payments/README.md`
