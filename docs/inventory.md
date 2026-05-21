# Phase 0 — Repository Inventory

**Generated:** 2026-05-21  
**Repo:** GVS-Network/vertical-template (fork of misterlinderman/baseapp)  
**Session:** Phase 0 · Prompt 0.1 (read-only)  
**Compared against:** `docs/contexts/stack-context.html` v0.1.0

---

## 1. Stack & versions (from `package.json`, not memory)

### Root (`package.json`)

| Field | Actual value |
|-------|----------------|
| `name` | `baseapp` ← still upstream name |
| `version` | `1.0.0` |
| `engines.node` | `>=18.0.0` |
| `repository.url` | `https://github.com/misterlinderman/baseapp.git` ← still upstream |
| Root devDeps | `concurrently@^8.2.2`, `prettier@^3.2.5` |

**Root scripts present:** `dev`, `dev:client`, `dev:server`, `build`, `build:client`, `build:server`, `start`, `install:all`, `lint`, `format`, `clean`

**Root scripts absent (stack-context §02 claims):** `init:vertical`, `contract:check`, `doctor`, `test`, `typecheck`

### Client (`client/package.json`)

| Package | Version |
|---------|---------|
| react / react-dom | ^18.2.0 |
| react-router-dom | ^6.22.3 |
| @auth0/auth0-react | ^2.2.4 |
| axios | ^1.6.8 |
| vite | ^5.2.0 |
| typescript | ^5.4.3 |
| tailwindcss | ^3.4.3 |
| @vitejs/plugin-react | ^4.2.1 |

### Server (`server/package.json`)

| Package | Version |
|---------|---------|
| express | ^4.19.2 |
| mongoose | ^8.3.1 |
| express-oauth2-jwt-bearer | ^1.6.0 |
| express-jwt | ^8.4.1 ← **installed but unused** (auth uses oauth2-jwt-bearer) |
| jwks-rsa | ^3.1.0 |
| dotenv, cors, helmet, morgan | present |
| typescript | ^5.4.5 |
| nodemon, ts-node | dev |

**Not installed (stack-context §03 “already approved”):** `zod`, `stripe`, `square`, `cloudinary`, `vitest`, `express-async-errors`

### Runtime ports (from code/config)

| Service | Port |
|---------|------|
| Vite dev server | 5173 (`client/vite.config.ts`) |
| Express API | 3001 (default in `server/src/index.ts`) |
| Vite → API proxy | `/api` → `http://localhost:3001` |

### TypeScript

- Both sides: `strict: true`
- Both sides: `@/*` → `src/*` in tsconfig `paths`
- **Client Vite alias bug:** `vite.config.ts` sets `'@': '/src'` (absolute path) instead of `path.resolve(__dirname, 'src')` — may break `@/` imports at build/dev time depending on cwd

### Node version

- **No `.nvmrc` at repo root** (stack-context says “matching `.nvmrc` at repo root”)
- Local machine during inventory: Node 25.x available; root `engines` allows `>=18`

---

## 2. Top-level folders (one-line purpose)

| Path | Purpose |
|------|---------|
| `client/` | Vite + React 18 SPA; Auth0 provider; Tailwind styling; demo pages (Home, Dashboard, Profile) |
| `server/` | Express 4 API; Mongoose; Auth0 JWT middleware; demo routes (`health`, `users`, `items`) |
| `docs/` | Vertical-template **build documentation** (HTML briefs, contexts, phase prompts, rules) + `inventory.md` |
| `docs/baseapp-upstream/` | Archived baseapp markdown docs (README, SHOPIFY_AUTH, architecture) from fork |
| `.cursor/rules/` | Ten scoped Cursor rule files (`00`–`99`, no `baseapp.mdc`) |
| `.git/` | Git metadata; `origin` → GVS-Network/vertical-template |
| Root config | `package.json`, `package-lock.json`, `.prettierrc`, `.gitignore`, `.env.example` (minimal), `CHANGELOG.md` |
| `README.md` | Upstream MERN starter guide (now has pointer to `docs/README.html`) |
| `SETUP.md` | Upstream setup walkthrough |
| `AGENTS.md` | Upstream AI orientation (still describes “Base MERN template”) |

**Not present yet (expected in later phases):** `verticals/`, `scripts/`, `server/src/features/`, `server/src/providers/`, `client/src/features/`, `client/src/theme/`, per-build `site.config.ts` / `site.theme.ts`

---

## 3. Server layout (`server/src/`)

