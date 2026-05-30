import { Router } from 'express';
import multer from 'multer';

import type { SiteConfig } from '../../types/site-config';
import { createError } from '../../middleware/errorHandler';
import { writeGuards } from '../../shared/write-guards';
import { ALLOWED_MEDIA_MIME_TYPES, MAX_VIDEO_UPLOAD_BYTES } from './validators';
import * as controller from './controller';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_VIDEO_UPLOAD_BYTES },
  fileFilter: (_req, file, cb) => {
    if (ALLOWED_MEDIA_MIME_TYPES.has(file.mimetype)) {
      cb(null, true);
      return;
    }
    cb(new Error(`Unsupported file type: ${file.mimetype}`));
  },
});

export function createMediaRouter(siteConfig: SiteConfig): Router {
  const router = Router();
  const guards = writeGuards(siteConfig);

  router.post(
    '/upload',
    ...guards,
    (req, res, next) => {
      upload.single('file')(req, res, (err: unknown) => {
        if (err) {
          const message =
            err instanceof Error ? err.message : 'Upload failed';
          next(createError(message, 400));
          return;
        }
        next();
      });
    },
    controller.uploadMedia
  );

  return router;
}
