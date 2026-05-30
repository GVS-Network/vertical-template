import { v2 as cloudinary, type UploadApiResponse } from 'cloudinary';

import type { AssetRef, AssetResourceType } from '../../types/asset-ref';
import type { MediaProvider, MediaUploadParams } from '../../types/media-provider';

function toAssetRef(result: UploadApiResponse): AssetRef {
  const resourceType = result.resource_type as AssetResourceType;
  return {
    publicId: result.public_id,
    url: result.url,
    secureUrl: result.secure_url,
    resourceType,
    width: result.width ?? undefined,
    height: result.height ?? undefined,
    bytes: result.bytes ?? undefined,
    format: result.format ?? undefined,
  };
}

function resourceTypeForMime(mimeType: string): 'image' | 'video' | 'raw' {
  if (mimeType.startsWith('video/')) {
    return 'video';
  }
  if (mimeType.startsWith('image/')) {
    return 'image';
  }
  return 'raw';
}

export function createCloudinaryMediaProvider(): MediaProvider {
  if (!process.env.CLOUDINARY_URL?.trim()) {
    throw new Error('CLOUDINARY_URL is not configured');
  }

  cloudinary.config({ secure: true });

  return {
    upload(params: MediaUploadParams): Promise<AssetRef> {
      const resourceType = resourceTypeForMime(params.mimeType);

      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: params.folder,
            resource_type: resourceType,
            use_filename: Boolean(params.originalName),
            unique_filename: true,
            overwrite: false,
          },
          (error, result) => {
            if (error || !result) {
              reject(error ?? new Error('Cloudinary upload failed'));
              return;
            }
            resolve(toAssetRef(result));
          }
        );
        stream.end(params.buffer);
      });
    },

    async destroy(publicId: string): Promise<void> {
      await cloudinary.uploader.destroy(publicId, { resource_type: 'auto' });
    },
  };
}
