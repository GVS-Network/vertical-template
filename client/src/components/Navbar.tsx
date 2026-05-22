import { Link, useLocation } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { LoginButton, LogoutButton, useSession } from '../features/auth';
import { useSiteConfig } from '../contexts/SiteConfigContext';

function Navbar() {
  const { isAuthenticated, user } = useAuth0();
  const { user: sessionUser } = useSession();
  const location = useLocation();
  const { config } = useSiteConfig();

  const isActive = (path: string) => location.pathname === path;
  const intakePath = config.primaryFormSlug
    ? `/forms/${config.primaryFormSlug}`
    : '/forms/contact';
  const intakeNavLabels: Record<string, string> = {
    'project-quote': 'Get a quote',
    'private-event': 'Private events',
    catering: 'Catering',
    'wholesale-inquiry': 'Wholesale',
  };
  const intakeLabel =
    intakeNavLabels[config.primaryFormSlug ?? ''] ?? 'Contact';

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">
                {config.branding.name.charAt(0)}
              </span>
            </div>
            <span className="font-semibold text-gray-900">
              {config.branding.name}
            </span>
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
            {config.features.catalog && (
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
            {config.features.content && (
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
            {config.features.intake && config.primaryFormSlug && (
              <Link
                to={intakePath}
                className={`text-sm font-medium transition-colors ${
                  location.pathname.startsWith('/forms')
                    ? 'text-primary-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {intakeLabel}
              </Link>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {config.features.auth ? (
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
