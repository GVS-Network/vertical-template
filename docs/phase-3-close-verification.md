# Phase 3.7 — Close verification

**Date:** 2026-05-21  
**Tag:** `v0.4.0`

## Doc-update pass

- [x] `CHANGELOG.md` — `[0.4.0]` with WebhookEventLog migration note
- [x] `package.json` (root, client, server) → `0.4.0`
- [x] `docs/contexts/repo-context.html` §05 — payments/providers, webhook-event-log, scripts
- [x] `docs/contexts/glossary.html` — `provider`, `WebhookEventLog`
- [x] `docs/contexts/stack-context.html` — stripe 17.7.0, square 43.2.1
- [x] `docs/phase-4-open-questions.md` — P4-1 go-to-market / provider defaults
- [x] `docs/phase-3-handoff.md`, build docs `v0.4.0`

## Fresh-clone test

**Clone:** `/tmp/vertical-template-fresh-clone-v040-*` at tag `v0.4.0`.

| Step | Result |
|------|--------|
| `npm run install:all` | Pass |
| `npm run contract:check` | Pass |
| `npm run build` | Pass (client + server) |
| `npm run test:registry` | Pass |
| `npm run test:pack-compliance` | Pass |
| `npm run test:webhook-idempotency` | Pass (requires filled `server/.env` + MongoDB) |
| `npm run doctor` | Pass with operator-filled `server/.env`; fails on placeholders only |

Operator loop: copy `server/.env` + `client/.env`, set `PAYMENT_PROVIDER` and provider keys, then `npm run doctor && npm run dev`.
