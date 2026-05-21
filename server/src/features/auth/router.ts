import { Router } from 'express';
import { requireAuth } from './middleware';
import * as controller from './controller';

export function createAuthRouter(): Router {
  const router = Router();
  router.get('/me', requireAuth, controller.getMe);
  return router;
}
