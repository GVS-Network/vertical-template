import { Router } from 'express';
import type { SiteConfig } from '../../types/site-config';
import { writeGuards } from '../../shared/write-guards';
import * as controller from './controller';

export function createIntakeRouter(siteConfig: SiteConfig): Router {
  const router = Router();
  const guards = writeGuards(siteConfig);

  router.get('/forms/:slug', controller.getFormBySlug);
  router.post('/forms/:slug', controller.createSubmission);

  router.get('/submissions', ...guards, controller.listSubmissions);
  router.patch('/submissions/:id', ...guards, controller.markSubmissionProcessed);

  return router;
}
