# Content pack — body format decision

**Chosen for phase 2:** `body` is stored as a **raw Markdown string** (`String` on Page and Post).

## Options considered

| Option | Pros | Cons |
|--------|------|------|
| **(1) Raw Markdown** ✓ | Simple schema; any renderer later; easy CMS export/import; matches agency patterns | Client must pick a renderer; no embedded React in content without a later step |
| **(2) MDX + allowlist** | Rich layouts in content | Requires build pipeline, component allowlist maintenance, harder validation and XSS discipline |
| **(3) Lexical/Tiptap JSON** | WYSIWYG-native | Locks editor choice; heavy migration if we switch; poor git diffs |

## Why Markdown string

- Smallest Type-C surface: one field, no nested AST in Mongo.
- Does not block MDX later: add optional `bodyFormat: 'markdown' \| 'mdx'` or a separate `bodyMdx` field when a vertical needs it.
- Does not block a headless editor: a future admin UI can still persist Markdown (or serialize Tiptap → Markdown on save).
- Server validates length and required presence only; rendering is a **client concern** (Phase 6.7 adds `MarkdownBody` on public routes).

## Write API (Phase 6.2)

Auth-gated when `features.auth: true` via `writeGuards` + `requireAuth`. When auth is off, write routes are mounted without guards (same pattern as catalog).

| Method | Path | Body (zod) |
|--------|------|------------|
| `POST` | `/api/content/pages` | `slug`, `title`, optional `body`, `hero`, `status` |
| `PUT` | `/api/content/pages/:slug` | partial page fields |
| `POST` | `/api/content/posts` | `slug`, `title`, optional `body`, `tags`, `publishedAt`, `status` |
| `PUT` | `/api/content/posts/:slug` | partial post fields |

- Status values: `draft` \| `published` \| `archived` (default `draft` on create).
- Writes use `scoped(Model, req)` — tenant filter baked in.
- Inbound bodies validated in `schemas/validators.ts` (zod).

## Public reads (P6-4)

Anonymous `GET` list and detail return **`status: published` only**. The service hard-codes published; controllers do not forward a `status` query param. Draft/archived records are invisible on public routes until published.

## Tests

```bash
npm run test:content --prefix server
```

Requires `MONGODB_URI`. Smoke covers create/update, zod rejection, duplicate slug (409), and published-only public GET/list.
