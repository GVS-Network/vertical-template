# Open questions for Phase 5 (Visual system)

**Status:** Phase 4 closed @ **v0.5.0** (2026-05-21).  
**Prerequisite:** All four vertical presets ship real seed copy; `brand-stub.ts` is empty until Phase 5 fills token overrides.

---

## P5-1 — Brand test case: which preset goes first?

Phase 5 needs one preset whose **brand identity is closest to "ready"** — the first full `theme.preset.ts` (or `brand-stub.ts` values) and the contrast-validator golden path.

| Candidate | Case for "ready" | Case against |
|-----------|------------------|--------------|
| **`screen-printer`** | Strongest operator knowledge; `askanddeliverwebapp` is the live reference for quote → invoice → Stripe; Inkline seed copy is production-shaped, not lorem. | Visual brief describes screen-printer as "graphic" — may need more design iteration than a food vertical. |
| **`bar-restaurant`** | Phase 5 prompt draft already specifies warm, low-light, ink-on-cream — clearest **visual** brief before tokens exist. | Less production history in-repo than print; Square staff-only posture is simpler commerce surface. |
| **`food-truck`** | High-contrast mobile brand is easy to validate (contrast, punchy accent). | Schedule/location complexity is content, not theme — weaker first token story. |
| **`farm-source`** | Most packs on; stress-tests auth + public checkout in UI. | Earthy farm palette is well-specified but commerce UI (cart, stock) is not wired — theme work risks coupling to unfinished checkout UX (P4-4 carry-forward). |

**Recommendation for 5.1 discussion:** Start token work on **`screen-printer`** (operator + agency alignment), use **`bar-restaurant`** as the second palette pass to prove vertical token files diverge correctly. Lock the choice in Prompt 5.1 before implementing `resolveTokens`.

---

## Carried forward from Phase 4

| ID | Topic | Notes |
|----|--------|--------|
| **P4-3** | Square inventory sync trigger | Cron vs catalog mutation vs manual — first hook when farm/bar/truck write paths land |
| **P4-4** | Catalog ↔ checkout | Replace demo `CheckoutButton` line items with seeded catalog products |
| **P4-5** | Square POS read-sync | Still out of scope; thesis-level |
| **P4-7** | Intake email notifications | Deferred from 2.6 |

---

## Phase 5 scope reminders (from visual brief)

- Four-layer token resolution: foundation → vertical → tenant pick → tenant override.
- WCAG contrast validator in CI + doctor for resolved tokens.
- `brand-stub.ts` → real overrides per vertical; no hardcoded hex outside `theme/`.
- Client still reads `defaultSiteConfig` in Navbar/Home until phase 7 runtime config — theme work may need a small **bound-tenant display seam** (flag in 5.1 if walk tests require it).

---

## Resolved — do not re-litigate

- Phase 4 build order, provider defaults, staggered presets — `docs/phase-4-prompt-4.1-resolutions.md`
- Dual payment provider per site — rejected @ v0.4.0
