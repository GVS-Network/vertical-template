import type { SiteConfig } from '../types/site-config';
import type { PaymentProvider } from '../types/payment-provider';
import { createStripePaymentProvider } from '../providers/stripe';

export type {
  Order,
  PaymentProvider,
  Product,
  WebhookEvent,
} from '../types/payment-provider';

export function getPaymentProvider(siteConfig: SiteConfig): PaymentProvider {
  const { provider } = siteConfig.payment;

  if (provider === 'none') {
    throw new Error(
      'PAYMENTS_NOT_CONFIGURED: set siteConfig.payment.provider to stripe or square'
    );
  }

  if (provider === 'stripe') {
    return createStripePaymentProvider(siteConfig);
  }

  if (provider === 'square') {
    throw new Error('NotImplementedYet: Square provider arrives in phase 3.4');
  }

  throw new Error(`Unknown payment provider: ${String(provider)}`);
}
