import type { SiteConfig } from '../../server/src/types/site-config';

/** Stub @ 4.2 — full opinionated defaults in 4.4. */
export const preset: Partial<SiteConfig> = {
  vertical: 'screen-printer',
  features: {
    catalog: true,
    content: true,
    intake: true,
    payments: true,
    auth: true,
  },
  payment: { provider: 'stripe' },
  branding: { name: 'Screen Printer (preset stub)' },
};
