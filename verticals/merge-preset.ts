import { defaultSiteConfig } from '../server/src/types/site-config.defaults';
import type { SiteConfig } from '../server/src/types/site-config';

/**
 * Merge a vertical partial onto defaultSiteConfig (phase 4 preset pattern).
 * Deep-merges features; replaces payment/branding/contact/locale when provided.
 */
export function mergePreset(partial: Partial<SiteConfig>): SiteConfig {
  const features = {
    ...defaultSiteConfig.features,
    ...partial.features,
  };
  // see phase-6.1 — admin defaults on when auth is on unless preset overrides
  if (partial.features?.admin === undefined) {
    features.admin = features.auth;
  }

  return {
    ...defaultSiteConfig,
    ...partial,
    features,
    payment: {
      ...defaultSiteConfig.payment,
      ...partial.payment,
    },
    branding: {
      ...defaultSiteConfig.branding,
      ...partial.branding,
    },
    contact: {
      ...defaultSiteConfig.contact,
      ...partial.contact,
    },
    locale: {
      ...defaultSiteConfig.locale,
      ...partial.locale,
    },
  };
}
