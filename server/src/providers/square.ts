import crypto from 'crypto';
import type { Request } from 'express';
import { SquareClient, SquareEnvironment } from 'square';
import type * as Square from 'square';

import type { SiteConfig } from '../types/site-config';
import type {
  Order,
  PaymentProvider,
  Product,
  WebhookEvent,
} from '../types/payment-provider';

const SQUARE_EVENT = Symbol('squareWebhookEvent');

type RequestWithSquareEvent = Request & {
  [SQUARE_EVENT]?: SquareWebhookPayload;
};

type SquareWebhookPayload = {
  type?: string;
  event_id?: string;
  data?: {
    type?: string;
    id?: string;
    object?: Record<string, unknown>;
  };
};

function requireEnv(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`Missing ${name} in server/.env`);
  }
  return value;
}

function clientUrl(): string {
  return process.env.CLIENT_URL?.trim() || 'http://localhost:5173';
}

function webhookNotificationUrl(): string {
  return (
    process.env.SQUARE_WEBHOOK_NOTIFICATION_URL?.trim() ||
    'http://localhost:3001/api/payments/webhook/square'
  );
}

function squareEnvironment(): SquareEnvironment {
  const env = process.env.SQUARE_ENV?.trim().toLowerCase();
  return env === 'production'
    ? SquareEnvironment.Production
    : SquareEnvironment.Sandbox;
}

function currencyCode(siteConfig: SiteConfig): Square.Currency {
  return siteConfig.locale.currency.toUpperCase() as Square.Currency;
}

function idempotencyKey(prefix: string): string {
  return `${prefix}-${crypto.randomUUID()}`;
}

function findVariationIdForSku(
  items: Square.CatalogObject[] | undefined,
  sku: string
): string | null {
  if (!items?.length) {
    return null;
  }
  for (const obj of items) {
    if (obj.type !== 'ITEM') {
      continue;
    }
    const variations = obj.itemData?.variations ?? [];
    for (const variation of variations) {
      if (variation.type !== 'ITEM_VARIATION') {
        continue;
      }
      if (variation.itemVariationData?.sku === sku && variation.id) {
        return variation.id;
      }
    }
  }
  return null;
}

function verifySquareSignature(
  requestBody: string,
  signatureHeader: string,
  signatureKey: string,
  notificationUrl: string
): boolean {
  const hmac = crypto.createHmac('sha256', signatureKey);
  hmac.update(notificationUrl + requestBody);
  const digest = hmac.digest('base64');
  return digest === signatureHeader;
}

function parseOrderUpdated(
  payload: SquareWebhookPayload,
  eventId: string
): WebhookEvent | null {
  const updated = payload.data?.object?.order_updated as
    | { state?: string; order_id?: string }
    | undefined;
  const squareOrderId =
    updated?.order_id ?? payload.data?.id ?? payload.data?.object?.id;
  if (!squareOrderId || typeof squareOrderId !== 'string') {
    return null;
  }

  const state = updated?.state?.toUpperCase();
  const providerRef = squareOrderId;

  if (state === 'PAID' || state === 'COMPLETED') {
    return {
      type: 'order.paid',
      providerRef,
      eventId,
      tenantId: 'default',
      orderId: '',
    };
  }
  if (state === 'CANCELED' || state === 'CANCELLED') {
    return {
      type: 'order.failed',
      providerRef,
      eventId,
      tenantId: 'default',
      orderId: '',
    };
  }
  return null;
}

