/** Cloudinary-backed asset shape — mirrors server/src/types/asset-ref.ts */
export type AssetResourceType = 'image' | 'video' | 'raw';

export interface AssetRef {
  publicId: string;
  url: string;
  secureUrl: string;
  resourceType: AssetResourceType;
  width?: number;
  height?: number;
  bytes?: number;
  format?: string;
}

export type MediaUploadPurpose =
  | 'page-hero'
  | 'product-image'
  | 'post-featured'
  | 'brand-logo';

export interface MediaUploadResponse {
  status: string;
  data: AssetRef;
}
