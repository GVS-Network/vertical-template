import { z } from 'zod';

import type { MediaUploadPurpose } from '../../types/media-provider';

export const MEDIA_UPLOAD_PURPOSES = [
  'page-hero',
  'product-image',
  'post-featured',
  'brand-logo',
] as const satisfies readonly MediaUploadPurpose[];

export const mediaUploadBodySchema = z.object({
  purpose: z.enum(MEDIA_UPLOAD_PURPOSES),
  context: z
    .string()
    .trim()
    .max(64)
    .optional()
    .transform((value) => (value ? value : undefined)),
});

export const IMAGE_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/svg+xml',
]);

export const VIDEO_MIME_TYPES = new Set([
  'video/mp4',
  'video/webm',
  'video/quicktime',
]);

export const ALLOWED_MEDIA_MIME_TYPES = new Set([
  ...IMAGE_MIME_TYPES,
  ...VIDEO_MIME_TYPES,
]);

export const MAX_IMAGE_UPLOAD_BYTES = 10 * 1024 * 1024;
export const MAX_VIDEO_UPLOAD_BYTES = 100 * 1024 * 1024;

export function maxBytesForMime(mimeType: string): number {
  if (VIDEO_MIME_TYPES.has(mimeType)) {
    return MAX_VIDEO_UPLOAD_BYTES;
  }
  return MAX_IMAGE_UPLOAD_BYTES;
}
