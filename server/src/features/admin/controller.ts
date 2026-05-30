import { Request, Response } from 'express';

import { asyncHandler, createError } from '../../middleware/errorHandler';
import * as contentService from '../content/service';

function tenantId(req: Request): string {
  return req.siteConfig.tenantId;
}

export const listPages = asyncHandler(async (req: Request, res: Response) => {
  const pages = await contentService.listPagesAdmin(tenantId(req));
  res.json({ status: 'success', data: pages });
});

export const getPage = asyncHandler(async (req: Request, res: Response) => {
  const page = await contentService.getPageBySlugAdmin(
    tenantId(req),
    req.params.slug
  );
  if (!page) {
    throw createError('Page not found', 404);
  }
  res.json({ status: 'success', data: page });
});
