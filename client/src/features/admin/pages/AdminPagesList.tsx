import { Link } from 'react-router-dom';

import Loading from '../../../components/Loading';
import { useAdminPagesList } from '../hooks/useAdminPages';

function AdminPagesList() {
  const { pages, loading, error } = useAdminPagesList();

  if (loading) {
    return <Loading />;
  }

  return (
    <section>
      <div className="pack-admin-header">
        <h2 className="pack-detail-title">Pages</h2>
        <Link to="/admin/pages/new" className="btn btn-primary">
          New page
        </Link>
      </div>

      {error && <p className="pack-message pack-message--error">{error}</p>}

      {!error && pages.length === 0 && (
        <p className="pack-subhead">No pages yet. Create your first page.</p>
      )}

      {pages.length > 0 && (
        <ul className="pack-list">
          {pages.map((page) => (
            <li key={page._id} className="pack-list-item">
              <Link to={`/admin/pages/${page.slug}`} className="pack-list-link">
                {page.title}
              </Link>
              <p className="pack-admin-meta">
                <span>{page.slug}</span>
                <span className="pack-admin-badge">{page.status}</span>
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default AdminPagesList;
