import type { SiteConfig } from '../../server/src/types/site-config';

/** Stub @ 4.2 — full preset in 4.5 (stress-test — all five packs). */
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
  branding: { name: 'Farm Source (preset stub)' },
};
