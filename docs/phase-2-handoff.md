# Phase 2 handoff — Feature packs (v0.3.0)

**Closed:** 2026-05-21 · tag `v0.3.0`

## What's true now

- Five feature packs on server and client: `catalog`, `content`, `intake`, `payments`, `auth`.
- Boot-time registry gate (`server/src/features/registry.ts`, `client/src/features/registry.tsx`) — disabled packs never import; routes **404**.
- Pack pattern: `server/src/features/_pack-pattern.md`; compliance: `docs/phase-2-pack-compliance-audit.md`.
- All pack Mongoose schemas use `tenantId`; queries use `scopedForTenant` (services/seeds) or `tenantId` from `req.siteConfig` in controllers.
- `shared/write-guards.ts` — JWT on catalog/content writes when `features.auth` is on.
- Payments: `Order` model, `POST /api/payments/checkout/intent` returns **501** (`PAYMENTS_NOT_IMPLEMENTED`) until Phase 3.
- Auth: `requireAuth`, `GET /api/auth/me`, client `LoginButton` / `LogoutButton` / `useSession`.
- Smokes: `npm run test:registry`, `npm run test:pack-compliance` (uses `SKIP_PACK_SEEDS=1`).

## Prompt log

| Prompt | Outcome |
|--------|---------|
| **2.1** | `docs/phase-2-prompt-2.1-resolutions.md` |
| **2.2** | `_pack-pattern.md` |
| **2.3** | Registry + `createApp()` |
| **2.4–2.8** | Full packs (catalog → auth) |
| **2.9** | Compliance audit + fixes |
| **2.10** | Docs + `v0.3.0` tag |

## Phase 3 entry

Read `docs/prompts/phase-3-payments.html` (when present) and **`docs/phase-3-open-questions.md`** before implementing adapters. Phase 3 fills `server/src/providers/` and wires `getPaymentProvider(siteConfig)` — not direct SDK calls from the payments pack router.
