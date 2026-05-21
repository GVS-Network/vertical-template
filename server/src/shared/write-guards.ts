import type { RequestHandler } from 'express';
import type { SiteConfig } from '../types/site-config';

/**
 * Shared helper for catalog/content write routes. Lives outside packs so
 * catalog/content do not import auth/ directly (pack-pattern § Cross-pack).
 */
export function writeGuards(siteConfig: SiteConfig): RequestHandler[] {
  if (!siteConfig.features.auth) {
    return [];
  }
  const { requireAuth } =
    require('../features/auth/middleware') as typeof import('../features/auth/middleware');
  return [requireAuth];
}
