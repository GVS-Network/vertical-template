import type { AssetRef } from './asset-ref';

export type MediaUploadPurpose =
  | 'page-hero'
  | 'product-image'
  | 'post-featured'
  | 'brand-logo';

export interface MediaUploadParams {
  buffer: Buffer;
  folder: string;
  mimeType: string;
  originalName?: string;
}

export interface MediaProvider {
  upload(params: MediaUploadParams): Promise<AssetRef>;
  destroy(publicId: string): Promise<void>;
}
