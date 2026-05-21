import { Router } from 'express';
import * as controller from './controller';

export function createPaymentsRouter(): Router {
  const router = Router();

  router.post('/checkout/intent', controller.createCheckoutIntent);
  router.post('/webhook/:provider', controller.handleWebhook);

  return router;
}
