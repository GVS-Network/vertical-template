import { z } from 'zod';

import { createError } from '../../../middleware/errorHandler';

const contentStatusSchema = z.enum(['published', 'draft', 'archived']);

const pageHeroSchema = z
  .object({
    imageUrl: z.string().trim().optional(),
    headline: z.string().trim().optional(),
    subheadline: z.string().trim().optional(),
  })
  .strict();

export const createPageBodySchema = z
  .object({
    slug: z.string().trim().min(1).max(200),
    title: z.string().trim().min(1).max(500),
    body: z.string().max(500_000).default(''),
    hero: pageHeroSchema.optional(),
    status: contentStatusSchema.default('draft'),
  })
  .strict();

export const updatePageBodySchema = z
  .object({
    title: z.string().trim().min(1).max(500).optional(),
    body: z.string().max(500_000).optional(),
    hero: pageHeroSchema.optional(),
    status: contentStatusSchema.optional(),
  })
  .strict();

export const createPostBodySchema = z
  .object({
    slug: z.string().trim().min(1).max(200),
    title: z.string().trim().min(1).max(500),
    body: z.string().max(500_000).default(''),
    publishedAt: z.coerce.date().nullable().optional(),
    tags: z.array(z.string().trim().min(1)).default([]),
    status: contentStatusSchema.default('draft'),
  })
  .strict();

export const updatePostBodySchema = z
  .object({
    title: z.string().trim().min(1).max(500).optional(),
    body: z.string().max(500_000).optional(),
    publishedAt: z.coerce.date().nullable().optional(),
    tags: z.array(z.string().trim().min(1)).optional(),
    status: contentStatusSchema.optional(),
  })
  .strict();

export type CreatePageBody = z.output<typeof createPageBodySchema>;
export type UpdatePageBody = z.output<typeof updatePageBodySchema>;
export type CreatePostBody = z.output<typeof createPostBodySchema>;
export type UpdatePostBody = z.output<typeof updatePostBodySchema>;

export function parseBody<S extends z.ZodTypeAny>(
  schema: S,
  body: unknown
): z.output<S> {
  const result = schema.safeParse(body);
  if (!result.success) {
    const message = result.error.errors
      .map((issue) => {
        const path = issue.path.length ? issue.path.join('.') : 'body';
        return `${path}: ${issue.message}`;
      })
      .join('; ');
    throw createError(message, 400);
  }
  return result.data;
}
