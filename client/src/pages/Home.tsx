import { useAuth0 } from '@auth0/auth0-react';
import { useSiteConfig } from '../contexts/SiteConfigContext';
import { LoginButton } from '../features/auth';
import { CheckoutButton } from '../features/payments';

const DEMO_CHECKOUT_ITEMS = [
  { name: 'Sample Widget', sku: 'WDG-001', price: 1999, qty: 1 },
];

function Home() {
  const { isAuthenticated } = useAuth0();
  const { config } = useSiteConfig();

  return (
    <div className="shell-home">
      <div className="shell-home__inner">
        <h1 className="shell-home__title text-balance">{config.branding.name}</h1>
        <p className="shell-home__tagline">
          {config.branding.tagline ??
            'Catalog, content, intake, and payments — vertical-template demo.'}
        </p>
        <div className="shell-home__actions">
          {config.features.payments && (
            <CheckoutButton items={DEMO_CHECKOUT_ITEMS} />
          )}
          {config.features.auth && !isAuthenticated && (
            <LoginButton className="btn btn-secondary btn-lg" />
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
