import type { SiteConfig } from '../../server/src/types/site-config';

export const preset: Partial<SiteConfig> = {
  vertical: 'bar-restaurant',
  features: {
    catalog: true,
    content: true,
    intake: true,
    payments: true,
    auth: false,
  },
  payment: { provider: 'square' },
  branding: {
    name: 'Harbor & Hearth',
    tagline: 'Seasonal plates, local pours, private gatherings',
  },
  contact: {
    email: 'hello@harborandhearth.com',
    phone: '(555) 204-8812',
    address: '118 Dock Street, Portland ME',
  },
  locale: {
    currency: 'USD',
    timezone: 'America/New_York',
    lang: 'en-US',
  },
};
