import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';

import api from '../../../services/api';
import type {
  ContentPost,
  EventWriteInput,
  PostResponse,
  PostsResponse,
} from '../types';
import { EVENT_TAG } from '../types';

function apiErrorMessage(err: unknown): string {
  if (axios.isAxiosError(err)) {
    const data = err.response?.data as { message?: string } | undefined;
    return data?.message ?? err.message;
  }
  return err instanceof Error ? err.message : 'Request failed';
}

function tagsWithEvent(existing?: string[]): string[] {
  const tags = new Set(existing ?? []);
  tags.add(EVENT_TAG);
  return [...tags];
}

export function useAdminEventsList() {
  const [events, setEvents] = useState<ContentPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get<PostsResponse>('/admin/posts', {
        params: { tag: EVENT_TAG },
      });
      setEvents(data.data);
    } catch (err) {
      setError(apiErrorMessage(err));
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  return { events, loading, error, reload };
}

export function useAdminEvent(slug: string | undefined) {
  const [event, setEvent] = useState<ContentPost | null>(null);
  const [loading, setLoading] = useState(Boolean(slug));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) {
      setEvent(null);
      setLoading(false);
      return;
    }

    let cancelled = false;

    (async () => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await api.get<PostResponse>(`/admin/posts/${slug}`);
        if (!cancelled) {
          setEvent(data.data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(apiErrorMessage(err));
          setEvent(null);
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

  return { event, loading, error };
}

export async function createAdminEvent(
  input: EventWriteInput
): Promise<ContentPost> {
  const { data } = await api.post<PostResponse>('/content/posts', {
    slug: input.slug,
    title: input.title,
    body: input.body,
    status: input.status,
    tags: [EVENT_TAG],
    eventStart: input.eventStart,
    eventEnd: input.eventEnd,
    eventLocation: input.eventLocation,
    links: input.links,
  });
  return data.data;
}

export async function updateAdminEvent(
  slug: string,
  input: EventWriteInput,
  existingTags?: string[]
): Promise<ContentPost> {
  const { data } = await api.put<PostResponse>(`/content/posts/${slug}`, {
    title: input.title,
    body: input.body,
    status: input.status,
    tags: tagsWithEvent(existingTags),
    eventStart: input.eventStart,
    eventEnd: input.eventEnd,
    eventLocation: input.eventLocation,
    links: input.links,
  });
  return data.data;
}
