# bar-restaurant

Fixed-location bar and restaurant: structured menu catalog, Square POS alignment, private-event intake. Staff-only payments — no public cart.

## Who it's for

Neighborhood restaurants, wine bars, and cafés that want a credible web menu and event inquiries without turning the site into an ordering channel.

## Assumptions

| Setting | Value |
|---------|--------|
| `payment.provider` | `square` |
| Feature packs | catalog, content, intake, payments — **auth off** |
| Catalog mode | Menu — prices for reference; checkout stays in-house |
| Checkout | Staff-driven Square at POS (Home demo button only until catalog cart wiring) |

## Day one after `init-vertical`

```bash
npm run init:vertical -- --preset=bar-restaurant --tenant=demo-bar-restaurant --force
```

Set in `server/.env`:

```
BOUND_TENANT_ID=demo-bar-restaurant
PAYMENT_PROVIDER=square
```

Restart `npm run dev`, then walk:

| Pack | URL | Expect |
|------|-----|--------|
| Catalog | `/catalog` | 8 menu items with allergen / dietary attributes |
| Content | `/home`, `/about`, `/events` | Harbor & Hearth copy |
| Intake | `/forms/private-event` | Private event form |
| Payments | `/` + checkout button | Square when configured |
| Auth | — | Pack off for this preset |

## Seed inventory

- **8 products** — apps, entrees, dessert, bar pours
- **3 pages** — `home`, `about`, `events`
- **1 form** — `private-event`

## Product attributes (Zod)

`allergens`, `spiceLevel`, `dietaryTags` — see `product-attributes.schema.ts`.
