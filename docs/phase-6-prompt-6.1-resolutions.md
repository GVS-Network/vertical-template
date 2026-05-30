# Phase 6.1 — Resolutions (operator surface)

**Date:** 2026-05-29  
**Prerequisite:** Phase 5 closed @ **v0.6.0**; amendment v1 accepted — [`amendments/phase-plan-amendment-v1.md`](amendments/phase-plan-amendment-v1.md)  
**Phase 6 open index:** [`phase-6-open-questions.md`](phase-6-open-questions.md)

---

## Locked @ 6.1 (amendment defaults)

| ID | Decision | Outcome |
|----|----------|---------|
| **A1** | Email provider for v1 | **Resend** — `NOTIFICATION_PROVIDER=resend`, `RESEND_API_KEY` |
| **A2** | Event shape | **Structured fields** on `Post`: `eventStart`, `eventEnd`, `eventLocation`, `links.map`, `links.facebook` (optional URLs) |
| **A3** | `features.admin` | **Explicit boolean** in `SiteConfig.features`; requires `auth: true` when on |
| **A4** | Submissions inbox | **MVP includes** `GET /api/intake/submissions` + admin inbox UI (email is additive, not substitute) |
| **A5** | Phase 7 first client | **Terrible Gerald's** — tenant `terrible-geralds`, vertical `food-truck`, auth+admin on (see payments below) |

---

## Planned Phase 7 clients — payments (locked 2026-05-29)

One `payment.provider` per site. In-person POS may be a **different** system; only the website provider is configured in GVSN.

### Terrible Gerald's (`terrible-geralds`)

| Field | Value |
|-------|--------|
| Vertical | `food-truck` |
| Website provider | **`square`** — matches existing truck Square account |
| `features.payments` | **On** when public ordering launches; may stay off at first cutover |
| Public checkout | **Yes** (phased) — online orders should appear in Square order flow with in-person queue; validate with live test at `SQUARE_LOCATION_ID` |
| In-person POS | Square at truck (same account; queue/KDS is Square setup + P4-4 wiring) |
| Legacy site copy | Current Astro FAQ says no online ordering — marketing only, not a platform constraint |

**Phase 7 requirement for ordering:** **P4-4** (catalog → cart → checkout) before selling web orders. Square E2E: pay → webhook → `Order` paid.

### Barry O's Tavern (planned; after or parallel TG)

| Field | Value |
|-------|--------|
| Vertical | `bar-restaurant` |
| Website provider | **`stripe`** — ticket SKUs (e.g. Barry Christmas); not bar menu checkout |
| `features.payments` | **On** for ticket products |
| Public checkout | **Yes** — limited catalog (event tickets), not full bar menu |
| In-person POS | Square (or existing bar POS) at tavern — **not** integrated with web Stripe |
| Preset note | `bar-restaurant` seed defaults to Square + staff-only menu; Barry is an intentional override |

---

## P4-7 — Intake email notifications

**Closed in Phase 6.** Implement `server/src/providers/notifications/` with Resend adapter; hook in `createSubmission` after DB write. Fail submission if email fails, or queue+log — **decide at 6.4:** default **log + succeed** (submission not lost) unless `NOTIFICATION_STRICT=true`.

---

## P5-4 — brand-stub vs tenant overrides

Unchanged: L2 in `theme/verticals/*.tokens.ts`; tenant pick/override in Phase 7 client build. Phase 6 does not wire `brand-stub.ts`.

---

## Admin vs platform admin (disambiguation)

| Route | Actor | Phase |
|-------|-------|-------|
| `/admin/*` | Tenant owner (client) | **6** |
| `/__admin/*` | GVS operator | **8** |

---

## Carried to Phase 7 (first client)

| ID | Topic |
|----|--------|
| **P4-4** | Catalog ↔ checkout — **required** for TG public ordering and Barry ticket sales (Phase 7) |
| **P6-1** (visual) | Pick-list workflow when client wants off-menu tokens — see `phase-7-open-questions.md` |

---

## Carried to Phase 8

- Platform operator tenant UI (`/__admin/tenants`)
- Role-based admin (`tenant-owner` vs staff)
- Runtime `site.config` from host (phase 8 change 5)
