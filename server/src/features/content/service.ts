import type { Request } from 'express';
import { MongoServerError } from 'mongodb';
import type { HydratedDocument } from 'mongoose';

import { scoped, scopedForTenant } from '../../db/scoped';
import { createError } from '../../middleware/errorHandler';
import { Page, type ContentStatus, type IPage } from './schemas/page';
import { Post, type IPost } from './schemas/post';
import type {
  CreatePageBody,
  CreatePostBody,
  UpdatePageBody,
  UpdatePostBody,
} from './schemas/validators';

export type PostListFilter = {
  tag?: string;
  status?: ContentStatus;
};

export type PageListFilter = {
  status?: ContentStatus;
};

function duplicateKeyError(err: unknown): boolean {
  return err instanceof MongoServerError && err.code === 11000;
}

function resolvePublishedAt(
  status: ContentStatus,
  publishedAt: Date | null | undefined,
  existing: Date | null | undefined
): Date | null {
  if (status === 'published') {
    return publishedAt ?? existing ?? new Date();
  }
  if (publishedAt !== undefined) {
    return publishedAt;
  }
  return existing ?? null;
}

export async function getPageBySlug(
  tenantId: string,
  slug: string
): Promise<IPage | null> {
  const pages = scopedForTenant(Page, tenantId);
  const doc = (await pages.findOne({
    slug: slug.toLowerCase(),
    status: 'published',
  })) as HydratedDocument<IPage> | null;
  return doc ? doc.toObject() : null;
}

/** Auth-gated admin list — all statuses unless filtered (Phase 6.8). */
export async function listPagesAdmin(
  tenantId: string,
  filter: PageListFilter = {}
): Promise<IPage[]> {
  const pages = scopedForTenant(Page, tenantId);
  const query: Record<string, unknown> = {};
  if (filter.status) {
    query.status = filter.status;
  }
  const docs = (await pages
    .find(query)
    .sort({ title: 1 })) as HydratedDocument<IPage>[];
  return docs.map((d) => d.toObject());
}

/** Auth-gated admin detail — any status (Phase 6.8). */
export async function getPageBySlugAdmin(
  tenantId: string,
  slug: string
): Promise<IPage | null> {
  const pages = scopedForTenant(Page, tenantId);
  const doc = (await pages.findOne({
    slug: slug.toLowerCase(),
  })) as HydratedDocument<IPage> | null;
  return doc ? doc.toObject() : null;
}

export async function listPosts(
  tenantId: string,
  filter: PostListFilter = {}
): Promise<IPost[]> {
  const posts = scopedForTenant(Post, tenantId);
  const query: Record<string, unknown> = {
    status: 'published',
  };
  if (filter.tag) {
    query.tags = filter.tag;
  }
  const docs = (await posts
    .find(query)
    .sort({ publishedAt: -1 })) as HydratedDocument<IPost>[];
  return docs.map((d) => d.toObject());
}

export async function getPostBySlug(
  tenantId: string,
  slug: string
): Promise<IPost | null> {
  const posts = scopedForTenant(Post, tenantId);
  const doc = (await posts.findOne({
    slug: slug.toLowerCase(),
    status: 'published',
  })) as HydratedDocument<IPost> | null;
  return doc ? doc.toObject() : null;
}

/** Auth-gated admin list — any status; optional tag filter (Phase 6.9). */
export async function listPostsAdmin(
  tenantId: string,
  filter: PostListFilter = {}
): Promise<IPost[]> {
  const posts = scopedForTenant(Post, tenantId);
  const query: Record<string, unknown> = {};
  if (filter.status) {
    query.status = filter.status;
  }
  if (filter.tag) {
    query.tags = filter.tag;
  }
  const docs = (await posts
    .find(query)
    .sort({ eventStart: 1, title: 1 })) as HydratedDocument<IPost>[];
  return docs.map((d) => d.toObject());
}

