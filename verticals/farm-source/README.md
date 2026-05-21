# farm-source

Farm, CSA, and farm-to-table retail: inventory catalog with stock counts, public Square checkout, wholesale intake, member auth. All five feature packs on — phase 4 pattern stress-test.

## Who it's for

Small farms and farm stores that sell online with real inventory, run a CSA, and take B2B inquiries from restaurants and markets.

## Assumptions

| Setting | Value |
|---------|--------|
| `payment.provider` | `square` |
| Feature packs | **all five** — catalog, content, intake, payments, auth |
| Catalog mode | Inventory — `stock` on products; Square sync on seed (push-only @ phase 4) |
| Checkout | **Public** — Home demo button + catalog path; Square Payment Links when configured |

## Day one after `init-vertical`

```bash
npm run init:vertical -- --preset=farm-source --tenant=demo-farm-source --force
```

Set in `server/.env`:

```
BOUND_TENANT_ID=demo-farm-source
PAYMENT_PROVIDER=square
```

Restart `npm run dev`, then walk:

| Pack | URL | Expect |
|------|-----|--------|
| Catalog | `/catalog` | 8 products with stock + season / lot attributes |
| Content | `/home`, `/about`, `/csa` | Black Oak Farm copy |
| Intake | `/forms/wholesale-inquiry` | Wholesale form with `business_type` |
| Payments | `/` + checkout button | Square when configured |
| Auth | Login / `GET /api/auth/me` | Auth0 when configured |

## Seed inventory

- **8 products** — CSA share, eggs, greens, honey, meats, flowers, maple
- **3 pages** — `home`, `about`, `csa`
- **1 form** — `wholesale-inquiry`

## Product attributes (Zod)

`season`, `csaShare`, `originLot` — see `product-attributes.schema.ts`.

## Inventory sync (P4-3 deferral)

Square inventory push runs when catalog write hooks land; until then, seed stock is the source of truth in Mongo. Documented in `verticals/README.md`.
