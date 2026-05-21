import { Request, Response } from 'express';
import { getPaymentProvider } from '../../seams/get-payment-provider';
import { asyncHandler, createError } from '../../middleware/errorHandler';
import type { SiteConfig } from '../../types/site-config';
import type { PaymentProviderName } from '../../types/site-config';
import { defaultSiteConfig } from '../../types/site-config.defaults';
import type { OrderLineItem } from './schemas/order';
import * as paymentsService from './service';

const NOT_CONFIGURED_MESSAGE =
  'Payments not configured — set payment.provider to stripe or square';

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

function siteConfigForWebhook(provider: string): SiteConfig {
  if (provider !== 'stripe' && provider !== 'square') {
    throw createError('Unknown payment provider', 400);
  }
  return {
    ...defaultSiteConfig,
    payment: { provider: provider as PaymentProviderName },
  };
}

function applyWebhookEvent(
  event: ReturnType<ReturnType<typeof getPaymentProvider>['parseWebhookEvent']>
): Promise<unknown> {
  switch (event.type) {
    case 'order.paid':
      if (event.orderId) {
        return paymentsService.markOrderPaid(
          event.tenantId,
          event.orderId,
          event.providerRef
        );
      }
      return paymentsService.markOrderPaidByProviderRef(
        event.tenantId,
        event.providerRef
      );
    case 'order.failed':
      if (event.orderId) {
        return paymentsService.markOrderFailed(event.tenantId, event.orderId);
      }
      return paymentsService.markOrderFailedByProviderRef(
        event.tenantId,
        event.providerRef
      );
    case 'order.refunded':
      if (event.orderId) {
        return paymentsService.markOrderRefunded(event.tenantId, event.orderId);
      }
      return paymentsService.markOrderRefundedByProviderRef(
        event.tenantId,
        event.providerRef
      );
    case 'unknown':
      console.log(`[payments:webhook] unknown event ${event.eventId}`);
      return Promise.resolve(null);
    default: {
      const _exhaustive: never = event;
      return Promise.resolve(_exhaustive);
    }
  }
}

export const createCheckoutIntent = asyncHandler(
  async (req: Request, res: Response) => {
    const items = parseItems(req.body);

    if (req.siteConfig.payment.provider === 'none') {
      throw createError(NOT_CONFIGURED_MESSAGE, 501);
    }

    const providerName = req.siteConfig.payment.provider;
    const order = await paymentsService.createOrderDraft(
      tenantId(req),
      items,
      providerName
    );

    let paymentProvider;
    try {
      paymentProvider = getPaymentProvider(req.siteConfig);
    } catch (err) {
      const message = err instanceof Error ? err.message : '';
      if (
        message.includes('NotImplementedYet') ||
        message.includes('PAYMENTS_NOT_CONFIGURED')
      ) {
        throw createError(
          message.includes('PAYMENTS_NOT_CONFIGURED')
            ? NOT_CONFIGURED_MESSAGE
            : 'Payments configured in a later phase',
          501
        );
      }
      throw err;
    }

    const orderId = order._id;
    if (!orderId) {
      throw createError('Order id missing after create', 500);
    }

    let checkout: { url: string; providerRef: string };
    try {
      checkout = await paymentProvider.createCheckout(order);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Payment provider error';
      throw createError(message, 502);
    }

    await paymentsService.attachCheckoutToOrder(
      tenantId(req),
      orderId,
      checkout.providerRef,
      providerName
    );

    res.json({
      status: 'success',
      data: {
        url: checkout.url,
        orderId: String(orderId),
        providerRef: checkout.providerRef,
      },
    });
  }
);

export const handleWebhook = asyncHandler(async (req: Request, res: Response) => {
  const providerParam = req.params.provider;
  const siteConfig = siteConfigForWebhook(providerParam);

  let paymentProvider;
  try {
    paymentProvider = getPaymentProvider(siteConfig);
  } catch (err) {
    const message = err instanceof Error ? err.message : '';
    if (
      message.includes('NotImplementedYet') ||
      message.includes('Missing STRIPE')
    ) {
      console.log(`[payments:webhook] ${providerParam} skipped: ${message}`);
      res.status(200).send();
      return;
    }
    throw err;
  }

  if (!paymentProvider.verifyWebhook(req)) {
    throw createError('Invalid webhook signature', 400);
  }

  const event = paymentProvider.parseWebhookEvent(req);
  await applyWebhookEvent(event);

  res.status(200).send();
});
