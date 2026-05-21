import { Router } from 'express';
import * as controller from './controller';

export function createContentRouter(): Router {
  const router = Router();

  router.get('/pages/:slug', controller.getPageBySlug);
  router.get('/posts', controller.listPosts);
  router.get('/posts/:slug', controller.getPostBySlug);
  router.post('/pages', controller.writeNotReady);
  router.put('/pages/:slug', controller.writeNotReady);
  router.post('/posts', controller.writeNotReady);
  router.put('/posts/:slug', controller.writeNotReady);

  return router;
}
