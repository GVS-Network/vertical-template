import type { SiteConfig } from '../../server/src/types/site-config';

export const preset: Partial<SiteConfig> = {
  vertical: 'farm-source',
  features: {
    catalog: true,
    content: true,
    intake: true,
    payments: true,
    auth: true,
  },
  payment: { provider: 'square' },
  branding: {
    name: 'Black Oak Farm',
    tagline: 'CSA shares, market stand, and wholesale for the valley',
  },
  contact: {
    email: 'orders@blackoakfarm.co',
    phone: '(555) 448-2290',
    address: '910 Black Oak Road, Hartland VT',
  },
  locale: {
    currency: 'USD',
    timezone: 'America/New_York',
    lang: 'en-US',
  },
};
