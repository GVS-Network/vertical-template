# Build-phase amendments

Amendments to the phased build sequence in `docs/prompts/`. Each amendment is a deliberate change to **when** work happens or **what** a phase delivers — not retroactive edits to closed phase verification docs.

| Amendment | Status | Effect |
|-----------|--------|--------|
| [phase-plan-amendment-v1.md](./phase-plan-amendment-v1.md) | **Accepted** (2026-05-29) | Inserts **Phase 6 · Operator surface**; renumbers First Client → 7, Multi-Tenant → 8 |

## How to apply an amendment

1. Operator approves the amendment (and any linked brief revisions).
2. Create/rename phase prompt HTML files per the amendment checklist.
3. Update cross-references listed in the amendment's **Doc ripple matrix**.
4. Bump `docs/README.html` docs version (minor).
5. Append **Thesis** + **Docs** entries to `CHANGELOG.md` `[Unreleased]`.
6. Do **not** rewrite closed `phase-N-close-verification.md` files — they remain historical record of what shipped at each tag.

## Naming convention

- `phase-plan-amendment-vN.md` — master plan change (phase insert, renumber, version targets).
- Future: `phase-6-operator-surface-resolutions.md` — decisions locked during the new phase (same pattern as `phase-5-prompt-5.1-resolutions.md`).
