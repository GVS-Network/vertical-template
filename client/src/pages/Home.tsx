import { defaultSiteConfig } from '../types/site-config.defaults';
import { LoginButton } from '../features/auth';
import { CheckoutButton } from '../features/payments';

const DEMO_CHECKOUT_ITEMS = [
  { name: 'Sample Widget', sku: 'WDG-001', price: 1999, qty: 1 },
];

function Home() {
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
          {defaultSiteConfig.features.auth && (
            <LoginButton className="btn-secondary text-lg px-8 py-3" />
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