```
server/src/
├── index.ts              # Express app bootstrap, mounts routes, connects Mongo
├── config/database.ts    # Mongoose connect via MONGODB_URI
├── middleware/
│   ├── auth.ts           # express-oauth2-jwt-bearer (checkJwt, optionalAuth)
│   └── errorHandler.ts   # createError, asyncHandler, global error middleware
├── models/
│   ├── User.ts           # auth0Id, email, name, picture — no tenantId
│   └── Item.ts           # CRUD demo todos scoped by Auth0 user id — no tenantId
├── routes/
│   ├── health.ts         # GET /api/health, /api/health/detailed
│   ├── users.ts          # JWT-protected /api/users/me
│   └── items.ts          # JWT-protected CRUD /api/items
└── types/index.ts        # placeholder / minimal shared types
```

**Observations:**

- No `getSiteConfig(req)` seam, no `SiteConfig` type, no feature-pack mounts
- Error handling uses custom `asyncHandler` + `errorHandler`; **not** `express-async-errors`
- Health endpoint exists (`GET /api/health` returns `{ status: 'ok', ... }`) — satisfies Phase 0.7 check without new code
- Mongo env key in code: **`MONGODB_URI`** (not `MONGO_URI` as stack-context §04 lists)

---

## 4. Client layout (`client/src/`)

```
client/src/
├── main.tsx              # Auth0Provider + BrowserRouter
├── App.tsx               # Routes: /, /dashboard, /profile
├── pages/                # Home (marketing hero), Dashboard, Profile
├── components/           # Layout, Navbar, ProtectedRoute, Loading
├── hooks/useApiAuth.ts   # Attaches Auth0 token to axios
├── services/api.ts       # axios instance, VITE_API_URL base
├── styles/index.css      # Tailwind @tailwind + @apply component classes
└── types/index.ts        # minimal types
```

**Observations:**

- Entire UI is Tailwind utility classes — conflicts with target “CSS variables from resolveTokens(), no Tailwind”
- No `useSiteConfig()`, no feature toggles, no `Custom*.tsx` pages
- Global `hooks/` folder exists — cursor rules prefer hooks beside owning components (convention drift, not blocking Phase 0)

---

## 5. Environment variables (actual vs stack-context)

### Server (`server/.env.example`)

| Key in repo | stack-context §04 | Notes |
|-------------|-------------------|-------|
| `MONGODB_URI` | `MONGO_URI` | **Name mismatch** — code reads `MONGODB_URI` |
| `AUTH0_DOMAIN`, `AUTH0_AUDIENCE` | same | ✓ |
| `PORT`, `NODE_ENV` | same | ✓ |
| `CLIENT_URL` | not listed | production CORS only |
| — | `STRIPE_*`, `SQUARE_*`, `CLOUDINARY_URL`, `TENANT_ID` | not in example yet (expected later) |

**Status:** Operator reports `server/.env` has Mongo connection string configured (Atlas). Auth0 vars likely still placeholders until configured.

### Client (`client/.env.example`)

| Key in repo | stack-context §04 | Notes |
|-------------|-------------------|-------|
| `VITE_API_URL` | `VITE_API_BASE` | **Name mismatch** |
| `VITE_AUTH0_*` | same | ✓ |
| — | `VITE_TENANT_ID` | not present |

### Root (`.env.example`)

- Only `NODE_ENV=development` — minimal stub

---

## 6. Contradictions: `stack-context.html` vs repo reality

| Topic | stack-context claims | Actual in fork |
|-------|---------------------|----------------|
| Node version | Node 20 LTS + `.nvmrc` | `engines >=18`, no `.nvmrc` |
| Mongo env var | `MONGO_URI` | `MONGODB_URI` |
| Client API env | `VITE_API_BASE` | `VITE_API_URL` |
| Styling | No Tailwind; CSS variables | **Tailwind 3** throughout client |
| Root scripts | `doctor`, `init:vertical`, `contract:check`, `test`, `typecheck` | **None** exist |
| Dependencies | zod, vitest, stripe, square, cloudinary approved | **Not installed** |
| Async errors | `express-async-errors` in index | Custom `asyncHandler` only |
| Auth package | `express-oauth2-jwt-bearer` | ✓ used; `express-jwt` dead weight |
| Payments / Cloudinary | Planned adapters | Not present (expected pre–phase 3) |
| `tenantId` on models | Required everywhere | **Absent** on User/Item (expected until phase 1/7) |
| `getSiteConfig(req)` | Single seam | **Absent** (phase 1) |
| Repo/package identity | vertical-template | Still named `baseapp` in package.json + repository URL |

**Aligned with stack-context:**

- MERN split layout (`client/` + `server/` at root)
- `npm run dev` via concurrently
- Vite 5, React 18, React Router 6, Express 4, Mongoose 8
- Auth0 on client (`@auth0/auth0-react`) and server (`express-oauth2-jwt-bearer` wrapper in `middleware/auth.ts`)
- TypeScript strict on both sides
- `@/` path aliases in tsconfig (Vite alias needs fix)

---

## 7. Keep from baseapp (preserve through Phase 0+)

