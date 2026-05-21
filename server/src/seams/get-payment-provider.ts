import type { SiteConfig } from '../types/site-config';
import type { PaymentProvider } from '../types/payment-provider';
import { createSquarePaymentProvider } from '../providers/square';
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
    return createSquarePaymentProvider(siteConfig);
  }

  throw new Error(`Unknown payment provider: ${String(provider)}`);
}
