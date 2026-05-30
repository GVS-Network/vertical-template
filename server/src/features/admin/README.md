# Admin pack (tenant operator surface)

Toggle-mounted at `features.admin` (requires `features.auth` when on). Client UI at `/admin/*`; this pack owns the `/api/admin` namespace.

## Phase 6.6

- Registry gate: mounts only when `admin` and `auth` are both `true`
- `GET /api/admin/status` — auth-gated health probe

## Phase 6.8 — Pages

- `GET /api/admin/pages` — list all pages (any status), auth-gated
- `GET /api/admin/pages/:slug` — page detail for editor (any status)
- Client `/admin/pages` list + create/edit forms; writes use `POST/PUT /api/content/pages`

## Distinction

| Route | Actor |
|-------|--------|
| `/admin/*` | Tenant owner (this pack) |
| `/__admin/*` | Platform operator (Phase 8) |
