# screen-printer

Custom print shop preset — quote-driven sales, portfolio-style catalog, Stripe for deposits and invoices (aligned with `askanddeliverwebapp`).

## Who it's for

Screen printers, embroiderers, and promo product shops that quote jobs before production. Customers browse blanks and minimums; staff close deals with proofs and payment links.

## Assumptions

| Setting | Value |
|---------|--------|
| `payment.provider` | `stripe` |
| Feature packs | catalog, content, intake, payments, auth (all on) |
| Catalog mode | Portfolio / blanks list — prices are reference, not public cart |
| Checkout | Staff-driven via payments pack (demo checkout on Home still uses sample line items until P4-4 catalog wiring) |

## Day one after `init-vertical`

```bash
npm run init:vertical -- --preset=screen-printer --tenant=demo-screen-printer --force
```

Set in `server/.env`:

```
BOUND_TENANT_ID=demo-screen-printer
PAYMENT_PROVIDER=stripe
```

Verify seeded data: `npm run test:screen-printer-preset`.

Restart `npm run dev`, then walk:

| Pack | URL | Expect |
|------|-----|--------|
| Catalog | `/catalog` | 8 seeded blanks (tees, hoodie, tote, …) |
| Content | `/home`, `/about`, `/portfolio` | Inkline copy |
| Intake | `/forms/project-quote` | Quote form |
| Payments | `/` + checkout button | Stripe when configured |
| Auth | Login / `GET /api/auth/me` | Auth0 when configured |

## Seed inventory

- **8 products** — real garment names, SKUs, `minQty` / `printSides` attributes
- **3 pages** — `home`, `about`, `portfolio`
- **1 form** — `project-quote`

## Product attributes (Zod)

`printSides`, `garmentBlank`, `minQty` — see `product-attributes.schema.ts`.
