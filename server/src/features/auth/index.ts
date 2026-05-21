import type { Express } from 'express';
import type { SiteConfig } from '../../types/site-config';
import { createAuthRouter } from './router';

export const packKey = 'auth' as const;

export { requireAuth, optionalAuth, authSubject } from './middleware';

export function register(app: Express, _siteConfig: SiteConfig): void {
  app.use('/api/auth', createAuthRouter());
}
