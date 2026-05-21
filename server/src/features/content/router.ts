import { Router } from 'express';
import type { SiteConfig } from '../../types/site-config';
import { writeGuards } from '../../shared/write-guards';
import * as controller from './controller';

export function createContentRouter(siteConfig: SiteConfig): Router {
  const router = Router();
  const guards = writeGuards(siteConfig);

  router.get('/pages/:slug', controller.getPageBySlug);
  router.get('/posts', controller.listPosts);
  router.get('/posts/:slug', controller.getPostBySlug);
  router.post('/pages', ...guards, controller.writeNotReady);
  router.put('/pages/:slug', ...guards, controller.writeNotReady);
  router.post('/posts', ...guards, controller.writeNotReady);
  router.put('/posts/:slug', ...guards, controller.writeNotReady);

  return router;
}
