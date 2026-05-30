import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';

import api from '../../../services/api';
import type {
  ContentPage,
  PageResponse,
  PagesResponse,
  PageWriteInput,
} from '../types';

function apiErrorMessage(err: unknown): string {
  if (axios.isAxiosError(err)) {
    const data = err.response?.data as { message?: string } | undefined;
    return data?.message ?? err.message;
  }
  return err instanceof Error ? err.message : 'Request failed';
}

export function useAdminPagesList() {
  const [pages, setPages] = useState<ContentPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get<PagesResponse>('/admin/pages');
      setPages(data.data);
    } catch (err) {
      setError(apiErrorMessage(err));
      setPages([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  return { pages, loading, error, reload };
}

export function useAdminPage(slug: string | undefined) {
  const [page, setPage] = useState<ContentPage | null>(null);
  const [loading, setLoading] = useState(Boolean(slug));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) {
      setPage(null);
      setLoading(false);
      return;
    }

    let cancelled = false;

    (async () => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await api.get<PageResponse>(`/admin/pages/${slug}`);
        if (!cancelled) {
          setPage(data.data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(apiErrorMessage(err));
          setPage(null);
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

  return { page, loading, error };
}

export async function createAdminPage(input: PageWriteInput): Promise<ContentPage> {
  const { data } = await api.post<PageResponse>('/content/pages', {
    slug: input.slug,
    title: input.title,
    body: input.body,
    hero: input.hero,
    status: input.status,
  });
  return data.data;
}

export async function updateAdminPage(
  slug: string,
  input: Omit<PageWriteInput, 'slug'>
): Promise<ContentPage> {
  const { data } = await api.put<PageResponse>(`/content/pages/${slug}`, {
    title: input.title,
    body: input.body,
    hero: input.hero,
    status: input.status,
  });
  return data.data;
}
