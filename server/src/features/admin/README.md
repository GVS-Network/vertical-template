# Admin pack (tenant operator surface)

Toggle-mounted at `features.admin` (requires `features.auth` when on). Client UI at `/admin/*`; this pack owns the `/api/admin` namespace.

## Phase 6.6

- Registry gate: mounts only when `admin` and `auth` are both `true`
- `GET /api/admin/status` — auth-gated health probe

## Phase 6.8 — Pages

- `GET /api/admin/pages` — list all pages (any status), auth-gated
- `GET /api/admin/pages/:slug` — page detail for editor (any status)
- Client `/admin/pages` list + create/edit forms; writes use `POST/PUT /api/content/pages`

## Phase 6.9 — Events

- `GET /api/admin/posts?tag=event` — list event posts (any status), auth-gated
- `GET /api/admin/posts/:slug` — post detail for editor (any status)
- Client `/admin/events` list + create/edit forms; writes use `POST/PUT /api/content/posts` with `tags: ['event']`
- Event datetimes displayed in `siteConfig.locale.timezone`; stored UTC (P6-6)

## Phase 6.10 — Products

- `GET /api/admin/products` — list all products (any status), auth-gated
- `GET /api/admin/products/:slug` — product detail for editor
- Client `/admin/products` list + create/edit forms; writes use `POST/PUT /api/catalog/products`
- Description stored in `attributes.description`; other attribute keys preserved on update; SKU auto-generated from slug on create

## Phase 6.11 — Submissions inbox

- Client `/admin/submissions` — paginated inbox with All / New / Processed filters
- Uses existing `GET /api/intake/submissions` and `PATCH /api/intake/submissions/:id` (Phase 6.5)
- Nav and route gated on `features.intake`

## Distinction

| Route | Actor |
|-------|--------|
| `/admin/*` | Tenant owner (this pack) |
| `/__admin/*` | Platform operator (Phase 8) |
