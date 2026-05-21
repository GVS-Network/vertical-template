import { useAuth0 } from '@auth0/auth0-react';
import { useEffect, useState } from 'react';
import api from '../../../services/api';
import { defaultSiteConfig } from '../../../types/site-config.defaults';

export interface SessionUser {
  sub: string | null;
  email: string | null;
  name: string | null;
  picture: string | null;
}

export interface SessionData {
  user: SessionUser;
  tenantId: string;
}

interface MeResponse {
  status: string;
  data: SessionData;
}

export function useSession() {
  const { isAuthenticated, isLoading: auth0Loading } = useAuth0();
  const [session, setSession] = useState<SessionData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!defaultSiteConfig.features.auth) {
      setSession(null);
      setLoading(false);
      return;
    }

    if (auth0Loading) {
      return;
    }

    if (!isAuthenticated) {
      setSession(null);
      setError(null);
      setLoading(false);
      return;
    }

    let cancelled = false;

    (async () => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await api.get<MeResponse>('/auth/me');
        if (!cancelled) {
          setSession(data.data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load session');
          setSession(null);
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
  }, [isAuthenticated, auth0Loading]);

  return {
    session,
    user: session?.user ?? null,
    tenantId: session?.tenantId ?? null,
    loading: auth0Loading || loading,
    error,
    isAuthenticated,
  };
}
