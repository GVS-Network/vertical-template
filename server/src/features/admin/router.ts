import { Router } from 'express';
import type { SiteConfig } from '../../types/site-config';
import { writeGuards } from '../../shared/write-guards';
import * as controller from './controller';

/**
 * Tenant admin API surface. Reads proxy content/catalog/intake; writes use those packs' POST/PUT routes.
 */
export function createAdminRouter(siteConfig: SiteConfig): Router {
  const router = Router();
  const guards = writeGuards(siteConfig);

  router.get('/status', ...guards, (_req, res) => {
    res.json({ status: 'success', data: { pack: 'admin' } });
  });

  router.get('/pages', ...guards, controller.listPages);
  router.get('/pages/:slug', ...guards, controller.getPage);
  router.get('/posts', ...guards, controller.listPosts);
  router.get('/posts/:slug', ...guards, controller.getPost);
  router.get('/products', ...guards, controller.listProducts);
  router.get('/products/:slug', ...guards, controller.getProduct);

  return router;
}
