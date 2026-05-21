/**
 * Pack-pattern compliance smoke: each pack off → probe route 404; all off → all 404.
 * Run: npm run test:pack-compliance --prefix server
 */
import request from 'supertest';

import { createApp } from '../app';
import {
  FEATURE_PACK_KEYS,
  type FeaturePackKey,
} from './registry';
import type { SiteConfig } from '../types/site-config';
import { defaultSiteConfig } from '../types/site-config.defaults';

const allFeaturesOn: SiteConfig['features'] = {
  catalog: true,
  content: true,
  intake: true,
  payments: true,
  auth: true,
};

const PROBES: Record<
  FeaturePackKey,
  { method: 'get' | 'post'; path: string; body?: object }
> = {
  catalog: { method: 'get', path: '/api/catalog/products' },
  content: { method: 'get', path: '/api/content/posts' },
  intake: { method: 'get', path: '/api/intake/forms/contact' },
  payments: {
    method: 'post',
    path: '/api/payments/checkout/intent',
    body: {
      items: [{ name: 'Probe', sku: 'P-0', price: 100, qty: 1 }],
    },
  },
  auth: { method: 'get', path: '/api/auth/me' },
};

async function probe(
  app: Awaited<ReturnType<typeof createApp>>,
  key: FeaturePackKey
): Promise<number> {
  const { method, path, body } = PROBES[key];
  if (method === 'post') {
    const res = await request(app).post(path).send(body);
    return res.status;
  }
  const res = await request(app).get(path);
  return res.status;
}

async function assertSiblingMounted(
  app: Awaited<ReturnType<typeof createApp>>,
  offKey: FeaturePackKey,
  features: SiteConfig['features']
): Promise<void> {
  if (features.auth && offKey !== 'auth') {
    const status = await probe(app, 'auth');
    if (status === 404) {
      throw new Error(
        `only-${offKey}-off: auth should stay mounted but got 404 on ${PROBES.auth.path}`
      );
    }
    return;
  }
  if (features.payments && offKey !== 'payments') {
    const res = await request(app)
      .post('/api/payments/webhook/stripe')
      .send({});
    if (res.status === 404) {
      throw new Error(
        `only-${offKey}-off: payments should stay mounted but got 404 on webhook`
      );
    }
    return;
  }
  throw new Error(`only-${offKey}-off: no DB-free sibling probe available`);
}

async function main(): Promise<void> {
  process.env.SKIP_PACK_SEEDS = '1';
  process.env.AUTH0_ISSUER_BASE_URL ??=
    'https://pack-compliance-smoke.auth0.com/';
  process.env.AUTH0_AUDIENCE ??= 'https://pack-compliance-smoke/api';

  const allOff: SiteConfig = {
    ...defaultSiteConfig,
    features: {
      catalog: false,
      content: false,
      intake: false,
      payments: false,
      auth: false,
    },
  };

  const appAllOff = await createApp({ siteConfig: allOff });
  for (const key of FEATURE_PACK_KEYS) {
    const status = await probe(appAllOff, key);
    if (status !== 404) {
      throw new Error(
        `all-off ${key}: expected 404 on ${PROBES[key].path}, got ${status}`
      );
    }
  }

  for (const offKey of FEATURE_PACK_KEYS) {
    const config: SiteConfig = {
      ...defaultSiteConfig,
      features: { ...allFeaturesOn, [offKey]: false },
    };
    const app = await createApp({ siteConfig: config });
    const status = await probe(app, offKey);
    if (status !== 404) {
      throw new Error(
        `only-${offKey}-off: expected 404 on ${PROBES[offKey].path}, got ${status}`
      );
    }
    await assertSiblingMounted(app, offKey, config.features);
  }

  console.log(
    'pack-compliance.smoke: all-off 404; each single-pack-off 404 on probe; siblings stay mounted'
  );
}

main().catch((err) => {
  console.error('pack-compliance.smoke FAILED:', err);
  process.exit(1);
});
