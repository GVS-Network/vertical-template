/** Cloudinary-backed asset shape — see visual-system-brief §logo / AssetRef. */
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
