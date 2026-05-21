import type { HydratedDocument } from 'mongoose';
import { scopedForTenant } from '../../db/scoped';
import { Page, type ContentStatus, type IPage } from './schemas/page';
import { Post, type IPost } from './schemas/post';

export type PostListFilter = {
  status?: ContentStatus;
  tag?: string;
};

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

export async function listPosts(
  tenantId: string,
  filter: PostListFilter = {}
): Promise<IPost[]> {
  const posts = scopedForTenant(Post, tenantId);
  const query: Record<string, unknown> = {
    status: filter.status ?? 'published',
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
