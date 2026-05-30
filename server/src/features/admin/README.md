# Admin pack (tenant operator surface)

Toggle-mounted at `features.admin` (requires `features.auth` when on). Client UI at `/admin/*`; this pack owns the `/api/admin` namespace.

## Phase 6.6

- Registry gate: mounts only when `admin` and `auth` are both `true`
- `GET /api/admin/status` — auth-gated health probe (editors in 6.8–6.11)

## Distinction

| Route | Actor |
|-------|--------|
| `/admin/*` | Tenant owner (this pack) |
| `/__admin/*` | Platform operator (Phase 8) |
