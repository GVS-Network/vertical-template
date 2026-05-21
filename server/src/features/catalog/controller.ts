import { Request, Response } from 'express';
import { asyncHandler, createError } from '../../middleware/errorHandler';
import type { ProductStatus } from './schemas/product';
import * as catalogService from './service';

function tenantId(req: Request): string {
  return req.siteConfig.tenantId;
}

export const listProducts = asyncHandler(async (req: Request, res: Response) => {
  const status = req.query.status as ProductStatus | undefined;
  const filter = status ? { status } : { status: 'active' as ProductStatus };
  const products = await catalogService.listProducts(tenantId(req), filter);
  res.json({ status: 'success', data: products });
});

export const getProductBySlug = asyncHandler(
  async (req: Request, res: Response) => {
    const product = await catalogService.getProductBySlug(
      tenantId(req),
      req.params.slug
    );
    if (!product) {
      throw createError('Product not found', 404);
    }
    res.json({ status: 'success', data: product });
  }
);

/** TODO: require auth when features.auth is enabled (auth pack middleware). */
export const createProduct = asyncHandler(async (_req: Request, _res: Response) => {
  throw createError(
    'Catalog write routes require auth pack — not wired in phase 2.4',
    501
  );
});

/** TODO: require auth when features.auth is enabled (auth pack middleware). */
export const updateProduct = asyncHandler(async (_req: Request, _res: Response) => {
  throw createError(
    'Catalog write routes require auth pack — not wired in phase 2.4',
    501
  );
});
