# Open questions for Phase 3 (from Phase 2 close)

**Status:** Phase 3 closed @ `v0.4.0` (2026-05-21).  
**Authoritative answers:** [`server/src/features/payments/README.md`](../server/src/features/payments/README.md)  
**Phase 4 entry:** [`docs/phase-4-open-questions.md`](phase-4-open-questions.md)

---

## Summary

| # | Topic | Outcome |
|---|--------|---------|
| **P3-1** | Adapter location | `server/src/providers/` only |
| **P3-2** | Stripe shape | Checkout Sessions per order (dynamic hosted URL) |
| **P3-3** | Checkout response | `{ url, orderId, providerRef }` in success payload |
| **P3-4** | `provider: 'none'` | Pack on, checkout 501, doctor WARN |
| **P3-5** | Order + webhooks | `draft` → `pending` → `paid` / `cancelled`; handlers in 3.5 |
| **P3-6** | Webhook tenant | Metadata `tenantId` + `orderId`; `'default'` in phase 3 |
| **P3-7** | Catalog ↔ checkout | Defer — demo line items for 3.3 tests |
| **P3-8** | Square scope | Both Stripe and Square in phase 3 |
| **P3-9** | WebhookEventLog | Yes in 3.5; unique `(tenantId, provider, eventId)` |
| **P3-10** | Env vars | Table in pack README; `.env.example` in 3.3/3.4 PRs |
| **P3-11** | Intake email | Defer |
| **3.1a** | Dual provider per site? | **No** — one `payment.provider` per site |
| **3.1b** | Square inventory | **Push (mutate)** to Square; no read-sync in phase 3 |

Do not re-litigate in provider PRs unless new facts contradict the pack README.

---

## Phase 4 preview

Moved to **`docs/phase-4-open-questions.md`** (P4-1 go-to-market / provider defaults is the lead question).
