/**
 * Verify screen-printer preset data (Prompt 4.4).
 * Run: tsx scripts/verify-screen-printer-preset.ts
 */
import '../server/src/load-env';

import http from 'http';

import { connectDatabase, disconnectDatabase } from '../server/src/config/database';
import { scopedForTenant } from '../server/src/db/scoped';
import { Product } from '../server/src/features/catalog/schemas/product';
import { Page } from '../server/src/features/content/schemas/page';
import { FormDefinition } from '../server/src/features/intake/schemas/form-definition';
import { createApp } from '../server/src/app';
import { primeBoundSiteConfig } from '../server/src/seams/bound-site-config';
import { getSiteConfig } from '../server/src/seams/get-site-config';

const TENANT = 'demo-screen-printer';

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
  process.env.BOUND_TENANT_ID = TENANT;

  await connectDatabase();
  await primeBoundSiteConfig();

  const products = await scopedForTenant(Product, TENANT).find().lean();
  if (products.length !== 8) {
    throw new Error(`expected 8 products, got ${products.length}`);
  }

  const pages = await scopedForTenant(Page, TENANT).find().lean();
  const slugs = new Set(pages.map((p) => p.slug));
  for (const expected of ['home', 'about', 'portfolio']) {
    if (!slugs.has(expected)) {
      throw new Error(`missing page slug: ${expected}`);
    }
  }

  const forms = await scopedForTenant(FormDefinition, TENANT).find().lean();
  if (forms.length !== 1 || forms[0]?.slug !== 'project-quote') {
    throw new Error('expected project-quote form');
  }

  const app = await createApp();
  const server = app.listen(0);
  const port = await new Promise<number>((resolve) => {
    server.once('listening', () => {
      const addr = server.address();
      resolve(typeof addr === 'object' && addr ? addr.port : 0);
    });
  });

  const catalog = await httpGet(port, '/api/catalog/products');
  const catalogData = (catalog.body as { data?: unknown[] }).data;
  if (catalog.status !== 200 || !Array.isArray(catalogData) || catalogData.length !== 8) {
    throw new Error(`catalog API: status=${catalog.status} count=${catalogData?.length}`);
  }

  for (const slug of ['home', 'about', 'portfolio'] as const) {
    const page = await httpGet(port, `/api/content/pages/${slug}`);
    const pageSlug = (page.body as { data?: { slug?: string } }).data?.slug;
    if (page.status !== 200 || pageSlug !== slug) {
      throw new Error(`page ${slug}: status=${page.status}`);
    }
  }

  const form = await httpGet(port, '/api/intake/forms/project-quote');
  const formSlug = (form.body as { data?: { slug?: string } }).data?.slug;
  if (form.status !== 200 || formSlug !== 'project-quote') {
    throw new Error(`form API: status=${form.status}`);
  }

  server.close();

  const config = getSiteConfig({} as import('express').Request);
  if (config.tenantId !== TENANT || config.vertical !== 'screen-printer') {
    throw new Error('BOUND_TENANT_ID site config mismatch');
  }
  if (config.branding.name !== 'Inkline Print Co.') {
    throw new Error('expected Inkline branding');
  }

  await disconnectDatabase();

  console.log('verify-screen-printer-preset: OK');
  console.log(`  products: ${products.length} (e.g. ${products[0]?.name})`);
  console.log(`  pages: ${[...slugs].join(', ')}`);
  console.log(`  form: ${forms[0]?.slug}`);
  console.log(`  bound config: ${config.branding.name} / ${config.payment.provider}`);
}

main().catch((err) => {
  console.error('verify-screen-printer-preset FAILED:', err);
  void disconnectDatabase().finally(() => process.exit(1));
});
