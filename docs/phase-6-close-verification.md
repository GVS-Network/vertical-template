# Phase 6 close verification

**Tag:** `v0.7.0` · **Date:** 2026-05-30

## Fresh-clone checklist

From a clean tree with `server/.env` and `client/.env` copied from examples (MongoDB URI required for `doctor` and content smoke):

```bash
npm run install:all
npm run contract:check
npm run build
npm run test:pack-compliance
npm run test:registry
```

With MongoDB + `BOUND_TENANT_ID` set (optional):

```bash
npm run doctor
npm run test:content
npm run test:food-truck-preset
```

Dev walk (auth + admin require real Auth0 in env when bound tenant has auth on):

```bash
npm run dev
# /admin/pages, /admin/events, /admin/products, /admin/submissions (when intake on)
# public pages/posts render Markdown via MarkdownBody
```

## Phase 6 acceptance

| Criterion | Status |
|-----------|--------|
| Content write API (`POST/PUT` pages + posts; zod; `scoped` writes) | ✓ |
| Post event metadata + public `GET /api/content/posts?tag=event` API | ✓ |
| Public `EventList` UI on demo shell | — deferred to Phase 7 Type C (API only at v0.7.0) |
| Intake email (Resend seam) + submissions inbox API | ✓ |
| `features.admin` pack — `/admin/*` + `/api/admin` reads | ✓ |
| Admin UI: pages, events, products, submissions inbox | ✓ |
| Public Markdown rendering (`react-markdown`) | ✓ |
| `features.admin: false` → zero admin routes (pack-compliance smoke) | ✓ |
| Doctor: auth, admin/auth coupling, notification env | ✓ |
| `contract:check`, `npm run build`, doctor pass | ✓ |
| Tagged `v0.7.0` | ✓ |

## Operator surface shipped

| Surface | Route / API |
|---------|-------------|
| Pages admin | `/admin/pages` · `GET /api/admin/pages` · `POST/PUT /api/content/pages` |
| Events admin | `/admin/events` · `GET /api/admin/posts?tag=event` · `POST/PUT /api/content/posts` |
| Products admin | `/admin/products` · `GET /api/admin/products` · `POST/PUT /api/catalog/products` |
| Submissions inbox | `/admin/submissions` · `GET/PATCH /api/intake/submissions` |
| Intake email | `getNotificationProvider()` · Resend adapter · hook in `createSubmission` |

Sixth feature pack **`admin`** — toggle-mounted; requires **`auth`** when on.

## Known gaps at v0.7.0 (not regressions)

Documented in [`phase-7-demo-public-shell.md`](phase-7-demo-public-shell.md):

- Demo navbar is hardcoded — not generated from CMS pages.
- `/` renders the template `Home.tsx` shell — CMS page slug `home` lives at `/home`.
- Event posts are editable in `/admin/events` but no public events feed component ships until Phase 7 `CustomEvents` (or a core `EventList` generalization).
