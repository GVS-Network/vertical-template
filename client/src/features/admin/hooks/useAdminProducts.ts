import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';

import api from '../../../services/api';
import type {
  CatalogProduct,
  ProductResponse,
  ProductsResponse,
  ProductWriteInput,
} from '../types';
import { PRODUCT_DESCRIPTION_KEY } from '../types';

function apiErrorMessage(err: unknown): string {
  if (axios.isAxiosError(err)) {
    const data = err.response?.data as { message?: string } | undefined;
    return data?.message ?? err.message;
  }
  return err instanceof Error ? err.message : 'Request failed';
}

function skuFromSlug(slug: string): string {
  const normalized = slug.replace(/-/g, '_').toUpperCase();
  return normalized.slice(0, 64) || 'SKU';
}

function attributesWithDescription(
  description: string,
  existing?: Record<string, unknown>
): Record<string, unknown> {
  const attributes = { ...(existing ?? {}) };
  const trimmed = description.trim();
  if (trimmed) {
    attributes[PRODUCT_DESCRIPTION_KEY] = trimmed;
  } else {
    delete attributes[PRODUCT_DESCRIPTION_KEY];
  }
  return attributes;
}

export function descriptionFromProduct(product: CatalogProduct | null | undefined): string {
  const value = product?.attributes?.[PRODUCT_DESCRIPTION_KEY];
  return typeof value === 'string' ? value : '';
}

export function useAdminProductsList() {
  const [products, setProducts] = useState<CatalogProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get<ProductsResponse>('/admin/products');
      setProducts(data.data);
    } catch (err) {
      setError(apiErrorMessage(err));
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  return { products, loading, error, reload };
}

export function useAdminProduct(slug: string | undefined) {
  const [product, setProduct] = useState<CatalogProduct | null>(null);
  const [loading, setLoading] = useState(Boolean(slug));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) {
      setProduct(null);
      setLoading(false);
      return;
    }

    let cancelled = false;

    (async () => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await api.get<ProductResponse>(`/admin/products/${slug}`);
        if (!cancelled) {
          setProduct(data.data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(apiErrorMessage(err));
          setProduct(null);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [slug]);

  return { product, loading, error };
}

export async function createAdminProduct(
  input: ProductWriteInput
): Promise<CatalogProduct> {
  if (!input.slug) {
    throw new Error('Slug is required');
  }
  const { data } = await api.post<ProductResponse>('/catalog/products', {
    name: input.name,
    slug: input.slug,
    sku: skuFromSlug(input.slug),
    price: input.priceCents,
    status: input.status,
    attributes: attributesWithDescription(input.description),
  });
  return data.data;
}

export async function updateAdminProduct(
  slug: string,
  input: ProductWriteInput,
  existingAttributes?: Record<string, unknown>
): Promise<CatalogProduct> {
  const { data } = await api.put<ProductResponse>(`/catalog/products/${slug}`, {
    name: input.name,
    price: input.priceCents,
    status: input.status,
    attributes: attributesWithDescription(input.description, existingAttributes),
  });
  return data.data;
}