| Area | What to keep | Why |
|------|----------------|-----|
| Dev loop | Root `npm run dev` + concurrently | Matches repo-context convention |
| Server bootstrap | `index.ts` structure, helmet/cors/morgan/json | Solid production baseline |
| Database module | `config/database.ts` + connection events | Works with Atlas; operator has URI configured |
| Auth middleware | `middleware/auth.ts` wrapping `express-oauth2-jwt-bearer` | Matches agency-app pattern; swap-friendly |
| Error handling | `errorHandler.ts` + `asyncHandler` | Works today; may add `express-async-errors` later or keep wrapper |
| Health routes | `/api/health` + `/api/health/detailed` | Phase 0.7 ready |
| Client Auth0 wiring | `main.tsx` provider + `useApiAuth` + axios interceptor | Functional SPA auth flow |
| API client | `services/api.ts` axios instance | Extend, don’t replace |
| TS path config | tsconfig `paths` for `@/*` | Matches conventions; fix Vite alias |
| Demo models/routes | User + Item as **reference only** | Useful until feature packs replace them; not template domain models |

---

## 8. Remove or replace (template divergence)

| Area | Current state | Target action | Phase hint |
|------|---------------|---------------|------------|
| **Tailwind CSS** | `tailwind.config.js`, `postcss.config.js`, `@tailwind` in `index.css`, utility classes in all components | Remove; migrate to token/CSS-variable system | 5 (styling), start stripping in 0 if blocking rules |
| **Demo content** | Home marketing copy (“Modern MERN Stack Starter”), feature grid, placeholder GitHub link | Replace with neutral template landing or minimal shell | 0–1 |
| **Demo routes/pages** | `/dashboard`, `/profile`, Item CRUD UI | Remove or gate behind admin feature pack | 2+ |
| **Item model + routes** | Todo-list sample | Remove when feature packs land; not vertical domain | 2 |
| **User model** | Auth0 profile sync | May evolve into admin user or defer to auth pack | 2 |
| **`express-jwt` dependency** | Unused | Remove from `server/package.json` | 0 |
| **Package metadata** | `name: baseapp`, upstream `repository` URL | Rename to `vertical-template`, point to GVS-Network | 0.5 |
| **`AGENTS.md` / `README.md`** | Describe baseapp only | Update to point at `docs/README.html` + phase state | 0 |
| **Archived vs linked docs** | `README.md` still links `docs/architecture/ARCHITECTURE.md` (moved to `docs/baseapp-upstream/`) | Fix links in README/SETUP | 0 |
| **Global `hooks/` folder** | `useApiAuth.ts` | Relocate next to consumer or accept as exception | convention |
| **Vite `@` alias** | `'/src'` absolute | Fix to proper resolve alias | 0 |

**Forbidden per stack-context (present today — flag, don’t bless silently):**

- **Tailwind** — installed and used everywhere (largest gap vs target architecture)

---

## 9. baseapp README summary (upstream `README.md`)

The root README is still the full **MERN Stack Starter Template** guide:

- Prerequisites: Node 18+, Mongo Atlas, Auth0, Cursor
- Quick start: `npm run install:all`, copy three `.env` files, configure Atlas + Auth0, `npm run dev`
- Documents client/server structure, Auth0 SPA + API audience setup
- **Broken link:** references `docs/architecture/ARCHITECTURE.md` — file now lives at `docs/baseapp-upstream/architecture/ARCHITECTURE.md`
- Does **not** mention vertical-template build docs (`docs/README.html`) except for the short pointer added at the top during doc install commit

---

## 10. Open questions for Phase 0.2 / session handoff

1. **Env var naming:** Reconcile stack-context (`MONGO_URI`, `VITE_API_BASE`) vs repo (`MONGODB_URI`, `VITE_API_URL`) — recommend updating stack-context to match working baseapp names unless we migrate code in 0.2.
2. **Tailwind removal timing:** Remove in Phase 0 (before feature work) vs Phase 5 (with token registry)? Removing early avoids building on styling we will delete.
3. **Node pin:** Add `.nvmrc` with `20` and bump root `engines` to `>=20` per stack-context?
4. **Demo CRUD surface:** Keep `/api/items` through Phase 0 dev-loop verification, then delete in Phase 1/2?
5. **express-jwt:** Safe to drop in Prompt 0.2 housekeeping commit?
6. **Vite alias:** Fix as part of 0.7 dev-loop fixes?

---

## 11. Phase 0.1 acceptance

- [x] Read-only — no application code modified (this file only)
- [x] Stack versions from package.json
- [x] Top-level structure documented
- [x] Compared against `stack-context.html`
- [x] Keep vs remove/replace lists populated
- [x] **Prompt 0.2** — `stack-context.html` reconciled to v0.1.1 (2026-05-21)
- [ ] Next: **Prompt 0.3** — cursor rules already installed; verify or skip to 0.4+
