# Phase plan amendment v1 — Operator surface before first client

**Status:** Accepted · **Date:** 2026-05-29 · **Applied:** 2026-05-29  
**Trigger:** Terrible Gerald's migration requires Storyblok/Getform replacement. Operator decision: fundaments belong in **core platform**, not per-client Type C.  
**Prerequisite state:** Phase 5 closed @ template **v0.6.0** (2026-05-21).

---

## 1. Decision: renumber, do not extend Phase 5

| Option | Verdict | Why |
|--------|---------|-----|
| **A. Phase 5 sub-phases (5.11–5.N)** | Reject | Phase 5 is closed and tagged. Sub-phases imply reopening a finished phase and confuse version lineage (`v0.6.0` already means "visual system complete"). |
| **B. Insert Phase 6, renumber 6→7 and 7→8** | **Accept** | Clean semantics. New work is platform capability, not visual-system debt. First-client and multi-tenant phases shift forward unchanged in *intent*, lighter in *scope*. |

### Revised phase map

| Old # | New # | Name | Template tag target |
|-------|-------|------|---------------------|
| 0–5 | 0–5 | *(unchanged, closed)* | through **v0.6.0** |
| — | **6** | **Operator surface** *(new)* | **v0.7.0** |
| 6 | **7** | First client | **v0.8.0** (+ `v0.8.0-client-<slug>`) |
| 7 | **8** | Multi-tenant jump | **v1.0.0** |

### Disambiguation (critical)

Two different admin surfaces — do not merge in docs or code:

| Surface | Route | Actor | Phase |
|---------|-------|-------|-------|
| **Tenant admin** | `/admin/*` | Business owner (TG edits menu, events, pages) | **New Phase 6** |
| **Platform admin** | `/__admin/tenants`, `/__admin/ops` | GVS operator (create tenants, fleet ops) | **Phase 8** (was 7) |

---

## 2. What new Phase 6 delivers

Minimum platform capabilities every client build will need:

### 2.1 Content write API

Today: `GET /api/content/pages/:slug`, `GET /api/content/posts` — writes return **501**.

Deliver:

- `POST/PUT /api/content/pages` and `POST/PUT /api/content/posts` with zod validation
- Auth-gated via existing `writeGuards(siteConfig)` (requires `features.auth: true` on tenant)
- Status transitions: `draft` | `published` | `archived`
- Public GET unchanged — only published records visible to anonymous clients

### 2.2 Event-shaped posts (Storyblok replacement)

Storyblok events map to **Post** records with `tags: ['event']`.

Deliver:

- Optional structured fields on Post (recommended): `eventStart`, `eventEnd`, `eventLocation`, `links: { map?, facebook? }` — **Type A** schema extension, justified by food-truck + bar-restaurant verticals
- Alternative (defer structured fields): YAML frontmatter in `body` parsed at render — document as fallback only if operator rejects schema change
- Public: `GET /api/content/posts?tag=event` (already exists)

### 2.3 Intake email notifications (P4-7 closure)

Today: submissions persist; `createSubmission` has `TODO(later): intake-notifications`.

Deliver:

- Provider abstraction mirroring payments pattern: `server/src/providers/notifications/` (email adapter first — Resend or SendGrid; env-driven)
- On successful submission: email `siteConfig.contact.email` with formatted field summary
- Env: `NOTIFICATION_PROVIDER`, provider API key — document in `stack-context.html`
- Optional: `processed` flag + admin inbox (see 2.5)

### 2.4 Public Markdown rendering

Today: `PageRenderer` / `PostDetail` display raw Markdown as pre-wrapped text.

Deliver:

- Shared `MarkdownBody` component (client) using a single allowed renderer (`marked` or `react-markdown` with strict allowlist)
- Add dependency → `stack-context.html` §03

Without this, content editing is technically functional but publicly useless.

### 2.5 Tenant admin UI

New client feature area — **`features/admin`** (sixth pack, auth-gated, zero surface when off):

| Screen | API backing | MVP |
|--------|-------------|-----|
| Pages list + editor | content write API | Required |
| Posts/events list + editor | content write API + event fields | Required |
| Products/menu list + editor | catalog write API (already exists) | Required |
| Form submissions inbox | new `GET /api/intake/submissions` (auth) | Required |
| Form definition editor | `PUT /api/intake/forms/:slug` | **Defer** — operator seeds forms via `init-vertical`; TG fields stable at launch |

**SiteConfig:** add `features.admin: boolean` — default `true` when `auth` is on; explicit off for headless/API-only tenants.

**Auth model (Phase 6):** any authenticated Auth0 user for the tenant may access `/admin`. Role-based restriction (`tenant-owner` vs staff) deferred to Phase 8 platform-admin work.

