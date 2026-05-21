import { scopedForTenant } from '../../db/scoped';
import { skipDevSeeds } from '../../shared/dev-seeds';
import { Page } from './schemas/page';
import { Post } from './schemas/post';

export async function seedContent(tenantId: string): Promise<void> {
  if (process.env.NODE_ENV === 'production' || skipDevSeeds()) {
    return;
  }

  const pages = scopedForTenant(Page, tenantId);
  const pageCount = await pages.countDocuments();
  if (pageCount === 0) {
    await pages.create({
      slug: 'about',
      title: 'About Us',
      body: '# About\n\nWe are a sample tenant on the vertical-template.\n\nThis page body is stored as **Markdown** (see features/content/README.md).',
      hero: {
        headline: 'About Us',
        subheadline: 'Built with the content feature pack',
      },
      status: 'published',
    });
    console.log('[content:seed] inserted about page');
  }

  const posts = scopedForTenant(Post, tenantId);
  const postCount = await posts.countDocuments();
  if (postCount === 0) {
    const now = new Date();
    const samples = [
      {
        slug: 'welcome',
        title: 'Welcome to the blog',
        body: 'First post — Markdown body.\n\nMore content packs land in phase 2.',
        publishedAt: now,
        tags: ['news'],
        status: 'published' as const,
      },
      {
        slug: 'roadmap',
        title: 'Template roadmap',
        body: 'Phase 3 adds payments. Phase 5 adds the visual token registry.',
        publishedAt: new Date(now.getTime() - 86400000),
        tags: ['news', 'roadmap'],
        status: 'published' as const,
      },
    ];
    for (const sample of samples) {
      await posts.create(sample);
    }
    console.log('[content:seed] inserted sample posts');
  }
}