/** Auth-gated admin detail — any status (Phase 6.9). */
export async function getPostBySlugAdmin(
  tenantId: string,
  slug: string
): Promise<IPost | null> {
  const posts = scopedForTenant(Post, tenantId);
  const doc = (await posts.findOne({
    slug: slug.toLowerCase(),
  })) as HydratedDocument<IPost> | null;
  return doc ? doc.toObject() : null;
}

export async function createPage(
  req: Request,
  input: CreatePageBody
): Promise<IPage> {
  const pages = scoped(Page, req);
  try {
    const doc = await pages.create({
      slug: input.slug.toLowerCase(),
      title: input.title,
      body: input.body ?? '',
      hero: input.hero,
      status: input.status,
    });
    return doc.toObject();
  } catch (err) {
    if (duplicateKeyError(err)) {
      throw createError('Page slug already exists', 409);
    }
    throw err;
  }
}

export async function updatePage(
  req: Request,
  slug: string,
  input: UpdatePageBody
): Promise<IPage | null> {
  const pages = scoped(Page, req);
  const normalized = slug.toLowerCase();
  const existing = (await pages.findOne({
    slug: normalized,
  })) as HydratedDocument<IPage> | null;
  if (!existing) {
    return null;
  }

  const update: Record<string, unknown> = { ...input };
  if (input.hero !== undefined) {
    update.hero = { ...existing.toObject().hero, ...input.hero };
  }

  await pages.updateOne({ slug: normalized }, update);
  const doc = (await pages.findOne({
    slug: normalized,
  })) as HydratedDocument<IPage> | null;
  return doc ? doc.toObject() : null;
}

function eventFieldsFromInput(input: CreatePostBody | UpdatePostBody): {
  eventStart?: Date | null;
  eventEnd?: Date | null;
  eventLocation?: string;
  links?: IPost['links'];
} {
  const fields: {
    eventStart?: Date | null;
    eventEnd?: Date | null;
    eventLocation?: string;
    links?: IPost['links'];
  } = {};
  if ('eventStart' in input && input.eventStart !== undefined) {
    fields.eventStart = input.eventStart;
  }
  if ('eventEnd' in input && input.eventEnd !== undefined) {
    fields.eventEnd = input.eventEnd;
  }
  if (input.eventLocation !== undefined) {
    fields.eventLocation = input.eventLocation;
  }
  if (input.links !== undefined) {
    fields.links = input.links;
  }
  return fields;
}

export async function createPost(
  req: Request,
  input: CreatePostBody
): Promise<IPost> {
  const posts = scoped(Post, req);
  const status = input.status;
  const publishedAt = resolvePublishedAt(status, input.publishedAt, null);
  try {
    const doc = await posts.create({
      slug: input.slug.toLowerCase(),
      title: input.title,
      body: input.body ?? '',
      tags: input.tags,
      status,
      publishedAt,
      ...eventFieldsFromInput(input),
    });
    return doc.toObject();
  } catch (err) {
    if (duplicateKeyError(err)) {
      throw createError('Post slug already exists', 409);
    }
    throw err;
  }
}

export async function updatePost(
  req: Request,
  slug: string,
  input: UpdatePostBody
): Promise<IPost | null> {
  const posts = scoped(Post, req);
  const normalized = slug.toLowerCase();
  const existing = (await posts.findOne({
    slug: normalized,
  })) as HydratedDocument<IPost> | null;
  if (!existing) {
    return null;
  }

  const nextStatus = input.status ?? existing.status;
  const publishedAt = resolvePublishedAt(
    nextStatus,
    input.publishedAt,
    existing.publishedAt
  );

  const { links, ...inputRest } = input;
  const update: Record<string, unknown> = { ...inputRest, publishedAt };
  if (links !== undefined) {
    update.links = { ...existing.toObject().links, ...links };
  }

  await posts.updateOne({ slug: normalized }, update);
  const doc = (await posts.findOne({
    slug: normalized,
  })) as HydratedDocument<IPost> | null;
  return doc ? doc.toObject() : null;
}
