# Media upload resolutions (pre–Phase 7)

**Status:** Locked for TG onboarding prep  
**Scope:** Core Cloudinary upload — not a brief revision (visual-system-brief already specifies `AssetRef` + Cloudinary).

---

## Decisions

| ID | Topic | Resolution |
|----|--------|------------|
| **M1** | Provider | Single Cloudinary account; SDK only in `server/src/providers/media/` |
| **M2** | Seam | `getMediaProvider()` — returns `null` when `CLOUDINARY_URL` unset (503 on upload) |
| **M3** | Folder prefix | `gvsn/{tenantId}/{pages\|products\|posts\|brand}/{context}` |
| **M4** | Upload path | Server proxy via multer (MVP); signed direct upload deferred |
| **M5** | Size limits | Images 10MB; video 100MB |
| **M6** | Mount gate | `/api/media/*` mounts with `features.admin` + `features.auth` |
| **M7** | Hero storage | CMS continues `hero.imageUrl` string — stores Cloudinary `secureUrl` |
| **M8** | MVP surfaces | Page hero only; product/post/brand fields follow same `MediaUploadField` |

---

## Operator setup

1. Create Cloudinary account (or reuse agency app account).
2. Add to `server/.env`:
   ```
   CLOUDINARY_URL=cloudinary://API_KEY:API_SECRET@CLOUD_NAME
   ```
3. Run `npm run doctor` — expect a warning if unset; uploads return 503 until configured.

---

## Deferred

- Signed direct upload (large video without server bandwidth)
- Product/post admin upload fields (same component, separate PR)
- `AssetRef` on ThemeTokens logo slots
- Intake file attachments
- Media library / browse-delete UI
