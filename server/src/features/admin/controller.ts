import { Request, Response } from 'express';

import { asyncHandler, createError } from '../../middleware/errorHandler';
import * as catalogService from '../catalog/service';
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

export const listPosts = asyncHandler(async (req: Request, res: Response) => {
  const tag =
    typeof req.query.tag === 'string' ? req.query.tag : undefined;
  const posts = await contentService.listPostsAdmin(tenantId(req), { tag });
  res.json({ status: 'success', data: posts });
});

export const getPost = asyncHandler(async (req: Request, res: Response) => {
  const post = await contentService.getPostBySlugAdmin(
    tenantId(req),
    req.params.slug
  );
  if (!post) {
    throw createError('Post not found', 404);
  }
  res.json({ status: 'success', data: post });
});

export const listProducts = asyncHandler(async (req: Request, res: Response) => {
  const products = await catalogService.listProducts(tenantId(req));
  res.json({ status: 'success', data: products });
});

export const getProduct = asyncHandler(async (req: Request, res: Response) => {
  const product = await catalogService.getProductBySlug(
    tenantId(req),
    req.params.slug
  );
  if (!product) {
    throw createError('Product not found', 404);
  }
  res.json({ status: 'success', data: product });
});
