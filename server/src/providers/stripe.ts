import type { Request } from 'express';
import Stripe from 'stripe';

import type { SiteConfig } from '../types/site-config';
import type {
  Order,
  PaymentProvider,
  Product,
  WebhookEvent,
} from '../types/payment-provider';
import { NotSupportedError } from './not-supported';

const STRIPE_EVENT = Symbol('stripeWebhookEvent');

type RequestWithStripeEvent = Request & {
  [STRIPE_EVENT]?: Stripe.Event;
};

function requireEnv(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`Missing ${name} in server/.env`);
  }
  return value;
}

function clientUrl(): string {
  return (
    process.env.CLIENT_URL?.trim() ||
    'http://localhost:5173'
  );
}

function stripeClient(): Stripe {
  return new Stripe(requireEnv('STRIPE_SECRET_KEY'));
}

function currencyCode(siteConfig: SiteConfig): string {
  return siteConfig.locale.currency.toLowerCase();
}

export function createStripePaymentProvider(
  siteConfig: SiteConfig
): PaymentProvider {
  let stripe: Stripe | undefined;
  const getStripe = (): Stripe => {
    if (!stripe) {
      stripe = stripeClient();
    }
    return stripe;
  };
  const currency = currencyCode(siteConfig);

  return {
    key: 'stripe',

    async createCheckout(order: Order): Promise<{ url: string; providerRef: string }> {
      const stripe = getStripe();
      const orderId = order._id ? String(order._id) : '';
      if (!orderId) {
        throw new Error('Order must have _id before createCheckout');
      }

      const session = await stripe.checkout.sessions.create({
        mode: 'payment',
        line_items: order.items.map((item) => ({
          quantity: item.qty,
          price_data: {
            currency,
            unit_amount: item.price,
            product_data: { name: item.name },
          },
        })),
        metadata: {
          tenantId: order.tenantId,
          orderId,
        },
        success_url: `${clientUrl()}/?checkout=success&orderId=${orderId}`,
        cancel_url: `${clientUrl()}/?checkout=cancelled&orderId=${orderId}`,
      });

      if (!session.url) {
        throw new Error('Stripe Checkout Session did not return a url');
      }

      return { url: session.url, providerRef: session.id };
    },

    verifyWebhook(req: Request): boolean {
      const signature = req.headers['stripe-signature'];
      if (!signature || Array.isArray(signature)) {
        return false;
      }

      const rawBody = req.body;
      if (!Buffer.isBuffer(rawBody)) {
        return false;
      }

      try {
        const stripe = getStripe();
        const event = stripe.webhooks.constructEvent(
          rawBody,
          signature,
          requireEnv('STRIPE_WEBHOOK_SECRET')
        );
        (req as RequestWithStripeEvent)[STRIPE_EVENT] = event;
        return true;
      } catch {
        return false;
      }
    },

    parseWebhookEvent(req: Request): WebhookEvent {
      const event = (req as RequestWithStripeEvent)[STRIPE_EVENT];
      if (!event) {
        throw new Error('parseWebhookEvent called before verifyWebhook');
      }

      const eventId = event.id;

      switch (event.type) {
        case 'checkout.session.completed': {
          const session = event.data.object as Stripe.Checkout.Session;
          return {
            type: 'order.paid',
            providerRef: session.id,
            eventId,
            tenantId: session.metadata?.tenantId ?? 'default',
            orderId: session.metadata?.orderId ?? '',
          };
        }
        case 'checkout.session.expired': {
          const session = event.data.object as Stripe.Checkout.Session;
          return {
            type: 'order.failed',
            providerRef: session.id,
            eventId,
            tenantId: session.metadata?.tenantId ?? 'default',
            orderId: session.metadata?.orderId ?? '',
          };
        }
        case 'charge.refunded': {
          const charge = event.data.object as Stripe.Charge;
          return {
            type: 'order.refunded',
            providerRef:
              typeof charge.payment_intent === 'string'
                ? charge.payment_intent
                : charge.id,
            eventId,
            tenantId: charge.metadata?.tenantId ?? 'default',
            orderId: charge.metadata?.orderId ?? '',
          };
        }
        default:
          return { type: 'unknown', eventId };
      }
    },

    async syncInventory(_products: Product[]): Promise<void> {
      throw new NotSupportedError('syncInventory');
    },
  };
}
