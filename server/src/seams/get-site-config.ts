import { Request } from 'express';
import type { SiteConfig } from '../types/site-config';
import { defaultSiteConfig } from '../types/site-config.defaults';

/**
 * Single tenant-context seam. Phase 1: singleton default.
 * Phase 7: resolve from req.hostname / Tenant document — callers unchanged.
 */
export function getSiteConfig(req: Request): SiteConfig {
  void req;
  return defaultSiteConfig;
}
