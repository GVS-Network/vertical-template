import type { SiteConfig } from '../../server/src/types/site-config';

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
  branding: {
    name: 'Sidewalk Tacos',
    tagline: 'Roaming lunch, brewery nights, and office catering',
  },
  contact: {
    email: 'hello@sidewalktacos.co',
    phone: '(555) 771-3304',
    address: 'Commissary Kitchen 4, Portland ME',
  },
  locale: {
    currency: 'USD',
    timezone: 'America/New_York',
    lang: 'en-US',
  },
};
