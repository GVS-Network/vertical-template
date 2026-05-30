/**
 * Content pack smoke (Phase 6.2) — write API + public published-only reads (P6-4).
 *
 * Prerequisites: MONGODB_URI in server/.env (or env).
 *
 * Run: npm run test:content --prefix server
 */
import dotenv from 'dotenv';
import path from 'path';
import request from 'supertest';

import { connectDatabase, disconnectDatabase } from '../../config/database';
import { createApp } from '../../app';
import { defaultSiteConfig } from '../../types/site-config.defaults';
import { scopedForTenant } from '../../db/scoped';
import { Page } from './schemas/page';
import { Post } from './schemas/post';

dotenv.config({ path: path.join(__dirname, '../../../.env') });

const TEST_PAGE_SLUG = 'content-smoke-page';
const TEST_POST_SLUG = 'content-smoke-post';

async function main(): Promise<void> {
  process.env.SKIP_PACK_SEEDS = '1';

  await connectDatabase();

  const siteConfig = {
    ...defaultSiteConfig,
    features: {
      ...defaultSiteConfig.features,
      content: true,
      auth: false,
    },
  };
  const tenantId = siteConfig.tenantId;
  const app = await createApp({ siteConfig });

  const pages = scopedForTenant(Page, tenantId);
  const posts = scopedForTenant(Post, tenantId);
  await pages.deleteMany({ slug: TEST_PAGE_SLUG });
  await posts.deleteMany({ slug: TEST_POST_SLUG });

  const draftPageRes = await request(app)
    .post('/api/content/pages')
    .send({
      slug: TEST_PAGE_SLUG,
      title: 'Smoke draft page',
      body: '# Draft',
      status: 'draft',
    });
  if (draftPageRes.status !== 201) {
    throw new Error(`create draft page expected 201, got ${draftPageRes.status}`);
  }

  const publicDraftPage = await request(app).get(
    `/api/content/pages/${TEST_PAGE_SLUG}`
  );
  if (publicDraftPage.status !== 404) {
    throw new Error(
      `draft page public GET expected 404, got ${publicDraftPage.status}`
    );
  }

  const publishPageRes = await request(app)
    .put(`/api/content/pages/${TEST_PAGE_SLUG}`)
    .send({ status: 'published' });
  if (publishPageRes.status !== 200) {
    throw new Error(`publish page expected 200, got ${publishPageRes.status}`);
  }

  const publicPage = await request(app).get(
    `/api/content/pages/${TEST_PAGE_SLUG}`
  );
  if (publicPage.status !== 200 || publicPage.body?.data?.slug !== TEST_PAGE_SLUG) {
    throw new Error('published page should be visible on public GET');
  }

  const draftPostRes = await request(app)
    .post('/api/content/posts')
    .send({
      slug: TEST_POST_SLUG,
      title: 'Smoke draft post',
      body: 'Draft body',
      status: 'draft',
      tags: ['smoke'],
    });
  if (draftPostRes.status !== 201) {
    throw new Error(`create draft post expected 201, got ${draftPostRes.status}`);
  }

  const listWhileDraft = await request(app).get('/api/content/posts');
  if (listWhileDraft.status !== 200) {
    throw new Error(`list posts expected 200, got ${listWhileDraft.status}`);
  }
  const draftVisible = (listWhileDraft.body?.data ?? []).some(
    (p: { slug: string }) => p.slug === TEST_POST_SLUG
  );
  if (draftVisible) {
    throw new Error('draft post must not appear in public list');
  }

  const draftPostDetail = await request(app).get(
    `/api/content/posts/${TEST_POST_SLUG}`
  );
  if (draftPostDetail.status !== 404) {
    throw new Error(
      `draft post public GET expected 404, got ${draftPostDetail.status}`
    );
  }

  const statusQueryBypass = await request(app).get(
    '/api/content/posts?status=draft'
  );
  if (statusQueryBypass.status !== 200) {
    throw new Error(`list with status=draft query expected 200, got ${statusQueryBypass.status}`);
  }
  const bypassVisible = (statusQueryBypass.body?.data ?? []).some(
    (p: { slug: string }) => p.slug === TEST_POST_SLUG
  );
  if (bypassVisible) {
    throw new Error('status query must not expose drafts on public list (P6-4)');
  }

  const publishPostRes = await request(app)
    .put(`/api/content/posts/${TEST_POST_SLUG}`)
    .send({ status: 'published' });
  if (publishPostRes.status !== 200) {
    throw new Error(`publish post expected 200, got ${publishPostRes.status}`);
  }

  const listPublished = await request(app).get('/api/content/posts?tag=smoke');
  const publishedVisible = (listPublished.body?.data ?? []).some(
    (p: { slug: string }) => p.slug === TEST_POST_SLUG
  );
  if (!publishedVisible) {
    throw new Error('published post should appear in public list');
  }

  const duplicateRes = await request(app)
    .post('/api/content/pages')
    .send({
      slug: TEST_PAGE_SLUG,
      title: 'Duplicate',
      body: 'dup',
      status: 'draft',
    });
  if (duplicateRes.status !== 409) {
    throw new Error(`duplicate slug expected 409, got ${duplicateRes.status}`);
  }

  const invalidRes = await request(app).post('/api/content/pages').send({});
  if (invalidRes.status !== 400) {
    throw new Error(`invalid body expected 400, got ${invalidRes.status}`);
  }

  await pages.deleteMany({ slug: TEST_PAGE_SLUG });
  await posts.deleteMany({ slug: TEST_POST_SLUG });
  await disconnectDatabase();

  console.log('content.smoke: writes OK; public GET/list published-only (P6-4); zod + duplicate slug');
}

main().catch(async (err) => {
  console.error('content.smoke FAILED:', err);
  try {
    await disconnectDatabase();
  } catch {
    // ignore
  }
  process.exit(1);
});
