import type { HydratedDocument } from 'mongoose';
import { scopedForTenant } from '../../db/scoped';
import {
  Product,
  type IProduct,
  type ProductStatus,
} from './schemas/product';

export type ProductListFilter = {
  status?: ProductStatus;
};

export type CreateProductInput = {
  name: string;
  slug: string;
  sku: string;
  price: number;
  stock?: number | null;
  status?: ProductStatus;
  attributes?: Record<string, unknown>;
};

export type UpdateProductInput = Partial<CreateProductInput>;

export async function listProducts(
  tenantId: string,
  filter: ProductListFilter = {}
): Promise<IProduct[]> {
  const products = scopedForTenant(Product, tenantId);
  const query: Record<string, unknown> = {};
  if (filter.status) {
    query.status = filter.status;
  }
  const docs = (await products
    .find(query)
    .sort({ name: 1 })) as HydratedDocument<IProduct>[];
  return docs.map((d) => d.toObject());
}

export async function getProductBySlug(
  tenantId: string,
  slug: string
): Promise<IProduct | null> {
  const products = scopedForTenant(Product, tenantId);
  const doc = (await products.findOne({
    slug: slug.toLowerCase(),
  })) as HydratedDocument<IProduct> | null;
  return doc ? doc.toObject() : null;
}

export async function createProduct(
  tenantId: string,
  input: CreateProductInput
): Promise<IProduct> {
  const products = scopedForTenant(Product, tenantId);
  const doc = await products.create({
    name: input.name,
    slug: input.slug.toLowerCase(),
    sku: input.sku,
    price: input.price,
    stock: input.stock ?? null,
    status: input.status ?? 'active',
    attributes: input.attributes ?? {},
  });
  return doc.toObject();
}

export async function updateProduct(
  tenantId: string,
  slug: string,
  input: UpdateProductInput
): Promise<IProduct | null> {
  const products = scopedForTenant(Product, tenantId);
  const update: Record<string, unknown> = { ...input };
  if (typeof input.slug === 'string') {
    update.slug = input.slug.toLowerCase();
  }
  const existing = await getProductBySlug(tenantId, slug);
  if (!existing) {
    return null;
  }
  await products.updateOne({ slug: slug.toLowerCase() }, update);
  return getProductBySlug(tenantId, slug);
}
