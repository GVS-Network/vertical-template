import { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import api, { setAuthToken } from '../services/api';

/**
 * Hook to automatically add Auth0 token to API requests
 * Call this once in a high-level component to set up token handling
 */
export function useApiAuth() {
  const { isAuthenticated, isLoading, getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    // Auth0 reports isAuthenticated=false while restoring a session — do not
    // clear a stored token until loading finishes or /auth/me races with no header.
    if (isLoading) {
      return;
    }

    const setupToken = async () => {
      if (isAuthenticated) {
        try {
          const token = await getAccessTokenSilently();
          setAuthToken(token);
        } catch (error) {
          console.error('Error getting access token:', error);
          setAuthToken(null);
        }
      } else {
        setAuthToken(null);
      }
    };

    setupToken();
  }, [isAuthenticated, isLoading, getAccessTokenSilently]);

  return api;
}

export default useApiAuth;
