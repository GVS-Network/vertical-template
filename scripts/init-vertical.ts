/**
 * Stamp a tenant from a vertical preset (Prompt 4.3).
 *
 * Usage:
 *   npm run init:vertical -- --preset=screen-printer --tenant=demo-sp
 *   npm run init:vertical -- --preset=food-truck --tenant=greenline --force
 *
 * Requires MONGODB_URI in server/.env.
 */
import { existsSync, readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

import { connectDatabase, disconnectDatabase } from '../server/src/config/database';
import { scopedForTenant } from '../server/src/db/scoped';
import { Product } from '../server/src/features/catalog/schemas/product';
import { Page } from '../server/src/features/content/schemas/page';
import { Post } from '../server/src/features/content/schemas/post';
import { FormDefinition } from '../server/src/features/intake/schemas/form-definition';
import { Submission } from '../server/src/features/intake/schemas/submission';
import { Order } from '../server/src/features/payments/schemas/order';
import { TenantRegistry } from '../server/src/models/tenant-registry';
import {
  isVerticalPresetKey,
  verticalPresets,
  type VerticalPresetKey,
} from '../verticals/registry';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const RESERVED_TENANT_IDS = new Set(['default', 'admin', 'system']);

type SeedProduct = {
  name: string;
  slug: string;
  sku: string;
  price: number;
  stock?: number | null;
  status?: 'active' | 'draft' | 'archived';
  attributes?: Record<string, unknown>;
};

type SeedPage = {
  slug: string;
  title: string;
  body: string;
  status?: 'published' | 'draft' | 'archived';
  hero?: { imageUrl?: string; headline?: string; subheadline?: string };
};

type SeedForm = {
  slug: string;
  title: string;
  fields: Array<{
    name: string;
    type: 'text' | 'email' | 'textarea' | 'select' | 'checkbox';
    required: boolean;
    options?: string[];
  }>;
  submitButtonLabel?: string;
};

type InitArgs = {
  preset: string;
  tenant: string;
  force: boolean;
};

type SeedCounts = {
  products: number;
  pages: number;
  forms: number;
};

type Summary = {
  tenantId: string;
  preset: VerticalPresetKey;
  mode: 'created' | 'no-op' | 'force-reseed';
  counts: SeedCounts;
};

function parseArgs(argv: string[]): InitArgs {
  let preset = '';
  let tenant = '';
  let force = false;

  for (const arg of argv) {
    if (arg.startsWith('--preset=')) {
      preset = arg.slice('--preset='.length).trim();
    } else if (arg.startsWith('--tenant=')) {
      tenant = arg.slice('--tenant='.length).trim();
    } else if (arg === '--force') {
      force = true;
    } else if (arg === '--help' || arg === '-h') {
      console.log(
        'Usage: npm run init:vertical -- --preset=<key> --tenant=<id> [--force]'
      );
      process.exit(0);
    }
  }

  return { preset, tenant, force };
}

function validateTenantId(tenantId: string, force: boolean): void {
  if (!tenantId) {
    throw new Error('Missing --tenant=<id>');
  }
  if (!/^[a-z0-9-]+$/.test(tenantId)) {
    throw new Error(
      'tenant id must match [a-z0-9-]+ (lowercase letters, digits, hyphens)'
    );
  }
  if (RESERVED_TENANT_IDS.has(tenantId) && !force) {
    throw new Error(
      `tenant id "${tenantId}" is reserved — use another id or pass --force`
    );
  }
}

function loadJsonArray<T>(filePath: string): T[] {
  if (!existsSync(filePath)) {
    return [];
  }
  const raw = readFileSync(filePath, 'utf8');
  const parsed: unknown = JSON.parse(raw);
  if (!Array.isArray(parsed)) {
    throw new Error(`${filePath} must be a JSON array`);
  }
  return parsed as T[];
}

async function countTenantRows(tenantId: string): Promise<SeedCounts> {
  const [products, pages, forms] = await Promise.all([
    scopedForTenant(Product, tenantId).countDocuments(),
    scopedForTenant(Page, tenantId).countDocuments(),
    scopedForTenant(FormDefinition, tenantId).countDocuments(),
  ]);
  return { products, pages, forms };
}

async function wipeTenantData(tenantId: string): Promise<void> {
  await Promise.all([
    scopedForTenant(Product, tenantId).deleteMany({}),
    scopedForTenant(Page, tenantId).deleteMany({}),
    scopedForTenant(Post, tenantId).deleteMany({}),
    scopedForTenant(FormDefinition, tenantId).deleteMany({}),
    scopedForTenant(Submission, tenantId).deleteMany({}),
    scopedForTenant(Order, tenantId).deleteMany({}),
  ]);
}

async function seedPresetData(
  presetKey: VerticalPresetKey,
  tenantId: string
): Promise<SeedCounts> {
  const presetDir = join(ROOT, 'verticals', presetKey);
  const entry = verticalPresets[presetKey];

  const products = loadJsonArray<SeedProduct>(join(presetDir, 'seed/products.json'));
  const pages = loadJsonArray<SeedPage>(join(presetDir, 'seed/pages.json'));
  const forms = loadJsonArray<SeedForm>(join(presetDir, 'seed/forms.json'));

  const productModel = scopedForTenant(Product, tenantId);
  for (const row of products) {
    const attributes = row.attributes ?? {};
    const parsed = entry.productAttributesSchema.safeParse(attributes);
    if (!parsed.success) {
      throw new Error(
        `Invalid product attributes for sku=${row.sku}: ${parsed.error.message}`
      );
    }
    await productModel.create({
      name: row.name,
      slug: row.slug,
      sku: row.sku,
      price: row.price,
      stock: row.stock ?? null,
      status: row.status ?? 'active',
      attributes: parsed.data as Record<string, unknown>,
    });
  }

  const pageModel = scopedForTenant(Page, tenantId);
  for (const row of pages) {
    await pageModel.create({
      slug: row.slug,
      title: row.title,
      body: row.body,
      status: row.status ?? 'published',
      hero: row.hero,
    });
  }

  const formModel = scopedForTenant(FormDefinition, tenantId);
  for (const row of forms) {
    await formModel.create({
      slug: row.slug,
      title: row.title,
      fields: row.fields,
      submitButtonLabel: row.submitButtonLabel ?? 'Submit',
    });
  }

  return {
    products: products.length,
    pages: pages.length,
    forms: forms.length,
  };
}

function printSummary(summary: Summary): void {
  const { tenantId, preset, mode, counts } = summary;
  const line = '─'.repeat(52);
  console.log('');
  console.log('init-vertical summary');
  console.log(line);
  console.log(`  tenant       ${tenantId}`);
  console.log(`  preset       ${preset}`);
  console.log(`  mode         ${mode}`);
  console.log(line);
  console.log(`  products     ${counts.products}`);
  console.log(`  pages        ${counts.pages}`);
  console.log(`  forms        ${counts.forms}`);
  console.log(line);
  console.log('');
}

async function main(): Promise<void> {
  const { preset, tenant, force } = parseArgs(process.argv.slice(2));

  if (!preset) {
    throw new Error('Missing --preset=<key>');
  }
  if (!isVerticalPresetKey(preset)) {
    throw new Error(
      `Unknown preset "${preset}" — valid: screen-printer, bar-restaurant, food-truck, farm-source`
    );
  }

  validateTenantId(tenant, force);

  dotenv.config({ path: join(ROOT, 'server/.env') });

  await connectDatabase();

  const existing = await TenantRegistry.findById(tenant).lean();

  if (existing && !force) {
    if (existing.preset !== preset) {
      throw new Error(
        `tenant "${tenant}" already initialized for preset "${existing.preset}" — use --force to replace`
      );
    }
    const counts = await countTenantRows(tenant);
    printSummary({
      tenantId: tenant,
      preset,
      mode: 'no-op',
      counts,
    });
    await disconnectDatabase();
    return;
  }

  if (existing && force) {
    await wipeTenantData(tenant);
    await TenantRegistry.deleteOne({ _id: tenant });
  } else if (!existing) {
    const orphanCounts = await countTenantRows(tenant);
    const hasOrphans =
      orphanCounts.products > 0 ||
      orphanCounts.pages > 0 ||
      orphanCounts.forms > 0;
    if (hasOrphans) {
      throw new Error(
        `tenant "${tenant}" has data but no _tenants registry row — pass --force to wipe and re-seed`
      );
    }
  }

  const now = new Date();
  await TenantRegistry.create({
    _id: tenant,
    preset,
    createdAt: now,
    seededAt: now,
  });

  const counts = await seedPresetData(preset, tenant);

  printSummary({
    tenantId: tenant,
    preset,
    mode: existing && force ? 'force-reseed' : 'created',
    counts,
  });

  await disconnectDatabase();
}

main().catch((err) => {
  console.error('init-vertical FAILED:', err);
  void disconnectDatabase().finally(() => process.exit(1));
});
