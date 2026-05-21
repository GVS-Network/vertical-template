# Phase 3 handoff — Payments (v0.4.0)

**Closed:** 2026-05-21 · tag `v0.4.0`

## What's true now

- **Stripe** and **Square** adapters in `server/src/providers/`; routes call `getPaymentProvider(siteConfig)` only.
- `POST /api/payments/checkout/intent` → `{ url, orderId, providerRef }`; order `draft` → `pending` with `paymentRef`.
- `POST /api/payments/webhook/:provider` — signature verify, `WebhookEventLog` idempotency, `markOrder*` by metadata or `providerRef`.
- **Square** `syncInventory(products)` pushes stock by SKU; **Stripe** throws `NotSupported`.
- **Doctor** validates active provider env + live API when `features.payments` is on; **WARN** when `provider: none`.
- Smokes: `test:stripe-happy-path`, `test:square-happy-path`, `test:square-sync-inventory`, `test:webhook-idempotency`.

## Prompt log

| Prompt | Outcome |
|--------|---------|
| **3.1** | `server/src/features/payments/README.md` |
| **3.2** | `PaymentProvider` contract |
| **3.3** | Stripe provider + happy-path |
| **3.4** | Square provider + inventory sync |
| **3.5** | Webhook idempotency + `WebhookEventLog` |
| **3.6** | Doctor payment checks |
| **3.7** | Docs + `v0.4.0` tag |

## Phase 4 entry

Read `docs/prompts/phase-4-verticals.html`. **4.1 done:** build order + provider defaults in **`verticals/README.md`**. Next: **4.2** preset pattern + registry.
