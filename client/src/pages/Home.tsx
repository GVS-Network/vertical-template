import { useAuth0 } from '@auth0/auth0-react';

function Home() {
  const { isAuthenticated, loginWithRedirect } = useAuth0();

  return (
    <div className="py-12">
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 text-balance">
          vertical-template
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Phase 1 bootstrap — SiteConfig and tenant seams are being wired. Dev loop is live.
        </p>
        {!isAuthenticated && (
          <button
            onClick={() => loginWithRedirect()}
            className="btn-primary text-lg px-8 py-3"
          >
            Log In
          </button>
        )}
      </div>
    </div>
  );
}

export default Home;
