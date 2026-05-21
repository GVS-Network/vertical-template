import type { SiteConfig } from '../types/site-config';
import type { PaymentProvider } from '../types/payment-provider';

export type {
  Order,
  PaymentProvider,
  Product,
  WebhookEvent,
} from '../types/payment-provider';

/**
 * Returns the active payment adapter for this site. Factory body wired in 3.3–3.4.
 */
export function getPaymentProvider(siteConfig: SiteConfig): PaymentProvider {
  void siteConfig;
  throw new Error('NotImplementedYet: payments arrive in phase 3');
}
