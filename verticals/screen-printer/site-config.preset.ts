import type { SiteConfig } from '../../server/src/types/site-config';

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
  branding: {
    name: 'Inkline Print Co.',
    tagline: 'Custom apparel, promo goods, and rush runs',
  },
  contact: {
    email: 'orders@inklineprint.co',
    phone: '(555) 312-4470',
    address: '1420 Warehouse Row, Suite B, Chicago IL',
  },
  locale: {
    currency: 'USD',
    timezone: 'America/Chicago',
    lang: 'en-US',
  },
};
