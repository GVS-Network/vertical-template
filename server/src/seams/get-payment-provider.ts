import type { SiteConfig } from '../types/site-config';
import type { PaymentProvider } from '../types/payment-provider';

export function getPaymentProvider(siteConfig: SiteConfig): PaymentProvider {
  void siteConfig;
  throw new Error('NotImplementedYet: payments arrive in phase 3');
}
