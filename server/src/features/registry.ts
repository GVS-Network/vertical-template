import type { Express } from 'express';
import type { SiteConfig } from '../types/site-config';
import type { SiteConfigFeatures } from '../types/site-config';

export const FEATURE_PACK_KEYS = [
  'catalog',
  'content',
  'intake',
  'payments',
  'auth',
] as const;

export type FeaturePackKey = (typeof FEATURE_PACK_KEYS)[number];

export type FeaturePackModule = {
  register: (app: Express, siteConfig: SiteConfig) => void | Promise<void>;
};

const packLoaders: Record<
  FeaturePackKey,
  () => Promise<FeaturePackModule>
> = {
  catalog: () => import('./catalog'),
  content: () => import('./content'),
  intake: () => import('./intake'),
  payments: () => import('./payments'),
  auth: () => import('./auth'),
};

function isPackEnabled(
  features: SiteConfigFeatures,
  key: FeaturePackKey
): boolean {
  return features[key] === true;
}

/**
 * Registry gate (option b): only enabled packs are imported and registered.
 * Disabled packs log once at boot — no routes, no middleware.
 */
export async function mountFeaturePacks(
  app: Express,
  siteConfig: SiteConfig
): Promise<void> {
  for (const key of FEATURE_PACK_KEYS) {
    if (!isPackEnabled(siteConfig.features, key)) {
      console.log(`[feature:off] ${key}`);
      continue;
    }

    const mod = await packLoaders[key]();
    await mod.register(app, siteConfig);
  }
}
