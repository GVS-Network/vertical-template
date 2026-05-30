import { Request, Response } from 'express';
import { asyncHandler, createError } from '../../middleware/errorHandler';
import * as contentService from './service';
import {
  createPageBodySchema,
  createPostBodySchema,
  parseBody,
  updatePageBodySchema,
  updatePostBodySchema,
} from './schemas/validators';

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
  // Public read — never forward status (P6-4); drafts/archived must not leak.
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

export const createPage = asyncHandler(async (req: Request, res: Response) => {
  const body = parseBody(createPageBodySchema, req.body);
  const page = await contentService.createPage(req, body);
  res.status(201).json({ status: 'success', data: page });
});

export const updatePage = asyncHandler(async (req: Request, res: Response) => {
  const body = parseBody(updatePageBodySchema, req.body);
  const page = await contentService.updatePage(req, req.params.slug, body);
  if (!page) {
    throw createError('Page not found', 404);
  }
  res.json({ status: 'success', data: page });
});

export const createPost = asyncHandler(async (req: Request, res: Response) => {
  const body = parseBody(createPostBodySchema, req.body);
  const post = await contentService.createPost(req, body);
  res.status(201).json({ status: 'success', data: post });
});

export const updatePost = asyncHandler(async (req: Request, res: Response) => {
  const body = parseBody(updatePostBodySchema, req.body);
  const post = await contentService.updatePost(req, req.params.slug, body);
  if (!post) {
    throw createError('Post not found', 404);
  }
  res.json({ status: 'success', data: post });
});
