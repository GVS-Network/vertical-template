import { Router } from 'express';
import * as controller from './controller';

export function createIntakeRouter(): Router {
  const router = Router();

  router.get('/forms/:slug', controller.getFormBySlug);
  router.post('/forms/:slug', controller.createSubmission);

  return router;
}