**Styling:** admin uses same CSS variables as public shell — no second theme fork.

### 2.6 Auth as prerequisite for self-service

Food-truck preset ships `auth: false`. Amendment assumes:

- Tenants requiring self-service enable `features.auth: true` + `features.admin: true` in `site.config.ts` (Type C per build until Phase 8 runtime config)
- `doctor.ts` warns when `admin` is on but `auth` is off
- Terrible Gerald's tenant config: auth on, payments off

---

## 3. Prompt sequence — Phase 6 (Operator surface)

Target file: `docs/prompts/phase-6-operator-surface.html` *(to be created)*.

| Prompt | Owner | Deliverable |
|--------|-------|-------------|
| **6.1** | CLAUDE | Carry-forward: resolve P4-7 provider choice, Post event fields yes/no, `features.admin` shape. Write `docs/phase-6-prompt-6.1-resolutions.md`. |
| **6.2** | CLAUDE | Content write service + routes (replace `writeNotReady`). Tests. |
| **6.3** | CLAUDE | Post event metadata (if 6.1 approved) + zod + migration note for existing seeds. |
| **6.4** | CLAUDE | Notification provider interface + email adapter + hook in `createSubmission`. Env examples. |
| **6.5** | CLAUDE | `GET /api/intake/submissions` (auth, paginated, tenant-scoped). Mark submission processed. |
| **6.6** | CLAUDE | `features.admin` pack: server registry gate + client route table. `SiteConfig` dual-file update. |
| **6.7** | CLAUDE | `MarkdownBody` on public PageRenderer + PostDetail. |
| **6.8** | CLAUDE | Admin UI: pages CRUD. |
| **6.9** | CLAUDE | Admin UI: posts/events CRUD. |
| **6.10** | CLAUDE | Admin UI: products CRUD (wrap existing catalog API). |
| **6.11** | CLAUDE | Admin UI: submissions inbox. |
| **6.12** | CLAUDE | `doctor.ts`: auth+admin+notification env checks. Update preset READMEs (food-truck auth note). |
| **6.13** | CLAUDE | Close phase: verification doc, CHANGELOG, tag **v0.7.0**, open questions for Phase 7. |

**Estimated duration:** 2–3 weeks focused build (matches platform investment, not client-specific UI).

---

## 4. Impact on renumbered phases

### Phase 7 — First client (was Phase 6)

**Removed from first-client scope** (now platform baseline):

- Building admin UI from scratch
- Implementing content write API
- Implementing intake email
- Closing P4-7

**Still in scope:**

