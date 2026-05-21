# Phase 0.4 — Build docs verification

**Date:** 2026-05-21  
**Folder:** `docs/` (canonical; phase prompt alias `build-docs/`)

## Install status

Doc family was installed in commit `d10fd53`. Prompt 0.4 is a **verify-and-fix** pass, not a re-copy.

| Item | Location | Status |
|------|----------|--------|
| Index | `docs/README.html` | ✓ |
| Three briefs | `docs/platform-concept-brief.html`, `template-architecture-brief.html`, `visual-system-brief.html` | ✓ at `docs/` root (matches README §03 tree; not `docs/briefs/`) |
| Contexts | `docs/contexts/*.html` (4) | ✓ |
| Rules | `docs/rules/*.html` (2) | ✓ |
| Phase prompts | `docs/prompts/phase-*.html` (8) | ✓ |
| Shared CSS | `docs/assets/doc-system.css` (single file) | ✓ |
| Upstream archive | `docs/baseapp-upstream/` | ✓ |

## README §02 link audit

All 17 doc-card `href` targets resolve to existing files.

## `doc-system.css` references

| Path pattern | Files |
|--------------|-------|
| `assets/doc-system.css` | `docs/README.html`, three briefs |
| `../assets/doc-system.css` | `docs/contexts/*`, `docs/rules/*`, `docs/prompts/*` |

**Fix applied:** three briefs previously used only embedded `<style>`; added `<link rel="stylesheet" href="assets/doc-system.css">` before inline blocks (inline retained for brief-specific layout until a future docs-only cleanup).
