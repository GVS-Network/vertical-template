import { Auth0Provider, type AppState } from '@auth0/auth0-react';
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

const domain = import.meta.env.VITE_AUTH0_DOMAIN;
const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID;
const audience = import.meta.env.VITE_AUTH0_AUDIENCE;

interface Auth0ProviderWithNavigateProps {
  children: ReactNode;
}

/**
 * Auth0 SPA provider inside React Router so post-login redirects honor appState.returnTo.
 * cacheLocation=localstorage keeps the session across full page loads (e.g. /admin in the address bar).
 */
export function Auth0ProviderWithNavigate({
  children,
}: Auth0ProviderWithNavigateProps) {
  const navigate = useNavigate();

  const onRedirectCallback = (appState?: AppState) => {
    navigate(appState?.returnTo ?? window.location.pathname);
  };

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      cacheLocation="localstorage"
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience,
      }}
      onRedirectCallback={onRedirectCallback}
    >
      {children}
    </Auth0Provider>
  );
}
