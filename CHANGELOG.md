# Changelog

All notable changes to the vertical-template project are documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

### Added

- `scripts/doctor.ts` and `npm run doctor` — Node, env key parity, Mongo connectivity (3s timeout).
- Phase 0.7 dev-loop verification (`docs/phase-0-dev-loop-verification.md`) — install, doctor, dev, client 5173, health `/api/health` confirmed.

## [0.1.0] — 2026-05-21

### Added

- Forked [baseapp](https://github.com/misterlinderman/baseapp) into [GVS-Network/vertical-template](https://github.com/GVS-Network/vertical-template).
- Installed `docs/` family (README, three briefs, contexts, rules, phase prompts, `assets/doc-system.css`).
- Installed cursor rules (`.cursorrules` and `.cursor/rules/*.mdc`).
- `docs/inventory.md` — Phase 0 baseapp inventory.
- `.nvmrc` — Node 20.

### Changed

- `docs/contexts/stack-context.html` reconciled against actual fork state (v0.1.1); Phase 0 decisions locked (Tailwind strip in Phase 5; demo routes through 0.7).
- Root, client, and server `package.json` identity → `vertical-template` @ `0.1.0`.
- Node engine requirement → `>=20.0.0`.
- Archived upstream baseapp markdown under `docs/baseapp-upstream/`.

### Removed

- Unused `express-jwt` server dependency (auth uses `express-oauth2-jwt-bearer` only).
