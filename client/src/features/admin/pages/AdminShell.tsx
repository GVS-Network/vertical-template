import { Navigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';

import Loading from '../../../components/Loading';

/** Placeholder shell — page/event/product/submission editors land in prompts 6.8–6.11. */
function AdminShell() {
  const { isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return <Loading />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <main className="pack-section">
      <h1 className="pack-detail-title">Admin</h1>
      <p className="pack-subhead">
        Tenant operator surface — content editors ship in upcoming phase-6 prompts.
      </p>
    </main>
  );
}

export default AdminShell;
