import { Router } from 'express';
import * as controller from './controller';

export function createCatalogRouter(): Router {
  const router = Router();

  router.get('/products', controller.listProducts);
  router.get('/products/:slug', controller.getProductBySlug);
  router.post('/products', controller.createProduct);
  router.put('/products/:slug', controller.updateProduct);

  return router;
}