export function createSquarePaymentProvider(
  siteConfig: SiteConfig
): PaymentProvider {
  let client: SquareClient | undefined;
  const getClient = (): SquareClient => {
    if (!client) {
      client = new SquareClient({
        token: requireEnv('SQUARE_ACCESS_TOKEN'),
        environment: squareEnvironment(),
      });
    }
    return client;
  };

  const locationId = (): string => requireEnv('SQUARE_LOCATION_ID');
  const currency = currencyCode(siteConfig);

  return {
    key: 'square',

    async createCheckout(order: Order): Promise<{ url: string; providerRef: string }> {
      const square = getClient();
      const orderId = order._id ? String(order._id) : '';
      if (!orderId) {
        throw new Error('Order must have _id before createCheckout');
      }

      const lineItems: Square.OrderLineItem[] = order.items.map((item) => ({
        name: item.name,
        quantity: String(item.qty),
        itemType: 'ITEM',
        basePriceMoney: {
          amount: BigInt(item.price),
          currency,
        },
      }));

      const createOrderResponse = await square.orders.create({
        idempotencyKey: idempotencyKey('order'),
        order: {
          locationId: locationId(),
          lineItems,
          metadata: {
            tenantId: order.tenantId,
            orderId,
          },
        },
      });

      const squareOrder = createOrderResponse.order;
      if (!squareOrder?.id) {
        throw new Error('Square createOrder did not return an order id');
      }

      const linkResponse = await square.checkout.paymentLinks.create({
        idempotencyKey: idempotencyKey('plink'),
        order: squareOrder,
        checkoutOptions: {
          redirectUrl: `${clientUrl()}/?checkout=success&orderId=${orderId}`,
        },
      });

      const url = linkResponse.paymentLink?.url ?? linkResponse.paymentLink?.longUrl;
      if (!url) {
        throw new Error('Square payment link did not return a url');
      }

      return { url, providerRef: squareOrder.id };
    },

    verifyWebhook(req: Request): boolean {
      const signatureHeader = req.headers['x-square-hmacsha256-signature'];
      if (!signatureHeader || Array.isArray(signatureHeader)) {
        return false;
      }

      const rawBody = req.body;
      if (!Buffer.isBuffer(rawBody)) {
        return false;
      }

      const requestBody = rawBody.toString();
      const valid = verifySquareSignature(
        requestBody,
        signatureHeader,
        requireEnv('SQUARE_WEBHOOK_SIGNATURE_KEY'),
        webhookNotificationUrl()
      );

      if (!valid) {
        return false;
      }

      try {
        const payload = JSON.parse(requestBody) as SquareWebhookPayload;
        (req as RequestWithSquareEvent)[SQUARE_EVENT] = payload;
        return true;
      } catch {
        return false;
      }
    },

    parseWebhookEvent(req: Request): WebhookEvent {
      const payload = (req as RequestWithSquareEvent)[SQUARE_EVENT];
      if (!payload) {
        throw new Error('parseWebhookEvent called before verifyWebhook');
      }

      const eventId = payload.event_id ?? crypto.randomUUID();
      const eventType = payload.type ?? 'unknown';

      if (eventType === 'order.updated') {
        const mapped = parseOrderUpdated(payload, eventId);
        if (mapped) {
          return mapped;
        }
      }

      if (eventType === 'refund.created') {
        const refund = payload.data?.object?.refund as
          | { order_id?: string }
          | undefined;
        const providerRef =
          (typeof refund?.order_id === 'string' && refund.order_id) ||
          (typeof payload.data?.id === 'string' ? payload.data.id : '');
        return {
          type: 'order.refunded',
          providerRef,
          eventId,
          tenantId: 'default',
          orderId: '',
        };
      }

      return { type: 'unknown', eventId };
    },

    async syncInventory(products: Product[]): Promise<void> {
      const square = getClient();
      const locId = locationId();
      const changes: Square.InventoryChange[] = [];

      for (const product of products) {
        if (!product.sku?.trim() || product.stock === null || product.stock === undefined) {
          continue;
        }

        const searchResponse = await square.catalog.searchItems({
          textFilter: product.sku,
          limit: 25,
        });

        const variationId = findVariationIdForSku(searchResponse.items, product.sku);
        if (!variationId) {
          console.warn(
            `[square:syncInventory] no catalog variation for sku=${product.sku}`
          );
          continue;
        }

        changes.push({
          type: 'PHYSICAL_COUNT',
          physicalCount: {
            catalogObjectId: variationId,
            catalogObjectType: 'ITEM_VARIATION',
            state: 'IN_STOCK',
            locationId: locId,
            quantity: String(product.stock),
            occurredAt: new Date().toISOString(),
          },
        });
      }

      if (changes.length === 0) {
        return;
      }

      await square.inventory.batchCreateChanges({
        idempotencyKey: idempotencyKey('inv'),
        changes,
        ignoreUnchangedCounts: true,
      });

      console.log(
        `[square:syncInventory] pushed ${changes.length} physical count(s) to location ${locId}`
      );
    },
  };
}
