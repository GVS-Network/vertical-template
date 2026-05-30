# Open questions for Phase 6 (Operator surface)

**Status:** Prompt **6.1** confirmed (2026-05-30). Phase 5 closed @ **v0.6.0**. Amendment v1 **accepted**.  
**Prerequisite:** Visual system — [`phase-5-close-verification.md`](phase-5-close-verification.md)  
**Phase prompt:** [`prompts/phase-6-operator-surface.html`](prompts/phase-6-operator-surface.html)  
**Resolutions @ 6.1:** [`phase-6-prompt-6.1-resolutions.md`](phase-6-prompt-6.1-resolutions.md)

---

## Resolved @ 6.1

| ID | Topic | Outcome |
|----|--------|---------|
| **A1** | Notification provider | Resend + `providers/notifications/` abstraction |
| **A2** | Event fields on Post | Structured schema extension (not frontmatter-only) |
| **A3** | `features.admin` | Explicit boolean; default `true` when auth on; requires auth when on |
| **A4** | Submissions inbox in MVP | Yes — list API + admin UI + email |
| **A5** | Phase 7 first client | Terrible Gerald's (`terrible-geralds`, `food-truck`) |
| **P6-4** | Public GET draft leakage | Audited @ 6.2 — service + controllers published-only; `status` query ignored |
| **P6-6** | Event datetime timezone | Store UTC in Mongo (`Date` from ISO); display via `siteConfig.locale.timezone` in admin UI @ 6.9 |

---

## Resolved @ 6.4

| ID | Topic | Outcome |
|----|--------|---------|
| **P4-7** | Intake email | `providers/notifications/` + Resend; hook in `createSubmission` |
| **P6-2** | `NOTIFICATION_STRICT` | Default log + succeed; `NOTIFICATION_STRICT=true` → 502 on send failure |
| **P6-5** | Resend `from` address | `NOTIFICATION_FROM_EMAIL` env; fallback `onboarding@resend.dev` (sandbox) |
| **P6-7** | Missing `contact.email` | Skip send + warn; submission saved; doctor warns when intake on @ **6.12** |

---

## Resolved @ 6.7

| ID | Topic | Outcome |
|----|--------|---------|
| **P6-3** | Markdown renderer | **`react-markdown`** — safe defaults (no raw HTML); `client/src/shared/MarkdownBody.tsx` |

---

## Resolved @ 6.12

| ID | Topic | Outcome |
|----|--------|---------|
| **P6-7** | Doctor for missing `contact.email` | `scripts/doctor.ts` warns when `features.intake` on and `contact.email` unset |

---

## Open during Phase 6 build

*(none — admin UI prompts 6.8–6.11 remain implementation work, not open decisions)*

---

## Carried to Phase 7 (first client)

| ID | Topic |
|----|--------|
| **P4-4** | Catalog ↔ checkout |
| **P7-1** | Pick list doesn't offer what client wants (visual workflow) |

---

## Phase 6 scope reminders

- **Platform work only** — no Terrible Gerald's custom frontend in this phase (that's Phase 7 Type C).
- **Sixth feature pack** `admin` — toggle-mounted; zero surface when off.
- **Tag target** `v0.7.0` at phase close.

---

## Resolved — do not re-litigate

- Phase plan renumber: 6 operator → 7 first client → 8 multi-tenant — `amendments/phase-plan-amendment-v1.md`
- Opinionated brand per vertical — Phase 5.1
- Dual payment provider per site — rejected @ v0.4.0
- Structured Post event fields vs frontmatter — structured @ 6.1
- Intake form definition editor — defer; seed-only @ 6.1
- WYSIWYG admin — Markdown textarea MVP @ 6.1
- Intake email (P4-7) — closed @ 6.4
- Markdown renderer (P6-3) — `react-markdown` @ 6.7
