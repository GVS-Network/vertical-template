import { createCloudinaryMediaProvider } from '../providers/media/cloudinary';
import type { MediaProvider } from '../types/media-provider';

export type { AssetRef } from '../types/asset-ref';
export type {
  MediaProvider,
  MediaUploadPurpose,
} from '../types/media-provider';

/**
 * Env-driven media vendor. Admin upload routes call this — not Cloudinary directly.
 * Returns null when CLOUDINARY_URL is unset (upload endpoint responds 503).
 */
export function getMediaProvider(): MediaProvider | null {
  if (!process.env.CLOUDINARY_URL?.trim()) {
    return null;
  }

  return createCloudinaryMediaProvider();
}
