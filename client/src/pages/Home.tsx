import { useSiteConfig } from '../contexts/SiteConfigContext';
import { LoginButton } from '../features/auth';
import { CheckoutButton } from '../features/payments';

const DEMO_CHECKOUT_ITEMS = [
  { name: 'Sample Widget', sku: 'WDG-001', price: 1999, qty: 1 },
];

function Home() {
  const { config } = useSiteConfig();

  return (
    <div className="py-12">
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 text-balance">
          {config.branding.name}
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          {config.branding.tagline ??
            'Catalog, content, intake, and payments — vertical-template demo.'}
        </p>
        <div className="flex flex-col items-center gap-4">
          {config.features.payments && (
            <CheckoutButton items={DEMO_CHECKOUT_ITEMS} />
          )}
          {config.features.auth && (
            <LoginButton className="btn-secondary text-lg px-8 py-3" />
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
