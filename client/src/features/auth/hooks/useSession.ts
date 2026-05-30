import { useAuth0 } from '@auth0/auth0-react';
import { useEffect, useState } from 'react';
import api, { setAuthToken } from '../../../services/api';
import { useSiteConfig } from '../../../contexts/SiteConfigContext';

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
  const { config } = useSiteConfig();
  const { isAuthenticated, isLoading: auth0Loading, getAccessTokenSilently } =
    useAuth0();
  const [session, setSession] = useState<SessionData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!config.features.auth) {
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
        const token = await getAccessTokenSilently();
        setAuthToken(token);
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
  }, [isAuthenticated, auth0Loading, config.features.auth, getAccessTokenSilently]);

  return {
    session,
    user: session?.user ?? null,
    tenantId: session?.tenantId ?? null,
    loading: auth0Loading || loading,
    error,
    isAuthenticated,
  };
}
