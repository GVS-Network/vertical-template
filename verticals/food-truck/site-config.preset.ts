import type { SiteConfig } from '../../server/src/types/site-config';

/** Stub @ 4.2 — full preset in 4.5. */
export const preset: Partial<SiteConfig> = {
  vertical: 'food-truck',
  features: {
    catalog: true,
    content: true,
    intake: true,
    payments: true,
    auth: false,
  },
  payment: { provider: 'square' },
  branding: { name: 'Food Truck (preset stub)' },
};
