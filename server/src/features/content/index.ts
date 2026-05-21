import type { Express } from 'express';
import type { SiteConfig } from '../../types/site-config';
import { createContentRouter } from './router';
import { seedContent } from './seed';

export const packKey = 'content' as const;

export async function register(
  app: Express,
  siteConfig: SiteConfig
): Promise<void> {
  await seedContent(siteConfig.tenantId);
  app.use('/api/content', createContentRouter(siteConfig));
}
