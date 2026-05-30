import { lazy, Suspense, type ReactNode } from 'react';
import { Route } from 'react-router-dom';

import Loading from '../../components/Loading';

const AdminShell = lazy(() => import('./pages/AdminShell'));

/** Route elements for <Routes> — lazy-loaded when features.admin is on. */
export function adminRouteElements(): ReactNode {
  return (
    <Route
      path="/admin/*"
      element={
        <Suspense fallback={<Loading />}>
          <AdminShell />
        </Suspense>
      }
    />
  );
}
