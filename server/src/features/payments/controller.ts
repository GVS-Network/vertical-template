import { Request, Response } from 'express';
import { getPaymentProvider } from '../../seams/get-payment-provider';
import { asyncHandler, createError } from '../../middleware/errorHandler';
import type { OrderLineItem } from './schemas/order';
import * as paymentsService from './service';

const NOT_IMPLEMENTED_MESSAGE = 'Payments configured in a later phase';

function tenantId(req: Request): string {
  return req.siteConfig.tenantId;
}

function parseItems(body: unknown): OrderLineItem[] {
  if (!body || typeof body !== 'object') {
    throw createError('Request body must include items array', 400);
  }
  const items = (body as { items?: unknown }).items;
  if (!Array.isArray(items) || items.length === 0) {
    throw createError('items must be a non-empty array', 400);
  }
  return items as OrderLineItem[];
}

export const createCheckoutIntent = asyncHandler(
  async (req: Request, res: Response) => {
    const items = parseItems(req.body);
    const provider =
      req.siteConfig.payment.provider === 'none'
        ? null
        : req.siteConfig.payment.provider;

    const order = await paymentsService.createOrderDraft(
      tenantId(req),
      items,
      provider
    );

    try {
      getPaymentProvider(req.siteConfig);
    } catch (err) {
      const message = err instanceof Error ? err.message : '';
      if (message.includes('NotImplementedYet')) {
        res.status(501).json({
          status: 'fail',
          message: NOT_IMPLEMENTED_MESSAGE,
          code: 'PAYMENTS_NOT_IMPLEMENTED',
          data: { orderId: String(order._id) },
        });
        return;
      }
      throw err;
    }

    res.json({ status: 'success', data: order });
  }
);

export const handleWebhook = asyncHandler(async (req: Request, res: Response) => {
  // TODO(phase-3): verify signature, resolve tenantId, idempotency via WebhookEventLog.
  console.log(
    `[payments:webhook] received provider=${req.params.provider} — not implemented`
  );
  res.status(200).send();
});
