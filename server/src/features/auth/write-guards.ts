import type { RequestHandler } from 'express';
import type { SiteConfig } from '../../types/site-config';
import { requireAuth } from './middleware';

/** Apply requireAuth on write routes only when the auth pack is enabled. */
export function writeGuards(siteConfig: SiteConfig): RequestHandler[] {
  return siteConfig.features.auth ? [requireAuth] : [];
}
