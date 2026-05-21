# Phase 4.1 — Resolutions (carry-forward + build order)

**Date:** 2026-05-21  
**Authoritative preset index:** [`verticals/README.md`](../verticals/README.md)

---

## Phase 3 carry-forward — resolved

| Phase 3 / P4 item | Resolution |
|-------------------|------------|
| One provider per site | Unchanged — `payment.provider` singular |
| Square inventory | Push-only; trigger timing → **P4-3** (see below) |
| Webhook tenant metadata | Unchanged — `tenantId` + `orderId` in checkout metadata |
| Dual provider | Rejected |

---

## P4-1 — Provider defaults + GTM

**Provider defaults** (encode in each `site-config.preset.ts`):

| Vertical | Provider | Source |
|----------|----------|--------|
| `screen-printer` | `stripe` | Template architecture brief §04 — quote/invoice workflow |
| `bar-restaurant` | `square` | POS-aligned food vertical |
| `food-truck` | `square` | Same cluster |
| `farm-source` | `square` | Brief §04: public checkout + inventory sync (**not** Stripe; corrects phase-4 prompt draft table) |

**GTM order (selling):** screen-printer → bar-restaurant → food-truck → farm-source. Agency already sells print/quote work; food Square sites are the next tranche; farm-commerce is the deepest product surface.

---

## P4-2 — Stagger presets?

**Yes.** One preset per prompt tranche (4.4 then 4.5 ×3). No parallel build of all four.

---

## Build order (4.1 decision)

| # | Preset | Criteria |
|---|--------|----------|
| 1 | `screen-printer` | **(a)** Most operator knowledge — `askanddeliverwebapp` reference implementation |
| 2 | `bar-restaurant` | Square cluster; simpler than food-truck |
| 3 | `food-truck` | Square cluster; schedule/catering complexity |
| 4 | `farm-source` | **(b)** Stress-test — all five packs, public checkout, inventory |

---

## Still open (Phase 4+)

| ID | Topic | When |
|----|--------|------|
| **P4-3** | Inventory sync: cron vs on-write vs manual | When implementing bar / food-truck / farm presets |
| **P4-4** | Product-backed checkout (not demo line items) | Preset 1 (screen-printer) seed + client |
| **P4-5** | Square POS read-sync | Post–phase 4 / thesis |
| **P4-7** | Intake email | Unchanged deferral |

---

## Next prompt

**4.3** — `scripts/init-vertical.ts` (registry + seed). Pattern + registry shipped in **4.2**.
