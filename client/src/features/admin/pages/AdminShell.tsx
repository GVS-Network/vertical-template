import { Navigate, NavLink, Route, Routes } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';

import Loading from '../../../components/Loading';
import { useSiteConfig } from '../../../contexts/SiteConfigContext';
import AdminEventEditor from './AdminEventEditor';
import AdminEventsList from './AdminEventsList';
import AdminPageEditor from './AdminPageEditor';
import AdminPagesList from './AdminPagesList';
import AdminProductEditor from './AdminProductEditor';
import AdminProductsList from './AdminProductsList';
import AdminSubmissionsInbox from './AdminSubmissionsInbox';

function navLinkClass({ isActive }: { isActive: boolean }): string {
  return isActive ? 'pack-admin-nav__link pack-admin-nav__link--active' : 'pack-admin-nav__link';
}

function AdminShell() {
  const { isAuthenticated, isLoading } = useAuth0();
  const { config } = useSiteConfig();

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
        <NavLink to="/admin/events" className={navLinkClass}>
          Events
        </NavLink>
        <NavLink to="/admin/products" className={navLinkClass}>
          Products
        </NavLink>
        {config.features.intake && (
          <NavLink to="/admin/submissions" className={navLinkClass}>
            Submissions
          </NavLink>
        )}
      </nav>
      <Routes>
        <Route index element={<Navigate to="pages" replace />} />
        <Route path="pages" element={<AdminPagesList />} />
        <Route path="pages/:slug" element={<AdminPageEditor />} />
        <Route path="events" element={<AdminEventsList />} />
        <Route path="events/:slug" element={<AdminEventEditor />} />
        <Route path="products" element={<AdminProductsList />} />
        <Route path="products/:slug" element={<AdminProductEditor />} />
        {config.features.intake && (
          <Route path="submissions" element={<AdminSubmissionsInbox />} />
        )}
      </Routes>
    </main>
  );
}

export default AdminShell;
