# Open questions for Phase 4 (from Phase 3 close)

**Status:** Open · Phase 4 entry  
**Prerequisites:** Phase 3 closed @ `v0.4.0` — both payment providers, idempotent webhooks.

---

## Priority — go-to-market and provider defaults

| # | Question | Why it matters |
|---|----------|----------------|
| **P4-1** | **Which vertical preset defaults to which `payment.provider`, and what does that say about our go-to-market order?** | Template brief §04 already sketches bar/food-truck/farm → Square, screen-printer → Stripe. Phase 4 must encode that in `init-vertical` / preset `site.config` — and the *sequence* we sell (Square-first verticals vs Stripe-first) is a GTM decision, not just config. |
| **P4-2** | Do we ship four presets in one phase or stagger (e.g. food-truck + bar first)? | Affects prompt split, sample content depth, and first client-build targets. |

---

## Carried from Phase 3 (deferred)

| # | Topic | Notes |
|---|--------|--------|
| **P4-3** | Square inventory sync trigger | Cron vs on product mutation vs manual — bar/food-truck will force the choice. |
| **P4-4** | Catalog ↔ checkout wiring | `CheckoutButton` still uses demo line items; presets may need product-backed cart. |
| **P4-5** | Square POS read-sync | Pull inventory from Square into Mongo — out of scope Phase 3 (push-only). |
| **P4-6** | Dual active providers per site | Thesis-level; rejected for v0.4.0. |
| **P4-7** | Intake email notifications | Still deferred from 2.6. |

---

## Resolved in Phase 3 (do not re-litigate)

See `docs/phase-3-open-questions.md` and `server/src/features/payments/README.md`.
