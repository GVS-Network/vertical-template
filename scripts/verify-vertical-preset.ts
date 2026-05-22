/**
 * Verify a vertical preset tenant (Prompt 4.4+).
 * Usage: tsx scripts/verify-vertical-preset.ts <preset-key>
 * Example: tsx scripts/verify-vertical-preset.ts bar-restaurant
 */
import '../server/src/load-env';

import http from 'http';

import { connectDatabase, disconnectDatabase } from '../server/src/config/database';
import { scopedForTenant } from '../server/src/db/scoped';
import { Product } from '../server/src/features/catalog/schemas/product';
import { Page } from '../server/src/features/content/schemas/page';
import { FormDefinition } from '../server/src/features/intake/schemas/form-definition';
import { createApp } from '../server/src/app';
import {
  getBoundSiteConfig,
  primeBoundSiteConfig,
} from '../server/src/seams/bound-site-config';
import { defaultSiteConfig } from '../server/src/types/site-config.defaults';
import type { PaymentProviderName } from '../server/src/types/site-config';

type PresetExpectation = {
  tenantId: string;
  brandingName: string;
  provider: PaymentProviderName;
  productCount: number;
  pageSlugs: string[];
  formSlug: string;
};

const EXPECTATIONS: Record<string, PresetExpectation> = {
  'screen-printer': {
    tenantId: 'demo-screen-printer',
    brandingName: 'Inkline Print Co.',
    provider: 'stripe',
    productCount: 8,
    pageSlugs: ['home', 'about', 'portfolio'],
    formSlug: 'project-quote',
  },
  'bar-restaurant': {
    tenantId: 'demo-bar-restaurant',
    brandingName: 'Harbor & Hearth',
    provider: 'square',
    productCount: 8,
    pageSlugs: ['home', 'about', 'events'],
    formSlug: 'private-event',
  },
  'food-truck': {
    tenantId: 'demo-food-truck',
    brandingName: 'Sidewalk Tacos',
    provider: 'square',
    productCount: 8,
    pageSlugs: ['home', 'about', 'locations'],
    formSlug: 'catering',
  },
  'farm-source': {
    tenantId: 'demo-farm-source',
    brandingName: 'Black Oak Farm',
    provider: 'square',
    productCount: 8,
    pageSlugs: ['home', 'about', 'csa'],
    formSlug: 'wholesale-inquiry',
  },
};

async function httpGet(
  port: number,
  path: string
): Promise<{ status: number; body: unknown }> {
  return new Promise((resolve, reject) => {
    http
      .get(`http://127.0.0.1:${port}${path}`, (res) => {
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });
        res.on('end', () => {
          try {
            resolve({
              status: res.statusCode ?? 0,
              body: JSON.parse(data) as unknown,
            });
          } catch {
            resolve({ status: res.statusCode ?? 0, body: data });
          }
        });
      })
      .on('error', reject);
  });
}

async function main(): Promise<void> {
  const presetKey = process.argv[2]?.trim();
  if (!presetKey) {
    throw new Error('usage: tsx scripts/verify-vertical-preset.ts <preset-key>');
  }

  const expected = EXPECTATIONS[presetKey];
  if (!expected) {
    throw new Error(`no expectations for preset: ${presetKey}`);
  }

  process.env.BOUND_TENANT_ID = expected.tenantId;
  process.env.PAYMENT_PROVIDER = expected.provider;

  await connectDatabase();
  await primeBoundSiteConfig();

  const products = await scopedForTenant(Product, expected.tenantId).find().lean();
  if (products.length !== expected.productCount) {
    throw new Error(
      `expected ${expected.productCount} products, got ${products.length}`
    );
  }

  const pages = await scopedForTenant(Page, expected.tenantId).find().lean();
  const slugs = new Set(pages.map((p) => p.slug));
  for (const slug of expected.pageSlugs) {
    if (!slugs.has(slug)) {
      throw new Error(`missing page slug: ${slug}`);
    }
  }

  const forms = await scopedForTenant(FormDefinition, expected.tenantId).find().lean();
  if (forms.length !== 1 || forms[0]?.slug !== expected.formSlug) {
    throw new Error(`expected form ${expected.formSlug}`);
  }

  const boundConfig = getBoundSiteConfig() ?? defaultSiteConfig;
  const app = await createApp({ siteConfig: boundConfig });
  const server = app.listen(0);
  const port = await new Promise<number>((resolve) => {
    server.once('listening', () => {
      const addr = server.address();
      resolve(typeof addr === 'object' && addr ? addr.port : 0);
    });
  });

  const catalog = await httpGet(port, '/api/catalog/products');
  const catalogData = (catalog.body as { data?: unknown[] }).data;
  if (
    catalog.status !== 200 ||
    !Array.isArray(catalogData) ||
    catalogData.length !== expected.productCount
  ) {
    throw new Error(`catalog API: status=${catalog.status} count=${catalogData?.length}`);
  }

  for (const slug of expected.pageSlugs) {
    const page = await httpGet(port, `/api/content/pages/${slug}`);
    const pageSlug = (page.body as { data?: { slug?: string } }).data?.slug;
    if (page.status !== 200 || pageSlug !== slug) {
      throw new Error(`page ${slug}: status=${page.status}`);
    }
  }

  const form = await httpGet(port, `/api/intake/forms/${expected.formSlug}`);
  const formSlug = (form.body as { data?: { slug?: string } }).data?.slug;
  if (form.status !== 200 || formSlug !== expected.formSlug) {
    throw new Error(`form API: status=${form.status}`);
  }

  server.close();

  const config = getBoundSiteConfig();
  if (!config) {
    throw new Error('bound site config not primed');
  }
  if (config.tenantId !== expected.tenantId || config.vertical !== presetKey) {
    throw new Error('BOUND_TENANT_ID site config mismatch');
  }
  if (config.branding.name !== expected.brandingName) {
    throw new Error(`expected branding ${expected.brandingName}`);
  }
  if (config.payment.provider !== expected.provider) {
    throw new Error(`expected provider ${expected.provider}`);
  }

  if (presetKey === 'farm-source' && !config.features.auth) {
    throw new Error('farm-source must have auth feature on');
  }
  if (presetKey === 'bar-restaurant' && config.features.auth) {
    throw new Error('bar-restaurant must have auth feature off');
  }

  await disconnectDatabase();

  console.log(`verify-vertical-preset (${presetKey}): OK`);
  console.log(`  products: ${products.length} (e.g. ${products[0]?.name})`);
  console.log(`  pages: ${[...slugs].join(', ')}`);
  console.log(`  form: ${forms[0]?.slug}`);
  console.log(`  bound config: ${config.branding.name} / ${config.payment.provider}`);
}

main().catch((err) => {
  console.error('verify-vertical-preset FAILED:', err);
  void disconnectDatabase().finally(() => process.exit(1));
});
