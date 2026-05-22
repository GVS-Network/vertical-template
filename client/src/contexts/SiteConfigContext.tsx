import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import api from '../services/api';
import type { SiteConfig } from '../types/site-config';
import { defaultSiteConfig } from '../types/site-config.defaults';

export type PublicSiteMeta = SiteConfig & {
  primaryFormSlug: string | null;
};

type SiteConfigContextValue = {
  config: PublicSiteMeta;
  loading: boolean;
};

const SiteConfigContext = createContext<SiteConfigContextValue>({
  config: { ...defaultSiteConfig, primaryFormSlug: 'contact' },
  loading: true,
});

export function SiteConfigProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<PublicSiteMeta>({
    ...defaultSiteConfig,
    primaryFormSlug: 'contact',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      try {
        const res = await api.get<{ data: PublicSiteMeta }>('/_meta/config');
        if (!cancelled) {
          setConfig(res.data.data);
        }
      } catch {
        /* keep defaults when API unavailable */
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const value = useMemo(() => ({ config, loading }), [config, loading]);

  return (
    <SiteConfigContext.Provider value={value}>
      {children}
    </SiteConfigContext.Provider>
  );
}

export function useSiteConfig(): SiteConfigContextValue {
  return useContext(SiteConfigContext);
}
