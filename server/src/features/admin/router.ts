import { Router } from 'express';
import type { SiteConfig } from '../../types/site-config';
import { writeGuards } from '../../shared/write-guards';

/**
 * Tenant admin API surface (Phase 6.6 stub). CRUD proxies land in 6.8+.
 */
export function createAdminRouter(siteConfig: SiteConfig): Router {
  const router = Router();
  const guards = writeGuards(siteConfig);

  router.get('/status', ...guards, (_req, res) => {
    res.json({ status: 'success', data: { pack: 'admin' } });
  });

  return router;
}
