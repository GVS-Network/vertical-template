import { Request, Response } from 'express';
import { asyncHandler, createError } from '../../middleware/errorHandler';
import * as contentService from './service';

function tenantId(req: Request): string {
  return req.siteConfig.tenantId;
}

export const getPageBySlug = asyncHandler(async (req: Request, res: Response) => {
  const page = await contentService.getPageBySlug(
    tenantId(req),
    req.params.slug
  );
  if (!page) {
    throw createError('Page not found', 404);
  }
  res.json({ status: 'success', data: page });
});

export const listPosts = asyncHandler(async (req: Request, res: Response) => {
  const tag = req.query.tag as string | undefined;
  const posts = await contentService.listPosts(tenantId(req), { tag });
  res.json({ status: 'success', data: posts });
});

export const getPostBySlug = asyncHandler(async (req: Request, res: Response) => {
  const post = await contentService.getPostBySlug(
    tenantId(req),
    req.params.slug
  );
  if (!post) {
    throw createError('Post not found', 404);
  }
  res.json({ status: 'success', data: post });
});

/** TODO: require auth when features.auth is enabled. */
export const writeNotReady = asyncHandler(async (_req: Request, _res: Response) => {
  throw createError(
    'Content write routes require auth pack — not wired in phase 2.5',
    501
  );
});
