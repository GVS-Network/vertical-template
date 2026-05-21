import type { Request } from 'express';

import type { IProduct } from '../features/catalog/schemas/product';
import type { IOrder } from '../features/payments/schemas/order';

/** Order passed to PaymentProvider.createCheckout (Mongoose document or plain shape). */
export type Order = IOrder;

/** Catalog product passed to optional syncInventory (Square). */
export type Product = IProduct;

export type WebhookEvent =
  | { type: 'order.paid'; providerRef: string; eventId: string }
  | { type: 'order.failed'; providerRef: string; eventId: string }
  | { type: 'order.refunded'; providerRef: string; eventId: string }
  | { type: 'unknown'; eventId: string };

/**
 * Payment seam contract (phase 3.2). Implementations in server/src/providers/.
 * @see server/src/features/payments/README.md
 */
export interface PaymentProvider {
  key: 'stripe' | 'square';
  createCheckout(order: Order): Promise<{ url: string; providerRef: string }>;
  verifyWebhook(req: Request): boolean;
  parseWebhookEvent(req: Request): WebhookEvent;
  syncInventory?(products: Product[]): Promise<void>;
}
