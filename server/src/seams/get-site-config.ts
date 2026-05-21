import { Request } from 'express';
import type { PaymentProviderName, SiteConfig } from '../types/site-config';
import { defaultSiteConfig } from '../types/site-config.defaults';

/** Local dev: PAYMENT_PROVIDER=stripe|square in server/.env (see get-site-config seam). */
function paymentProviderFromEnv(): PaymentProviderName {
  const raw = process.env.PAYMENT_PROVIDER?.trim().toLowerCase();
  if (raw === 'stripe' || raw === 'square' || raw === 'none') {
    return raw;
  }
  return defaultSiteConfig.payment.provider;
}

/**
 * Single tenant-context seam. Phase 1: singleton default.
 * Phase 7: resolve from req.hostname / Tenant document — callers unchanged.
 */
export function getSiteConfig(req: Request): SiteConfig {
  void req;
  const provider = paymentProviderFromEnv();
  if (provider === defaultSiteConfig.payment.provider) {
    return defaultSiteConfig;
  }
  return {
    ...defaultSiteConfig,
    payment: { provider },
  };
}
