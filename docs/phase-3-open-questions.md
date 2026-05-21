# Open questions for Phase 3 (from Phase 2 close)

**Status:** Open — resolve in Phase 3.1 before adapter implementation.  
**Prerequisites:** Phase 2 closed @ `v0.3.0`; payments pack scaffold in `server/src/features/payments/`.

---

## Payments pack — how to fill the scaffold

| # | Topic | Context (Phase 2 state) | Decision needed |
|---|--------|-------------------------|-----------------|
| **P3-1** | **Adapter location** | Seam throws from `get-payment-provider.ts`; stub README under `features/payments/providers/` | Confirm adapters live only in **`server/src/providers/stripe.ts`** (and `square.ts`) per stack-context — remove or repurpose `features/payments/providers/`? |
| **P3-2** | **Stripe product shape** | Agency app uses **Payment Links** | Phase 3: Payment Links only, or also Checkout Sessions / Payment Intents? `PaymentProvider` interface must match chosen flow. |
| **P3-3** | **Checkout intent contract** | `POST /api/payments/checkout/intent` creates `Order` draft then calls `getPaymentProvider()` → 501 | Success response shape: `{ paymentUrl }`, `{ clientSecret }`, or `{ orderId, linkUrl }`? Align `CheckoutButton` client hook to final shape. |
| **P3-4** | **`siteConfig.payment.provider`** | Values include `none`, future `stripe`, `square` | When `provider === 'none'`, keep 501 or skip mounting payments routes entirely? Today pack mounts and fails at checkout. |
| **P3-5** | **Webhook → Order lifecycle** | `POST /api/payments/webhook/:provider` logs and returns 200 | Status transitions on `Order` (`draft` → `paid` / `failed`)? Idempotency via **WebhookEventLog** (deferred from Phase 2.1)? |
| **P3-6** | **Webhook tenant resolution** | Single-tenant: `tenantId === 'default'` | How does webhook map Stripe event → tenant before multi-tenant (metadata on Payment Link? connected account?)? |
| **P3-7** | **Catalog ↔ payments** | `CheckoutButton` on Home uses hardcoded demo line items | Wire to catalog `Product` / cart, or stay demo until a later prompt? |
| **P3-8** | **Square scope** | Second adapter mentioned in brief | Phase 3 ship Stripe-only with Square stub, or both adapters in one phase? |

---

## Cross-cutting (Phase 3)

| # | Topic | Notes |
|---|--------|-------|
| **P3-9** | **WebhookEventLog model** | Phase 2.1 deferred: compound unique `(tenantId, provider, eventId)`. Land in Phase 3 with webhooks or defer again? |
| **P3-10** | **Env vars** | Stripe secret, webhook secret, Square equivalents — add to `server/.env.example` + `stack-context.html` §04 in same PR as adapters. |
| **P3-11** | **Intake notifications** | `TODO(later): intake-notifications` from Phase 2.6 — email on submission. Phase 3 or later? |

---

## Resolved in Phase 2 (do not re-litigate)

See `docs/phase-2-prompt-2.1-resolutions.md` and `docs/phase-2-open-questions.md` (closed).