- Client brief + `init:vertical`
- Real content seed (pies, copy, images)
- Brand picks (`theme/tenants/<client>.*`)
- **Custom public frontend** (Terrible Gerald's Astro port — Type C)
- Staging → production cutover, runbook, discoveries log

**Revised acceptance criteria additions:**

- Client owner can log into `/admin` and edit menu, events, pages without developer
- Test booking form delivers email to client contact address
- Payment live-mode criterion **N/A** when `features.payments: false` — document in discoveries

**Prerequisite line change:**

> Phase **6** closed @ **v0.7.0**. Operator surface end-to-end.

### Phase 8 — Multi-tenant (was Phase 7)

No structural change to the six discrete changes. Update internal cross-refs only:

- Prerequisites: Phase **7** closed @ **v0.8.0**
- Change 5 (`/__admin/tenants`) remains **platform operator** — distinct from Phase 6 `/admin`
- Phase 8 prompt 8.1 audit includes Phase **7** client tenant

---

## 5. Brief revision proposals (Thesis — require approval before edit)

### 5.1 `template-architecture-brief.html` §07

**Current:** "No CMS UI yet. The admin UI for editing pages grows on each client build, then graduates back into core."

**Proposed:** "Tenant admin UI (`/admin`, Phase 6) ships in core before the first client engagement. Platform operator admin (`/__admin`, Phase 8) remains separate. Content pack write endpoints are implemented in Phase 6, not deferred to client builds."

### 5.2 `template-architecture-brief.html` §03 feature packs

**Proposed:** Add sixth pack row: **`admin`** — toggle-mounted; requires `auth`; provides tenant-scoped CMS for pages, posts, catalog, submission inbox. Not customer-facing commerce.

### 5.3 `platform-concept-brief.html` (optional, minor)

Clarify that "productized service" stage includes **owner-operable sites** (self-service content + lead capture) before multi-tenant fleet management — aligns GTM with Phase 6/7 ordering.

---

## 6. Amendment document checklist

Documents to **create**:

| File | Purpose |
|------|---------|
| `docs/amendments/phase-plan-amendment-v1.md` | This document |
| `docs/amendments/README.md` | Amendment index |
| `docs/prompts/phase-6-operator-surface.html` | Full prompt guide — **created** |
| `docs/phase-6-prompt-6.1-resolutions.md` | Locked decisions at 6.1 kickoff |
| `docs/phase-6-open-questions.md` | **Replace** current file — rename old to `docs/phase-7-open-questions.md` first |
| `docs/phase-6-close-verification.md` | Created at phase close |
| `docs/phase-6-handoff.md` | Handoff to first client |

Documents to **rename**:

| From | To |
|------|-----|
| `docs/prompts/phase-6-first-client.html` | `docs/prompts/phase-7-first-client.html` |
| `docs/prompts/phase-7-multi-tenant.html` | `docs/prompts/phase-8-multi-tenant.html` |
| `docs/phase-6-open-questions.md` | `docs/phase-7-open-questions.md` |

Documents to **update** (same PR as renames + new phase-6 prompt):

| File | Change |
|------|--------|
| `docs/README.html` | Phase cards 6/7/8; status §06; docs version bump (minor) |
| `docs/contexts/glossary.html` | `admin` pack, tenant admin vs platform admin, build-doc phases 0–8 |
| `docs/contexts/session-starter.html` | Phase list, variant for phase 6 work |
| `docs/contexts/repo-context.html` | `features/admin/` in file map; template @ v0.6.0 → next v0.7.0 |
| `docs/contexts/stack-context.html` | Email provider env vars; markdown renderer dep |
| `.cursor/rules/00-project-context.mdc` | Phase awareness 0–8 |
| `CHANGELOG.md` | `[Unreleased]` Thesis + Docs entries |
| `verticals/food-truck/README.md` | Note auth+admin for self-service tenants |
| `server/src/features/content/README.md` | Write API implemented (remove 501 note) |
| `server/src/features/intake/README.md` | Create if missing — notifications documented |

Documents **not** edited (historical):

- `docs/phase-5-close-verification.md`
- `docs/prompts/phase-5-visual-system.html`
- All phase 0–5 resolution/verification files

---

## 7. Version and tagging protocol

| Milestone | Template tag | Docs version |
|-----------|--------------|--------------|
| Current | `v0.6.0` | `v0.6.0` |
| Phase 6 complete | **`v0.7.0`** | **`v0.7.0`** |
| Phase 7 (TG live) | `v0.8.0` + `v0.8.0-client-terrible-geralds` | patch bump if doc-only follow-ups |
| Phase 8 (multi-tenant) | **`v1.0.0`** | minor/major per brief edits |

---

## 8. Code seams (for implementers)

```
server/src/features/admin/          # new pack — routes aggregate or proxy to content/catalog/intake
server/src/features/content/        # write handlers replace writeNotReady
server/src/features/intake/         # notifications hook + list submissions
server/src/providers/notifications/ # email adapter (mirror providers/payments pattern)
client/src/features/admin/          # /admin/* routes + editors
client/src/shared/MarkdownBody.tsx  # public + admin preview
```

**SiteConfig addition** (dual-file, contract-checked):

```ts
features: {
  catalog: boolean;
  content: boolean;
  intake: boolean;
  payments: boolean;
  auth: boolean;
  admin: boolean;  // new — default true when auth on (discuss at 6.1)
}
```

---

## 9. Open questions for operator (approve at amendment acceptance)

| ID | Question | Default if silent |
|----|----------|-------------------|
| **A1** | Email provider for v1 | Resend (simple API, good DX) |
| **A2** | Structured Post event fields vs frontmatter | Structured fields (better admin UX) |
| **A3** | `features.admin` explicit boolean vs implicit when auth on | Explicit boolean |
| **A4** | Submissions inbox in MVP vs email-only | Both — inbox is cheap once list API exists |
| **A5** | Terrible Gerald's as Phase 7 first client | Yes — codename `terrible-geralds` |

---

## 10. Execution order (operator workflow)

1. **Review and approve** this amendment + brief revision proposals (§5).
2. **Rename** phase 6/7 prompt files and open-questions files (git mv).
3. **Draft** `phase-6-operator-surface.html` from §3 prompt table.
4. **Update** cross-ref docs (§6 matrix) in one docs PR — no code yet.
5. **Run Phase 6 prompts** 6.1 → 6.13; tag `v0.7.0`.
6. **Begin Phase 7** with Terrible Gerald's brief — custom public frontend only; admin is already core.

---

## 11. What this amendment explicitly does not do

- Does not add a fifth vertical
- Does not implement platform operator admin early (still Phase 8)
- Does not build WYSIWYG / block editor (Markdown textarea is Phase 6 MVP)
- Does not implement intake form *definition* editor (seed + operator for v1)
- Does not collapse single-tenant deploy (still Phase 7 per client until Phase 8)
