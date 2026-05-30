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
- Server validates length and required presence only; rendering is a **client concern** (phase 2: plain/pre-wrap; phase 5+ can add `marked` or MDX in `PageRenderer` only).

## Rendering note (client)

`PageRenderer` and `PostDetail` display `body` as pre-wrapped text until build-doc **Phase 6** ships `MarkdownBody` + content write API. Write routes are scaffolded (501) until Phase 6 implements them.
