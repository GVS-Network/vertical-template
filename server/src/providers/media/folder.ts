import type { MediaUploadPurpose } from '../../types/media-provider';

const PURPOSE_SEGMENT: Record<MediaUploadPurpose, string> = {
  'page-hero': 'pages',
  'product-image': 'products',
  'post-featured': 'posts',
  'brand-logo': 'brand',
};

/** Tenant-scoped Cloudinary folder — prefix enforced on upload and destroy. */
export function buildTenantMediaFolder(
  tenantId: string,
  purpose: MediaUploadPurpose,
  context?: string
): string {
  const segment = PURPOSE_SEGMENT[purpose];
  const safeContext = sanitizeFolderSegment(context) ?? 'misc';
  return `gvsn/${sanitizeFolderSegment(tenantId)}/${segment}/${safeContext}`;
}

export function tenantOwnsPublicId(tenantId: string, publicId: string): boolean {
  const prefix = `gvsn/${sanitizeFolderSegment(tenantId)}/`;
  return publicId.startsWith(prefix);
}

function sanitizeFolderSegment(value: string | undefined): string | undefined {
  if (!value) {
    return undefined;
  }
  const trimmed = value.trim().toLowerCase();
  if (!trimmed) {
    return undefined;
  }
  const safe = trimmed.replace(/[^a-z0-9-_]/g, '-').replace(/-+/g, '-');
  return safe.slice(0, 64) || undefined;
}
