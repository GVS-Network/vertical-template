import type { Express } from 'express';
import type { SiteConfig } from '../../types/site-config';
import { createCatalogRouter } from './router';
import { seedCatalogProducts } from './seed';

export const packKey = 'catalog' as const;

export async function register(
  app: Express,
  siteConfig: SiteConfig
): Promise<void> {
  await seedCatalogProducts(siteConfig.tenantId);
  app.use('/api/catalog', createCatalogRouter(siteConfig));
}
