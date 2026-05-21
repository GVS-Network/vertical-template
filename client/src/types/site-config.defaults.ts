import type { SiteConfig } from './site-config';

export const defaultSiteConfig: SiteConfig = {
  vertical: 'generic',
  tenantId: 'default',
  features: {
    catalog: true,
    content: false,
    intake: false,
    payments: false,
    auth: false,
  },
  payment: {
    provider: 'none',
  },
  branding: {
    name: 'Untitled Site',
  },
  contact: {},
  locale: {
    currency: 'USD',
    timezone: 'America/Chicago',
    lang: 'en-US',
  },
};
