import { useCallback, useEffect, useState } from 'react';
import api from '../../../services/api';
import type {
  CatalogProduct,
  CatalogProductResponse,
  CatalogProductsResponse,
  ProductStatus,
} from '../types';

export function formatPriceCents(cents: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(cents / 100);
}

export function useProducts(status?: ProductStatus) {
  const [products, setProducts] = useState<CatalogProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get<CatalogProductsResponse>('/catalog/products', {
        params: status ? { status } : undefined,
      });
      setProducts(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load products');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [status]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return { products, loading, error, refetch: fetchProducts };
}

export function useProduct(slug: string | undefined) {
  const [product, setProduct] = useState<CatalogProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    (async () => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await api.get<CatalogProductResponse>(
          `/catalog/products/${slug}`
        );
        if (!cancelled) {
          setProduct(data.data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load product');
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
