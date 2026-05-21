# Prompt 1.1 — Open questions resolved

**Date:** 2026-05-21  
**Template:** v0.1.0  
**Gate:** No SiteConfig or seam code until every item below has an outcome.

Sources: `docs/phase-0-handoff.md`, `docs/inventory.md` §10, `docs/contexts/stack-context.html` §07 (Phase 0 decisions), Phase 0 CHANGELOG close notes.

---

## Phase 0 handoff — `{OPEN_QUESTIONS}` block

### 1. Remove demo User/Item routes and models at Phase 1 start

| Outcome | **Resolve now** |
|---------|-----------------|
| **Decision** | Remove before any `SiteConfig` / `types/site-config.ts` work. First implementation commit in Phase 1 (start of Prompt 1.2): delete `server/src/models/User.ts`, `Item.ts`, `server/src/routes/users.ts`, `items.ts`, client pages `Dashboard`, `Profile`, and related routes; keep `health` and a minimal `Home` shell. |
| **Rationale** | Phase 0 locked this; demo models have no `tenantId` and would fight the phase-1 Type-C threading goal. |
| **Not in 1.1** | No code in this prompt — decision only. |

### 2. Tailwind frozen until Phase 5

| Outcome | **Resolve now** (already locked in Phase 0) |
|---------|---------------------------------------------|
| **Decision** | **Freeze** through Phase 4. Full strip in **Phase 5** with `resolveTokens()` and the token registry. Phase 1 must not add Tailwind classes to new files. |
| **Rationale** | Removing now would leave the UI unstyled with no replacement until Phase 5. |

### 3. Vite `@` alias (`'@': '/src'` absolute path)

| Outcome | **Resolve now** (decision); fix in first Phase 1 code commit |
|---------|--------------------------------------------------------------|
| **Decision** | Change to `path.resolve(__dirname, './src')` in `client/vite.config.ts` in the **same commit as demo removal** (start of 1.2), before adding files under `client/src/types/`. |
| **Evidence** | No `@/` imports in the repo today — dev loop passes without it. Fix is preventive, not urgent for 0.7. |
| **Rationale** | Smallest fix; avoids broken aliases when Phase 1+ adds typed modules. Not SiteConfig work. |

### 4. Auth0 env vars may still be placeholders

| Outcome | **Defer** |
|---------|-----------|
| **Phase** | **Phase 2** (auth feature pack) or first prompt that mounts protected admin routes. |
| **Rationale** | Phase 1 focuses on `SiteConfig` and `tenantId` seams; public/dev shell does not require live Auth0. `doctor` checks keys exist, not credential validity. Configure real Auth0 before testing JWT-protected feature-pack routes. |

---

## Inventory §10 (carried from Phase 0.2)

### 5. Env var naming (`MONGO_URI` / `VITE_API_BASE` vs repo names)

| Outcome | **Drop** |
|---------|----------|
| **Why** | Resolved in Prompt 0.2: `stack-context.html` v0.1.1 documents `MONGODB_URI` and `VITE_API_URL` to match code and `.env.example`. No migration planned. |

### 6. Tailwind removal timing (Phase 0 vs 5)

| Outcome | **Drop** |
|---------|----------|
| **Why** | Duplicate of handoff item #2; locked in `stack-context.html` §07 Phase 0 decisions. |

### 7. Node pin (`.nvmrc` + `engines >= 20`)

| Outcome | **Drop** |
|---------|----------|
| **Why** | Shipped in Prompt 0.5 (`v0.1.0`). Team uses `nvm use` at repo root. |

### 8. Demo `/api/items` through 0.7 then delete

| Outcome | **Drop** |
|---------|----------|
| **Why** | Duplicate of handoff item #1; 0.7 kept for verification; deletion scheduled start of 1.2. |

### 9. Remove `express-jwt`

| Outcome | **Drop** |
|---------|----------|
| **Why** | Removed in Prompt 0.5. |

### 10. Vite alias in 0.7 fixes

| Outcome | **Drop** |
|---------|----------|
| **Why** | 0.7 did not require it (no `@/` usage). Superseded by item #3 above — fix at 1.2 start. |

---

## Phase 0 handoff — surprises (inform Phase 1, not blocking questions)

| Surprise | Outcome |
|----------|---------|
| Still baseapp demo structure | **Resolve now** via demo removal (item #1). |
| No `getSiteConfig` / `tenantId` yet | **Drop** — Phase 1 deliverables, not an open question. |
| Global `client/src/hooks/useApiAuth.ts` | **Defer** — **Phase 2** auth pack or when relocating auth wiring; does not block SiteConfig types. |
| Health returns `{ status: 'ok' }` not `{ ok: true }` | **Drop** — meets Phase 0 acceptance; no change unless ops tooling demands it. |
| Node 25 on dev machine vs `.nvmrc` 20 | **Resolve now** — **Decision:** CI and docs standardize on **Node 20 LTS** per `.nvmrc`; local Node 22–25 acceptable for dev if `doctor` passes. No repo change in 1.1. |

---

## stack-context.html §07 forward-looking (not Phase 0 close — recorded for clarity)

| Question | Outcome | Phase |
|----------|---------|-------|
| React 19 / Vite 6 / Mongoose bumps | **Defer** | Ad-hoc when baseapp upstream or security requires; update `stack-context` then. |
| Auth0 → Clerk/WorkOS | **Defer** | Post–Phase 2; concept brief §06. |
| Third payment adapter (Toast/Clover) | **Defer** | Only if brief adds; after Stripe/Square in **Phase 3**. |

---

## Type A / B / C in Phase 1 so far

**None yet.** Prompt 1.1 is documentation only. First taxonomy work begins Prompt 1.2.

---

## Updated `{OPEN_QUESTIONS}` for session-starter (after 1.1)

```
none — Phase 0 carry-forward closed in docs/phase-1-prompt-1.1-resolutions.md. Next code: demo removal + vite alias (1.2 prep), then SiteConfig type.
```

## Phase 1 implementation order (post-1.1)

1. **1.2 prep** (one commit): remove demo User/Item surface; fix Vite `@` alias.  
2. **1.2+**: `SiteConfig` type, defaults, seams, `tenantId`, `contract-check` per phase doc.
