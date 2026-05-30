import type { Request, Response } from 'express';

import { buildTenantMediaFolder } from '../../providers/media/folder';
import { createError, asyncHandler } from '../../middleware/errorHandler';
import { getMediaProvider } from '../../seams/get-media-provider';
import {
  ALLOWED_MEDIA_MIME_TYPES,
  maxBytesForMime,
  mediaUploadBodySchema,
} from './validators';

export const uploadMedia = asyncHandler(async (req: Request, res: Response) => {
  const provider = getMediaProvider();
  if (!provider) {
    throw createError(
      'Media uploads are not configured (CLOUDINARY_URL missing)',
      503
    );
  }

  const parsed = mediaUploadBodySchema.safeParse(req.body);
  if (!parsed.success) {
    throw createError(parsed.error.errors[0]?.message ?? 'Invalid upload request', 400);
  }

  const file = req.file;
  if (!file) {
    throw createError('Missing file field "file"', 400);
  }

  if (!ALLOWED_MEDIA_MIME_TYPES.has(file.mimetype)) {
    throw createError(`Unsupported file type: ${file.mimetype}`, 400);
  }

  const maxBytes = maxBytesForMime(file.mimetype);
  if (file.size > maxBytes) {
    throw createError(
      `File exceeds maximum size (${Math.round(maxBytes / (1024 * 1024))}MB)`,
      400
    );
  }

  const { purpose, context } = parsed.data;
  const folder = buildTenantMediaFolder(req.siteConfig.tenantId, purpose, context);

  const asset = await provider.upload({
    buffer: file.buffer,
    folder,
    mimeType: file.mimetype,
    originalName: file.originalname,
  });

  res.status(201).json({
    status: 'success',
    data: asset,
  });
});
