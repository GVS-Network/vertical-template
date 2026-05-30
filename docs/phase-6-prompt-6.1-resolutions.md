# Phase 6.1 — Resolutions (operator surface)

**Status:** Confirmed @ Prompt **6.1**  
**Date:** 2026-05-30  
**Prerequisite:** Phase 5 closed @ **v0.6.0**; amendment v1 accepted — [`amendments/phase-plan-amendment-v1.md`](amendments/phase-plan-amendment-v1.md)  
**Phase 6 open index:** [`phase-6-open-questions.md`](phase-6-open-questions.md)

---

## Locked @ 6.1 (amendment defaults — confirmed)

| ID | Decision | Outcome |
|----|----------|---------|
| **A1** | Email provider for v1 | **Resend** — `NOTIFICATION_PROVIDER=resend`, `RESEND_API_KEY`; provider abstraction in `server/src/providers/notifications/` (mirror payments pattern) |
| **A2** | Event shape | **Structured fields** on `Post`: `eventStart`, `eventEnd`, `eventLocation`, `links.map`, `links.facebook` (optional URLs). Reject YAML-frontmatter-only fallback — admin UX and typed queries win |
| **A3** | `features.admin` | **Explicit boolean** in `SiteConfig.features`; requires `features.auth: true` when on; **default `true` when auth is on** in preset/helper logic (explicit off for headless/API-only tenants) |
| **A4** | Submissions inbox | **MVP includes** `GET /api/intake/submissions` (auth, paginated) + PATCH mark `processed` + admin inbox UI. Email is additive, not a substitute for persistence/inbox |
| **A5** | Phase 7 first client | **Terrible Gerald's** — tenant `terrible-geralds`, vertical `food-truck`, auth+admin on (see payments below) |

---

## Scope locked @ 6.1 (explicit deferrals)

| Topic | Phase 6 | Later |
|-------|---------|-------|
| Intake form **definition** editor | Seed via `init-vertical` only | Operator tooling if demand |
| WYSIWYG / block editor | Markdown textarea MVP | Not planned in template core |
| Role-based admin (`tenant-owner` vs staff) | Any authenticated Auth0 user for tenant | Phase 8 platform-admin work |
| Platform operator UI | — | `/__admin/*` Phase 8 only |
| Terrible Gerald's custom public frontend | — | Phase 7 Type C |
| `brand-stub.ts` wiring | — | Phase 7 client build (L2 stays `theme/verticals/*.tokens.ts`) |

---

## Content write API (locked shape for 6.2)

- Endpoints: `POST/PUT /api/content/pages`, `POST/PUT /api/content/posts`
- Auth: existing `writeGuards(siteConfig)` — requires `features.auth: true`
- Status transitions: `draft` | `published` | `archived`
- Public GET: **published only** (list + detail). Service layer already filters; 6.2 audits routes + adds writes
- Tenant scope: `scoped(Model, req)` on all writes

---

## Tenant admin UI (locked MVP for 6.6–6.11)

Sixth feature pack **`admin`**, toggle-mounted at `/admin/*`:

| Screen | API | MVP |
|--------|-----|-----|
| Pages list + editor | content write API | Yes |
| Posts/events list + editor | content write API + event fields | Yes |
| Products/menu list + editor | catalog write API (exists) | Yes |
| Submissions inbox | `GET /api/intake/submissions` + mark processed | Yes |

**Styling:** same CSS variables as public shell — no second theme fork.

---

## P4-7 — Intake email notifications

**Closed in Phase 6** (implement in 6.4). Hook in `createSubmission` after DB write.

| Behavior | Default |
|----------|---------|
| On email failure | **Log + succeed** — submission is not lost |
| Strict mode | `NOTIFICATION_STRICT=true` fails the HTTP request if send fails |
| Recipient | `siteConfig.contact.email` |
| `from` address | Open **P6-5** — lock @ 6.4 (`NOTIFICATION_FROM_EMAIL` or Resend domain default) |

---

## P5-4 — brand-stub vs tenant overrides

Unchanged: L2 in `theme/verticals/*.tokens.ts`; tenant pick/override in Phase 7 client build. Phase 6 does not wire `brand-stub.ts`.

---

## Admin vs platform admin (disambiguation)

| Route | Actor | Phase |
|-------|-------|-------|
| `/admin/*` | Tenant owner (client) | **6** |
| `/__admin/*` | GVS operator | **8** |

Never merge routes or auth models.

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

## Carried to Phase 7 (first client)

| ID | Topic |
|----|--------|
| **P4-4** | Catalog ↔ checkout — **required** for TG public ordering and Barry ticket sales |
| **P7-1** | Pick-list workflow when client wants off-menu tokens — see `phase-7-open-questions.md` |

---

## Carried to Phase 8

- Platform operator tenant UI (`/__admin/tenants`)
- Role-based admin (`tenant-owner` vs staff)
- Runtime `site.config` from host (phase 8 change 5)

---

## Next prompt

**6.2** — Content write service + routes (replace `writeNotReady`); zod schemas; pack tests; audit public GET published-only filter.
