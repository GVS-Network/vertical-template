import { Link, useLocation } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { defaultSiteConfig } from '../types/site-config.defaults';
import { LoginButton, LogoutButton, useSession } from '../features/auth';

function Navbar() {
  const { isAuthenticated, user } = useAuth0();
  const { user: sessionUser } = useSession();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">V</span>
            </div>
            <span className="font-semibold text-gray-900">vertical-template</span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`text-sm font-medium transition-colors ${
                isActive('/') ? 'text-primary-600' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Home
            </Link>
            {defaultSiteConfig.features.catalog && (
              <Link
                to="/catalog"
                className={`text-sm font-medium transition-colors ${
                  location.pathname.startsWith('/catalog')
                    ? 'text-primary-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Catalog
              </Link>
            )}
            {defaultSiteConfig.features.content && (
              <>
                <Link
                  to="/about"
                  className={`text-sm font-medium transition-colors ${
                    isActive('/about')
                      ? 'text-primary-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  About
                </Link>
                <Link
                  to="/blog"
                  className={`text-sm font-medium transition-colors ${
                    location.pathname.startsWith('/blog')
                      ? 'text-primary-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Blog
                </Link>
              </>
            )}
            {defaultSiteConfig.features.intake && (
              <Link
                to="/forms/contact"
                className={`text-sm font-medium transition-colors ${
                  location.pathname.startsWith('/forms')
                    ? 'text-primary-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Contact
              </Link>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {defaultSiteConfig.features.auth ? (
              isAuthenticated ? (
                <div className="flex items-center space-x-4">
                  {(sessionUser?.picture ?? user?.picture) && (
                    <img
                      src={(sessionUser?.picture ?? user?.picture) as string}
                      alt={sessionUser?.name ?? user?.name ?? 'User'}
                      className="w-8 h-8 rounded-full"
                    />
                  )}
                  <LogoutButton />
                </div>
              ) : (
                <LoginButton />
              )
            ) : null}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
