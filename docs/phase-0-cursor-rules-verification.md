# Phase 0.3 — Cursor rules verification

**Date:** 2026-05-21  
**Result:** Pass (rules pre-installed at repo root in prior commit; no copy step required)

## Locations

| Path | Status |
|------|--------|
| `/.cursorrules` | Present, 119 lines, git-tracked |
| `/.cursor/rules/*.mdc` | 10 files (00, 10, 20, 30, 40, 50, 60, 70, 80, 99), all git-tracked |
| `build-docs/.cursor/` | N/A — doc bundle uses repo-root paths only |

## Frontmatter check

| File | `description` | `alwaysApply` or `globs` |
|------|---------------|--------------------------|
| 00-project-context.mdc | ✓ | `alwaysApply: true` |
| 10-typescript-conventions.mdc | ✓ | `**/*.ts`, `**/*.tsx` |
| 20-server-conventions.mdc | ✓ | `server/**/*` |
| 30-client-conventions.mdc | ✓ | `client/**/*` |
| 40-feature-packs.mdc | ✓ | `**/features/**/*`, `**/providers/**/*` |
| 50-siteconfig-contract.mdc | ✓ | `**/types/site-config.ts`, `**/types/theme-tokens.ts` |
| 60-visual-system.mdc | ✓ | theme paths + `**/*.css`, `**/*.module.css` |
| 70-multi-tenant-seams.mdc | ✓ | `alwaysApply: true` |
| 80-versioning-and-docs.mdc | ✓ | `alwaysApply: true` |
| 99-claude-collaboration.mdc | ✓ | `alwaysApply: true` |

## Glob overlap

- `10` + `20`/`30` on server/client TS: intentional (scoped rules refine the TS floor).
- `60` `**/*.css` is broad; stacks with `30` on client CSS — intentional for visual-system discipline.
- No two files share an identical glob set without different scope.

## `.gitignore`

- `.cursor/` is **not** ignored — rules version with the repo.
