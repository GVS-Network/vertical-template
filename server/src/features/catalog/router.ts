import { Router } from 'express';
import type { SiteConfig } from '../../types/site-config';
import { writeGuards } from '../auth/write-guards';
import * as controller from './controller';

export function createCatalogRouter(siteConfig: SiteConfig): Router {
  const router = Router();
  const guards = writeGuards(siteConfig);

  router.get('/products', controller.listProducts);
  router.get('/products/:slug', controller.getProductBySlug);
  router.post('/products', ...guards, controller.createProduct);
  router.put('/products/:slug', ...guards, controller.updateProduct);

  return router;
}
