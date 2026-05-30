# Agent context (vertical-template)

Fast orientation when editing this repository in an AI-assisted IDE. Full docs: [`docs/README.html`](docs/README.html).

## What this is

- **client**: Vite + React 18 + React Router 6 + TypeScript + Auth0 SPA SDK. CSS variables from `resolveTokens()` (legacy Tailwind removed from new code).
- **server**: Express + TypeScript + Mongoose + MongoDB; JWT validation for protected routes; feature packs toggle-mounted at boot.

Repository layout: **`client/` and `server/` at the repo root**.

## Commands (from repository root)

| Command | Purpose |
|---------|---------|
| `npm run install:all` | Install root, client, and server dependencies |
| `npm run dev` | Run API and Vite dev server together |
| `npm run dev:client` | Frontend only (port 5173) |
| `npm run dev:server` | API only (port 3001) |
| `npm run build` | Production build of client and server |
| `npm run lint` | ESLint in client and server |
| `npm run doctor` | Env, Mongo, bound tenant, auth, payments, media checks |
| `npm run contract:check` | Dual SiteConfig + ThemeTokens parity |
| `npm run test:media --prefix server` | Media upload route smoke |

## Where to look

| Task | Location |
|------|----------|
| Feature pack registry | `server/src/features/registry.ts`, `client/src/features/registry.tsx` |
| Tenant admin UI | `client/src/features/admin/` · `/admin/*` |
| Content API + CMS | `server/src/features/content/` · `/api/content/*` |
| Media uploads | `server/src/providers/media/` · `POST /api/media/upload` |
| Payment providers | `server/src/providers/` (Stripe/Square SDKs only here) |
| Site config seam | `server/src/seams/get-site-config.ts` |
| Vertical presets | `verticals/` · `npm run init:vertical` |
| Theme resolver | `theme/resolve.ts` |
| Demo shell gaps | `docs/phase-7-demo-public-shell.md` |
| Conventions | `.cursorrules`, `.cursor/rules/` |

## Env setup

Copy examples: `.env.example`, `client/.env.example`, `server/.env.example` → respective `.env` files.

Required for full operator walk: MongoDB (`MONGODB_URI`), Auth0 (client + server), optional `CLOUDINARY_URL` for admin hero uploads, payment keys when `features.payments` is on.

Set `BOUND_TENANT_ID` in `server/.env` to a demo tenant from `npm run init:vertical` for vertical preset testing.
