import { Link, useNavigate, useParams } from 'react-router-dom';

import Loading from '../../../components/Loading';
import AdminPageForm from '../components/AdminPageForm';
import {
  createAdminPage,
  updateAdminPage,
  useAdminPage,
} from '../hooks/useAdminPages';
import type { PageWriteInput } from '../types';

function AdminPageEditor() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const isCreate = slug === 'new';
  const { page, loading, error } = useAdminPage(isCreate ? undefined : slug);

  if (!isCreate && loading) {
    return <Loading />;
  }

  if (!isCreate && error) {
    return (
      <section>
        <p className="pack-message pack-message--error">{error}</p>
        <Link to="/admin/pages" className="link">
          Back to pages
        </Link>
      </section>
    );
  }

  const handleSubmit = async (input: PageWriteInput) => {
    if (isCreate) {
      if (!input.slug) {
        throw new Error('Slug is required');
      }
      const created = await createAdminPage(input);
      navigate(`/admin/pages/${created.slug}`, { replace: true });
      return;
    }
    if (!slug) {
      throw new Error('Missing page slug');
    }
    await updateAdminPage(slug, input);
  };

  return (
    <section>
      <p className="pack-admin-back">
        <Link to="/admin/pages" className="link">
          ← Pages
        </Link>
      </p>
      <h2 className="pack-detail-title">
        {isCreate ? 'New page' : `Edit: ${page?.title ?? slug}`}
      </h2>
      <AdminPageForm
        mode={isCreate ? 'create' : 'edit'}
        initial={page}
        onSubmit={handleSubmit}
      />
    </section>
  );
}

export default AdminPageEditor;
