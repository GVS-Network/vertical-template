# Phase 6 handoff — Operator surface

**Status:** Not started (docs/amendment applied 2026-05-29).  
**Target tag:** `v0.7.0`  
**Prompt guide:** [`prompts/phase-6-operator-surface.html`](prompts/phase-6-operator-surface.html)

---

## What Phase 7 (first client) inherits

When Phase 6 closes, every client build gets:

- Content write API (pages + posts)
- Post event metadata + public event listing
- Intake email on submission (Resend)
- `GET /api/intake/submissions` for admin inbox
- `features.admin` pack at `/admin/*` (auth required)
- Public `MarkdownBody` rendering

Phase 7 adds: real tenant data, brand picks, **custom public frontend**, deploy, runbook.

---

## Start here

1. Run prompt **6.1** — resolutions locked in [`phase-6-prompt-6.1-resolutions.md`](phase-6-prompt-6.1-resolutions.md).
2. Proceed **6.2 → 6.13** in order.

---

## Terrible Gerald's (Phase 7)

- Preset: `food-truck`
- Tenant: `terrible-geralds`
- `features.auth: true`, `features.admin: true`, `features.payments: false`
- Replace Storyblok/Getform with platform APIs + admin
