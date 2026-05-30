import { Navigate, NavLink, Route, Routes } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';

import Loading from '../../../components/Loading';
import AdminPageEditor from './AdminPageEditor';
import AdminPagesList from './AdminPagesList';

function navLinkClass({ isActive }: { isActive: boolean }): string {
  return isActive ? 'pack-admin-nav__link pack-admin-nav__link--active' : 'pack-admin-nav__link';
}

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
      <nav className="pack-admin-nav" aria-label="Admin sections">
        <NavLink to="/admin/pages" className={navLinkClass}>
          Pages
        </NavLink>
      </nav>
      <Routes>
        <Route index element={<Navigate to="pages" replace />} />
        <Route path="pages" element={<AdminPagesList />} />
        <Route path="pages/:slug" element={<AdminPageEditor />} />
      </Routes>
    </main>
  );
}

export default AdminShell;
