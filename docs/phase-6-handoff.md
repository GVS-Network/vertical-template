# Phase 6 handoff — Operator surface

**Closed:** 2026-05-30 · tag **`v0.7.0`**  
**Verification:** [`phase-6-close-verification.md`](phase-6-close-verification.md)  
**Prompt guide:** [`prompts/phase-6-operator-surface.html`](prompts/phase-6-operator-surface.html)

---

## What's true now

- **Content write API** — `POST/PUT` pages and posts; zod validation; public GET published-only.
- **Post event fields** — `eventStart`, `eventEnd`, `eventLocation`, `links`; admin events UI tags `event` on save.
- **Intake notifications** — `providers/notifications/` + Resend; `getNotificationProvider()` seam; P4-7 closed.
- **Submissions inbox API** — auth-gated list + mark processed.
- **`features.admin` pack** — lazy `/admin/*`; `/api/admin` read proxies; doctor auth/admin/notification checks.
- **Public Markdown** — `client/src/shared/MarkdownBody.tsx` (`react-markdown`).

## Prompt log

| Prompt | Outcome |
|--------|---------|
| **6.1** | Resolutions A1–A5; `phase-6-prompt-6.1-resolutions.md` |
| **6.2** | Content write service + routes; `test:content` smoke |
| **6.3** | Post event metadata on schema + zod |
| **6.4** | Notification provider + Resend; hook in `createSubmission` |
| **6.5** | `GET/PATCH /api/intake/submissions` |
| **6.6** | `features.admin` pack; registry gate; dual SiteConfig |
| **6.7** | `MarkdownBody`; PageRenderer + PostDetail |
| **6.8** | Admin pages CRUD |
| **6.9** | Admin events CRUD; timezone-aware datetimes |
| **6.10** | Admin products CRUD |
| **6.11** | Admin submissions inbox |
| **6.12** | Doctor auth/admin/notification checks; food-truck README self-service note |
| **6.13** | Close verification; tag `v0.7.0`; Phase 7 open questions |

---

## Phase 7 entry

Read [`prompts/phase-7-first-client.html`](prompts/phase-7-first-client.html) and [`phase-7-open-questions.md`](phase-7-open-questions.md).

**Do not rebuild:** admin UI, content writes, intake email, Markdown rendering — all core.

**Terrible Gerald's (planned):** preset `food-truck`, tenant `terrible-geralds`, auth + admin on, Type C public frontend, real content + deploy.
