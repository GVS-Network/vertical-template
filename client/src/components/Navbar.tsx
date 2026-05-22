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

  const linkClass = (active: boolean) =>
    `shell-nav__link${active ? ' shell-nav__link--active' : ''}`;

  return (
    <nav className="shell-nav">
      <div className="shell-container shell-nav__inner">
        <Link to="/" className="shell-nav__brand">
          <div className="shell-nav__mark">
            <span>{config.branding.name.charAt(0)}</span>
          </div>
          <span className="shell-nav__name">{config.branding.name}</span>
        </Link>

        <div className="shell-nav__links">
          <Link to="/" className={linkClass(isActive('/'))}>
            Home
          </Link>
          {config.features.catalog && (
            <Link
              to="/catalog"
              className={linkClass(location.pathname.startsWith('/catalog'))}
            >
              Catalog
            </Link>
          )}
          {config.features.content && (
            <>
              <Link to="/about" className={linkClass(isActive('/about'))}>
                About
              </Link>
              <Link
                to="/blog"
                className={linkClass(location.pathname.startsWith('/blog'))}
              >
                Blog
              </Link>
            </>
          )}
          {config.features.intake && config.primaryFormSlug && (
            <Link
              to={intakePath}
              className={linkClass(location.pathname.startsWith('/forms'))}
            >
              {intakeLabel}
            </Link>
          )}
        </div>

        <div className="shell-nav__actions">
          {config.features.auth ? (
            isAuthenticated ? (
              <>
                {(sessionUser?.picture ?? user?.picture) && (
                  <img
                    src={(sessionUser?.picture ?? user?.picture) as string}
                    alt={sessionUser?.name ?? user?.name ?? 'User'}
                    className="shell-nav__avatar"
                  />
                )}
                <LogoutButton />
              </>
            ) : (
              <LoginButton />
            )
          ) : null}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
