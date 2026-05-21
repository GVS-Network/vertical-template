# Payments feature pack — Phase 3 decisions

**Prompt 3.1 · 2026-05-21 · Template `v0.3.0`**

Authoritative outcomes for Phase 3 implementation. No adapter code until **3.2+**. Phase 2 carry-forward: `docs/phase-2-prompt-2.1-resolutions.md`.

---

## New questions (3.1)

### One provider per site, or both at once?

**Decision: one provider per site.**

- `SiteConfig.payment.provider` is a single value: `'stripe' | 'square' | 'none'`.
- `getPaymentProvider(siteConfig)` returns exactly one `PaymentProvider` implementation.
- Vertical presets pick one provider per business type (template brief §04 — bar/food-truck/farm → Square; screen-printer → Stripe). There is no `providers: ['stripe','square']` array in v0.4.0.

**Rejected for Phase 3:** dual active providers on one site (e.g. Stripe online + Square in-person). That needs a **SiteConfig shape change** (breaking), routing rules per channel, and two webhook namespaces — defer to a thesis-level brief revision if a client proves the need.

**Staff-only vs public checkout** is orthogonal (future `publicCheckout` / vertical preset fields), not a second payment vendor.

### Square inventory: mutate or read?

**Decision: mutate (push) — template → Square.**

- `syncInventory(products)` **writes** stock counts to Square Catalog Inventory API for products with a `sku`.
- Calls are **idempotent** (safe to re-run; Square is updated to match template catalog truth for web-driven stock).
- **Out of scope Phase 3:** pulling Square POS inventory into Mongo (read/reconcile job). Operators who treat Square as source of truth for in-store stock will need a later read-sync or manual process; farm-source vertical still **pushes** web/catalog changes to Square per brief “inventory sync on.”

**Stripe:** `syncInventory` throws / returns `NotSupported` (no Square POS counterpart).

---

## Carried from Phase 2 close (`docs/phase-3-open-questions.md`)

| ID | Topic | Decision |
|----|--------|----------|
| **P3-1** | Adapter file location | Implementations in **`server/src/providers/stripe.ts`** and **`server/src/providers/square.ts`**. SDK imports stay there only (`.cursorrules`, stack-context). `features/payments/providers/` is documentation-only — not production code path. *Note: phase-3 prompts 3.3–3.4 say `features/payments/providers/`; implementation follows stack rule, not that path.* |
| **P3-2** | Stripe API shape | **Stripe Checkout Sessions** created per order from `order.items` (hosted `url`, no PCI on our servers). Matches phase-3 prompt 3.3. Agency app **Payment Links** remain the pattern for quote→invoice flows (often Type C / operator-driven); dynamic cart checkout uses Sessions, not pre-minted Payment Link objects. |
| **P3-3** | Checkout intent API success body | After seam fills: `{ status: 'success', data: { url, orderId, providerRef } }` where `url` + `providerRef` come from `PaymentProvider.createCheckout(order)`. Errors: `none` / misconfig → **501** `PAYMENTS_NOT_CONFIGURED`; provider API failure → **502** with safe message. |
| **P3-4** | `payment.provider === 'none'` | **`features.payments` may stay on** with `provider: 'none'`. Pack routes mount; `getPaymentProvider` throws a recognizable error; checkout returns **501** (today’s behavior, stable code). **Doctor:** WARN, not fail (prompt 3.6). |
| **P3-5** | Order lifecycle + webhooks | Use existing enum: `draft` → `pending` (checkout URL created, `paymentRef` set) → `paid` \| `cancelled` (failed/expired/refunded map to `cancelled` or dedicated handling in service — prefer `cancelled` for failed, log refunded separately via `markOrderRefunded`). Webhook handlers call `markOrderPaid` / `markOrderFailed` / `markOrderRefunded` in **3.5**. |
| **P3-6** | Webhook tenant resolution (single-tenant) | Embed **`tenantId`** and **`orderId`** in provider metadata when creating checkout (Stripe `metadata`, Square `reference_id` / order metadata). Handler resolves tenant from payload → `scopedForTenant` / `markOrder*(providerRef)`. Phase 3 value: `'default'`. Phase 7 revisits host-based tenant without changing idempotency shape. |
| **P3-7** | Catalog ↔ checkout | **Defer.** `CheckoutButton` on Home keeps **hardcoded demo line items** for Phase 3 happy-path tests. Wiring catalog `Product` → cart is not blocking for Stripe/Square E2E or webhook idempotency. |
| **P3-8** | Square in this phase? | **Yes — both providers in Phase 3.** Sequence: lock interface (3.2) → Stripe (3.3) → Square + `syncInventory` (3.4) → webhooks (3.5) → doctor (3.6). |
| **P3-9** | `WebhookEventLog` | **Land in 3.5** with webhooks. Schema: `tenantId`, `provider`, `eventId`, `processedAt`, optional payload hash. Compound **unique** on **`(tenantId, provider, eventId)`** per Phase 2.1 (not `(provider, eventId)` alone). Duplicate delivery → **200**, no double state change. |
| **P3-10** | Env vars | Document here; **add to `server/.env.example` + `stack-context.html` §04** in the same PR as each provider (3.3 / 3.4). |
| **P3-11** | Intake email | **Defer** — not Phase 3 (`TODO: intake-notifications` from 2.6). |

---

## Environment variables (reference)

| Variable | When required |
|----------|----------------|
| `STRIPE_SECRET_KEY` | `payment.provider === 'stripe'` |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhooks |
| `SQUARE_ACCESS_TOKEN` | `payment.provider === 'square'` |
| `SQUARE_LOCATION_ID` | Square Orders / Checkout |
| `SQUARE_WEBHOOK_SIGNATURE_KEY` | Square webhooks |
| `SQUARE_ENV` | `sandbox` \| `production` |

Auth0 and Mongo unchanged from Phase 2.

---

## HTTP surface (unchanged pack boundary)

| Route | Role |
|-------|------|
| `POST /api/payments/checkout/intent` | Create `Order` draft → `getPaymentProvider` → `createCheckout` → return URL |
| `POST /api/payments/webhook/stripe` | Stripe-signed events (3.5) |
| `POST /api/payments/webhook/square` | Square-signed events (3.5) |

Routes never import Stripe/Square SDKs — only `getPaymentProvider(siteConfig)` and provider modules under `server/src/providers/`.

---

## Implementation order (post-3.1)

1. ~~**3.2**~~ — PaymentProvider contract locked.
2. ~~**3.3**~~ — `server/src/providers/stripe.ts` + factory + webhook handler (idempotency log in **3.5**).
3. **3.4** — `server/src/providers/square.ts` + `syncInventory` push.
4. **3.5** — `WebhookEventLog` + controller webhook pipeline + idempotency tests.
5. **3.6** — Doctor provider checks.
6. **3.7** — Close phase @ `v0.4.0`.

---

## Session starter `{OPEN_QUESTIONS}` (after 3.1)

```
Closed in server/src/features/payments/README.md. One provider per site; Square inventory push only; WebhookEventLog (tenantId, provider, eventId) in 3.5. Next: 3.2 lock PaymentProvider interface.
```
