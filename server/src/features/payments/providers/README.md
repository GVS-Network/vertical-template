# Provider implementations (Phase 3)

**Adapters live in `server/src/providers/`** — not in this folder.

| Provider | File |
|----------|------|
| Stripe | `server/src/providers/stripe.ts` |
| Square | `server/src/providers/square.ts` |

Decisions and env vars: [`../README.md`](../README.md).

Application code calls `getPaymentProvider(siteConfig)` from `server/src/seams/get-payment-provider.ts` only.
