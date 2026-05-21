# Payment providers (Phase 3)

Stripe and Square adapters land here. Application code calls `getPaymentProvider(siteConfig)` from `server/src/seams/get-payment-provider.ts` — not these files directly.
