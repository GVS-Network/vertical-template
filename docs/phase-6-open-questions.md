# Open questions for Phase 6 (Operator surface)

**Status:** Phase 5 closed @ **v0.6.0** (2026-05-29). Amendment v1 **accepted**.  
**Prerequisite:** Visual system — [`phase-5-close-verification.md`](phase-5-close-verification.md)  
**Phase prompt:** [`prompts/phase-6-operator-surface.html`](prompts/phase-6-operator-surface.html)  
**Resolutions @ 6.1:** [`phase-6-prompt-6.1-resolutions.md`](phase-6-prompt-6.1-resolutions.md)

---

## Resolved @ 6.1

| ID | Topic | Outcome |
|----|--------|---------|
| **A1** | Notification provider | Resend |
| **A2** | Event fields on Post | Structured schema extension |
| **A3** | `features.admin` | Explicit boolean |
| **A4** | Submissions inbox in MVP | Yes |
| **P4-7** | Intake email | Implement in Phase 6 |

---

## Open during Phase 6 build

| ID | Topic | Notes |
|----|--------|--------|
| **P6-2** | `NOTIFICATION_STRICT` | Log-and-succeed vs fail submission on email error — lock @ 6.4 |
| **P6-3** | Markdown renderer | `marked` vs `react-markdown` — prefer smallest bundle with safe defaults @ 6.7 |
| **P6-4** | Public GET draft leakage | Confirm list/detail endpoints filter `status: published` only @ 6.2 |

---

## Carried to Phase 7 (first client)

| ID | Topic |
|----|--------|
| **P4-4** | Catalog ↔ checkout |
| **P7-1** | Pick list doesn't offer what client wants (was P6-1 in old numbering) |

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
