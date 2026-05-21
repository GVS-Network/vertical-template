import { useCallback, useEffect, useState } from 'react';
import api from '../../../services/api';
import type {
  FormDefinition,
  FormDefinitionResponse,
  SubmissionResponse,
} from '../types';

export function useFormDefinition(slug: string | undefined) {
  const [form, setForm] = useState<FormDefinition | null>(null);
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
        const { data } = await api.get<FormDefinitionResponse>(
          `/intake/forms/${slug}`
        );
        if (!cancelled) {
          setForm(data.data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load form');
          setForm(null);
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

  const submit = useCallback(
    async (values: Record<string, unknown>) => {
      if (!slug) {
        throw new Error('Missing form slug');
      }
      const { data } = await api.post<SubmissionResponse>(
        `/intake/forms/${slug}`,
        { data: values }
      );
      return data.data;
    },
    [slug]
  );

  return { form, loading, error, submit };
}
