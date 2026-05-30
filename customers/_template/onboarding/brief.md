# Client onboarding brief — {CLIENT_NAME}

Copy this folder to `customers/<slug>/onboarding/` before Phase 7 stand-up. Replace `{placeholders}`.

---

## Identity

| Field | Value |
|-------|--------|
| **Slug / tenant id** | `{slug}` (kebab-case) |
| **Vertical** | `screen-printer` \| `bar-restaurant` \| `food-truck` \| `farm-source` |
| **Reference site** | `{https://example.com/}` |
| **Production domain** | `{domain}` |
| **Launch target** | `{date or TBD}` |

---

## Payments

One provider on the **website** (`SiteConfig.payment.provider`). In-person POS can stay on a different vendor.

| Field | Value |
|-------|--------|
| **Website provider** | `square` \| `stripe` \| `none` |
| **`features.payments`** | `true` \| `false` |
| **Public checkout** | `yes` \| `no` \| `phased` — if phased, note go-live date for web orders/tickets |
| **In-person POS** | e.g. Square at truck/bar — not wired through GVSN provider choice |
| **Square location id** | `{SQUARE_LOCATION_ID}` — required if provider is `square` |
| **Stripe** | Production keys + webhook URLs when provider is `stripe` |

### Examples (do not copy blindly)

**Food truck + Square (Terrible Gerald's pattern):** `square`, payments on when ordering launches, public checkout phased, same Square account as truck; confirm web orders hit staff queue via live test.

**Bar + Stripe tickets only (Barry O's pattern):** vertical `bar-restaurant`, website `stripe`, payments on, public checkout for ticket SKUs only; bar menu stays in-house / Square at register.

---

## Feature flags (tenant `site.config`)

| Pack | On? | Notes |
|------|-----|--------|
| `catalog` | | Menu, tickets, or merch |
| `content` | | Pages + posts (events, announcements) |
| `intake` | | Catering, private events, contact |
| `payments` | | See table above |
| `auth` | | Required for `/admin` |
| `admin` | | Owner self-service (Phase 6+) |

---

## Brand intake

| Field | Value |
|-------|--------|
| **Logo** | `assets/logo.{svg,png}` |
| **Primary / accent colors** | `{hex}` — from reference site |
| **Fonts** | `{headline}`, `{body}` |
| **Theme** | Pick IDs or leaf overrides in Phase 7 (`theme/tenants/<slug>.*`) |

---

## Content inventory

- **Pages:** `{home, about, …}`
- **Posts — events:** `{tag: event}`
- **Posts — announcements:** `{tag: announcement}` (optional)
- **Catalog products:** `{menu items, ticket SKUs, …}`
- **Forms:** `{catering, private-event, …}`

---

## Custom frontend (Phase 7 Type C)

List pages/components to port from reference site (not raw Astro `dist` drop-in):

- e.g. `CustomHome` (hero video), `CustomMenu`, `CustomEvents`, …

---

## Third-party to retire

| Service | Replacement |
|---------|-------------|
| Storyblok / other CMS | GVSN posts + `/admin` |
| Getform / form SaaS | GVSN intake + email |
| `{other}` | |

---

## Operator sign-off

- [ ] Vertical confirmed (one of four)
- [ ] Payments table complete
- [ ] Reference URL + assets captured
- [ ] Client OK to replace legacy site copy where it conflicts (e.g. “no online ordering”)
