import { scopedForTenant } from '../../db/scoped';
import { Product } from './schemas/product';

const SAMPLE_PRODUCTS = [
  {
    name: 'Sample Widget',
    slug: 'sample-widget',
    sku: 'WDG-001',
    price: 1999,
    stock: 42,
    status: 'active' as const,
    attributes: { category: 'demo' },
  },
  {
    name: 'Demo Kit',
    slug: 'demo-kit',
    sku: 'KIT-002',
    price: 4999,
    stock: 10,
    status: 'active' as const,
    attributes: { category: 'demo' },
  },
  {
    name: 'Starter Pack',
    slug: 'starter-pack',
    sku: 'PKG-003',
    price: 999,
    stock: null,
    status: 'active' as const,
    attributes: { category: 'demo', featured: true },
  },
];

/**
 * Dev-only seed when tenant has zero products. Not a migration.
 */
export async function seedCatalogProducts(tenantId: string): Promise<void> {
  if (process.env.NODE_ENV === 'production') {
    return;
  }

  const products = scopedForTenant(Product, tenantId);
  const count = await products.countDocuments();
  if (count > 0) {
    return;
  }

  for (const sample of SAMPLE_PRODUCTS) {
    await products.create(sample);
  }

  console.log(`[catalog:seed] inserted ${SAMPLE_PRODUCTS.length} products for tenantId=${tenantId}`);
}
