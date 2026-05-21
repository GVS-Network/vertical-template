/**
 * Push catalog stock to Square Inventory API (Prompt 3.4).
 *
 * Prerequisites:
 *   - server/.env: SQUARE_ACCESS_TOKEN, SQUARE_LOCATION_ID, SQUARE_ENV=sandbox
 *   - A catalog item variation in Square Sandbox with SKU matching SQUARE_SYNC_SKU
 *
 * Env (optional):
 *   SQUARE_SYNC_SKU   — default WDG-001 (catalog seed sku)
 *   SQUARE_SYNC_STOCK — default 42
 *
 * Run: npm run test:square-sync-inventory --prefix server
 */
import dotenv from 'dotenv';
import path from 'path';

import { defaultSiteConfig } from '../types/site-config.defaults';
import { getPaymentProvider } from '../seams/get-payment-provider';

dotenv.config({ path: path.join(__dirname, '../../.env') });

async function main(): Promise<void> {
  for (const key of [
    'SQUARE_ACCESS_TOKEN',
    'SQUARE_LOCATION_ID',
  ] as const) {
    if (!process.env[key]?.trim()) {
      throw new Error(`Missing ${key} in server/.env`);
    }
  }

  const sku = process.env.SQUARE_SYNC_SKU?.trim() || 'WDG-001';
  const stock = Number(process.env.SQUARE_SYNC_STOCK ?? '42');
  if (!Number.isFinite(stock) || stock < 0) {
    throw new Error('SQUARE_SYNC_STOCK must be a non-negative number');
  }

  const siteConfig = {
    ...defaultSiteConfig,
    payment: { provider: 'square' as const },
  };
  const provider = getPaymentProvider(siteConfig);
  if (!provider.syncInventory) {
    throw new Error('Square provider does not implement syncInventory');
  }

  await provider.syncInventory([
    {
      tenantId: 'default',
      name: `sync test ${sku}`,
      slug: `sync-${sku.toLowerCase()}`,
      sku,
      price: 0,
      stock,
      status: 'active',
      attributes: {},
    },
  ]);

  console.log('square-sync-inventory: pushed physical count');
  console.log(`  sku:   ${sku}`);
  console.log(`  stock: ${stock}`);
  console.log('');
  console.log(
    'Confirm in Square Dashboard → Items → Inventory for your sandbox location.'
  );
}

main().catch((err) => {
  console.error('square-sync-inventory FAILED:', err);
  process.exit(1);
});
