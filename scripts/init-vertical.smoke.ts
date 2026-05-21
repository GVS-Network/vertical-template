/**
 * init-vertical smoke (Prompt 4.3).
 * Run: npm run test:init-vertical
 */
import { readFileSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';
import dotenv from 'dotenv';

import { connectDatabase, disconnectDatabase } from '../server/src/config/database';
import { scopedForTenant } from '../server/src/db/scoped';
import { Product } from '../server/src/features/catalog/schemas/product';
import { TenantRegistry } from '../server/src/models/tenant-registry';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const PRESET = 'screen-printer';
const TENANT = 'smoke-init-vertical';
const PRODUCTS_PATH = join(ROOT, 'verticals', PRESET, 'seed/products.json');

function runInit(args: string): void {
  execSync(`npx tsx scripts/init-vertical.ts ${args}`, {
    cwd: ROOT,
    stdio: 'pipe',
  });
}

async function main(): Promise<void> {
  dotenv.config({ path: join(ROOT, 'server/.env') });

  const originalProducts = readFileSync(PRODUCTS_PATH, 'utf8');

  try {
    writeFileSync(
      PRODUCTS_PATH,
      `${JSON.stringify(
        [
          {
            name: 'Smoke Test Tee',
            slug: 'smoke-test-tee',
            sku: 'SMOKE-001',
            price: 1999,
            stock: 3,
            status: 'active',
            attributes: { printSides: 'two', minQty: 12 },
          },
        ],
        null,
        2
      )}\n`
    );

    runInit(`--preset=${PRESET} --tenant=${TENANT} --force`);

    await connectDatabase();
    const registry = await TenantRegistry.findById(TENANT).lean();
    if (!registry || registry.preset !== PRESET) {
      throw new Error('_tenants row missing or wrong preset');
    }
    const productCount = await scopedForTenant(Product, TENANT).countDocuments();
    if (productCount !== 1) {
      throw new Error(`expected 1 product, got ${productCount}`);
    }
    await disconnectDatabase();

    runInit(`--preset=${PRESET} --tenant=${TENANT}`);

    await connectDatabase();
    const afterNoop = await scopedForTenant(Product, TENANT).countDocuments();
    if (afterNoop !== 1) {
      throw new Error(`idempotent re-run changed product count: ${afterNoop}`);
    }
    await disconnectDatabase();

    console.log('init-vertical smoke: seed + registry + idempotency OK');
  } finally {
    writeFileSync(PRODUCTS_PATH, originalProducts);
    try {
      runInit(`--preset=${PRESET} --tenant=${TENANT} --force`);
    } catch {
      // ignore cleanup errors
    }
    try {
      await connectDatabase();
      await TenantRegistry.deleteOne({ _id: TENANT });
      await disconnectDatabase();
    } catch {
      // ignore
    }
  }
}

main().catch((err) => {
  console.error('init-vertical smoke FAILED:', err);
  process.exit(1);
});
