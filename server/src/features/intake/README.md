# Intake pack

Conditional forms and submission persistence. Public `POST /api/intake/forms/:slug` creates a tenant-scoped `Submission`.

## Admin inbox API (Phase 6.5)

Auth-gated when `features.auth: true` via `writeGuards` + `requireAuth`.

| Method | Path | Notes |
|--------|------|--------|
| `GET` | `/api/intake/submissions` | Paginated list; newest first |
| `PATCH` | `/api/intake/submissions/:id` | Body `{ "processed": true \| false }` |

**Query params (list):** `page` (default 1), `limit` (default 20, max 100), optional `processed` (`true`/`false`), optional `formSlug`.

**Response:** `{ status, data: Submission[], meta: { page, limit, total, totalPages } }`. Each item includes Mongo `_id` for PATCH.

Tenant scope: `scoped(Submission, req)` on all inbox queries.

## Notifications (Phase 6.4)

On successful submission, the pack emails `siteConfig.contact.email` when a notification provider is configured.

| Env | Purpose |
|-----|---------|
| `NOTIFICATION_PROVIDER` | `resend` to enable; omit or `none` to disable |
| `RESEND_API_KEY` | Required when provider is `resend` |
| `NOTIFICATION_FROM_EMAIL` | Verified sender (defaults to `onboarding@resend.dev` for Resend sandbox) |
| `NOTIFICATION_STRICT` | Optional — `true` fails the HTTP request (502) if send fails; default log + succeed |

**Seam:** routes and intake service call `getNotificationProvider()` from `server/src/seams/get-notification-provider.ts`. Resend SDK stays in `server/src/providers/notifications/resend.ts` only.

**Missing recipient:** when `contact.email` is unset, email is skipped and a warning is logged — submission is still saved.

**P4-7:** closed @ Phase 6.4.
