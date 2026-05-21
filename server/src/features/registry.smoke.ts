/**
 * Toggle-mount smoke: all features off → pack API namespaces return 404.
 * Run: npm run test:registry --prefix server
 */
import request from 'supertest';

import { createApp } from '../app';
import { FEATURE_PACK_KEYS } from './registry';
import type { SiteConfig } from '../types/site-config';
import { defaultSiteConfig } from '../types/site-config.defaults';

const allFeaturesOff: SiteConfig = {
  ...defaultSiteConfig,
  features: {
    catalog: false,
    content: false,
    intake: false,
    payments: false,
    auth: false,
  },
};

const PACK_API_PATHS = FEATURE_PACK_KEYS.map((key) => `/api/${key}`);

async function main(): Promise<void> {
  const app = await createApp({ siteConfig: allFeaturesOff });

  for (const path of PACK_API_PATHS) {
    const res = await request(app).get(path);
    if (res.status !== 404) {
      throw new Error(
        `${path}: expected 404, got ${res.status} body=${JSON.stringify(res.body)}`
      );
    }
  }

  const health = await request(app).get('/api/health');
  if (health.status !== 200) {
    throw new Error(`/api/health: expected 200, got ${health.status}`);
  }

  console.log('registry.smoke: all pack namespaces 404 with features off; health OK');
}

main().catch((err) => {
  console.error('registry.smoke FAILED:', err);
  process.exit(1);
});
