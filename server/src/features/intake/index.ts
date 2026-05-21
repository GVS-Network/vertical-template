import type { Express } from 'express';
import type { SiteConfig } from '../../types/site-config';
import { createIntakeRouter } from './router';
import { seedIntakeForms } from './seed';

export const packKey = 'intake' as const;

export async function register(
  app: Express,
  siteConfig: SiteConfig
): Promise<void> {
  await seedIntakeForms(siteConfig.tenantId);
  app.use('/api/intake', createIntakeRouter());
}
