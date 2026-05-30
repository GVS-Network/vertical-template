import type { Express } from 'express';
import type { SiteConfig } from '../../types/site-config';
import { createMediaRouter } from '../media/router';
import { createAdminRouter } from './router';

export const packKey = 'admin' as const;

export function register(app: Express, siteConfig: SiteConfig): void {
  app.use('/api/admin', createAdminRouter(siteConfig));
  app.use('/api/media', createMediaRouter(siteConfig));
}
