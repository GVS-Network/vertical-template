# food-truck

Mobile food truck: menu catalog with daily availability, location-of-the-day content, catering intake, Square staff-only payments.

## Who it's for

Food trucks and pop-ups that need a simple web menu and a clear “where are you today?” page without building a full ordering app.

## Assumptions

| Setting | Value |
|---------|--------|
| `payment.provider` | `square` |
| Feature packs | catalog, content, intake, payments — **auth off** in preset seed |
| Self-service tenants | Enable `features.auth` + `features.admin` in site config (Phase 6) — required for owner-edited menu/events |
| Catalog mode | Menu — `dailyAvailable` and `locationToday` on attributes |
| Checkout | Window + Square POS; catering invoiced separately |

## Day one after `init-vertical`

```bash
npm run init:vertical -- --preset=food-truck --tenant=demo-food-truck --force
```

Set in `server/.env`:

```
BOUND_TENANT_ID=demo-food-truck
PAYMENT_PROVIDER=square
```

Restart `npm run dev`, then walk:

| Pack | URL | Expect |
|------|-----|--------|
| Catalog | `/catalog` | 8 items; truck vs catering-only flagged |
| Content | `/home`, `/about`, `/locations` | Sidewalk Tacos copy + weekly stops |
| Intake | `/forms/catering` | Catering form with service style |
| Payments | `/` + checkout button | Square when configured |
| Auth | — | Pack off |

## Seed inventory

- **8 products** — tacos, sides, drinks, catering pack
- **3 pages** — `home`, `about`, `locations`
- **1 form** — `catering`

## Product attributes (Zod)

`dailyAvailable`, `locationToday` — see `product-attributes.schema.ts`.
