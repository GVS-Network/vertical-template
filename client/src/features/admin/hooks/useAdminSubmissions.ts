import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';

import api from '../../../services/api';
import type {
  IntakeSubmission,
  SubmissionProcessedFilter,
  SubmissionResponse,
  SubmissionsListResponse,
} from '../types';

function apiErrorMessage(err: unknown): string {
  if (axios.isAxiosError(err)) {
    const data = err.response?.data as { message?: string } | undefined;
    return data?.message ?? err.message;
  }
  return err instanceof Error ? err.message : 'Request failed';
}

function processedParam(
  filter: SubmissionProcessedFilter
): boolean | undefined {
  if (filter === 'new') {
    return false;
  }
  if (filter === 'processed') {
    return true;
  }
  return undefined;
}

export function useAdminSubmissions(
  page: number,
  filter: SubmissionProcessedFilter
) {
  const [submissions, setSubmissions] = useState<IntakeSubmission[]>([]);
  const [meta, setMeta] = useState<SubmissionsListResponse['meta']>({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const processed = processedParam(filter);
      const { data } = await api.get<SubmissionsListResponse>(
        '/intake/submissions',
        {
          params: {
            page,
            limit: 20,
            ...(processed !== undefined ? { processed: String(processed) } : {}),
          },
        }
      );
      setSubmissions(data.data);
      setMeta(data.meta);
    } catch (err) {
      setError(apiErrorMessage(err));
      setSubmissions([]);
    } finally {
      setLoading(false);
    }
  }, [page, filter]);

  useEffect(() => {
    void reload();
  }, [reload]);

  return { submissions, meta, loading, error, reload };
}

export async function markSubmissionProcessed(
  id: string,
  processed: boolean
): Promise<IntakeSubmission> {
  const { data } = await api.patch<SubmissionResponse>(
    `/intake/submissions/${id}`,
    { processed }
  );
  return data.data;
}

export function formatSubmissionValue(value: unknown): string {
  if (value === null || value === undefined) {
    return '—';
  }
  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No';
  }
  if (typeof value === 'object') {
    return JSON.stringify(value);
  }
  return String(value);
}

export function formatFieldLabel(name: string): string {
  return name.charAt(0).toUpperCase() + name.slice(1).replace(/_/g, ' ');
}
