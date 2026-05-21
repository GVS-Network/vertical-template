# Changelog

All notable changes to the vertical-template project are documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

### Added

- `docs/inventory.md` — Phase 0.1 baseapp inventory (read-only audit).
- Build documentation family under `docs/` (README, contexts, rules, phase prompts, three briefs).
- Vertical-template cursor rules (`.cursorrules` and `.cursor/rules/*.mdc`).
- Archived upstream baseapp markdown docs under `docs/baseapp-upstream/`.

### Changed

- `docs/contexts/stack-context.html` v0.1.0 → v0.1.1 — reconciled with fork reality per `docs/inventory.md`: env var names (`MONGODB_URI`, `VITE_API_URL`), pinned package versions, split installed vs planned scripts/deps, Tailwind + `express-jwt` flagged “to remove in phase 0”, demo models noted as pre–Phase 1 legacy.

## [0.1.0] — 2026-05-21

### Added

- Forked [baseapp](https://github.com/misterlinderman/baseapp) into GVS-Network/vertical-template.
- Installed build-docs family and cursor rules (Phase 0 in progress — dev loop verification pending).
