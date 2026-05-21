import { useAuth0 } from '@auth0/auth0-react';
import { defaultSiteConfig } from '../types/site-config.defaults';
import { CheckoutButton } from '../features/payments';

const DEMO_CHECKOUT_ITEMS = [
  { name: 'Sample Widget', sku: 'WDG-001', price: 1999, qty: 1 },
];

function Home() {
  const { isAuthenticated, loginWithRedirect } = useAuth0();

  return (
    <div className="py-12">
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 text-balance">
          vertical-template
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Phase 2 feature packs — catalog, content, intake, and payments scaffold.
        </p>
        <div className="flex flex-col items-center gap-4">
          {defaultSiteConfig.features.payments && (
            <CheckoutButton items={DEMO_CHECKOUT_ITEMS} />
          )}
          {!isAuthenticated && (
            <button
              onClick={() => loginWithRedirect()}
              className="btn-secondary text-lg px-8 py-3"
            >
              Log In
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
