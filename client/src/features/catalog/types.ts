export type ProductStatus = 'active' | 'draft' | 'archived';

export interface CatalogProduct {
  _id: string;
  name: string;
  slug: string;
  sku: string;
  price: number;
  stock: number | null;
  status: ProductStatus;
  attributes?: Record<string, unknown>;
}

export interface CatalogProductsResponse {
  status: string;
  data: CatalogProduct[];
}

export interface CatalogProductResponse {
  status: string;
  data: CatalogProduct;
}
