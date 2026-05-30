import { Link, useNavigate, useParams } from 'react-router-dom';

import Loading from '../../../components/Loading';
import AdminProductForm from '../components/AdminProductForm';
import {
  createAdminProduct,
  updateAdminProduct,
  useAdminProduct,
} from '../hooks/useAdminProducts';
import type { ProductWriteInput } from '../types';

function AdminProductEditor() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const isCreate = slug === 'new';
  const { product, loading, error } = useAdminProduct(isCreate ? undefined : slug);

  if (!isCreate && loading) {
    return <Loading />;
  }

  if (!isCreate && error) {
    return (
      <section>
        <p className="pack-message pack-message--error">{error}</p>
        <Link to="/admin/products" className="link">
          Back to products
        </Link>
      </section>
    );
  }

  const handleSubmit = async (input: ProductWriteInput) => {
    if (isCreate) {
      const created = await createAdminProduct(input);
      navigate(`/admin/products/${created.slug}`, { replace: true });
      return;
    }
    if (!slug) {
      throw new Error('Missing product slug');
    }
    await updateAdminProduct(slug, input, product?.attributes);
  };

  return (
    <section>
      <p className="pack-admin-back">
        <Link to="/admin/products" className="link">
          ← Products
        </Link>
      </p>
      <h2 className="pack-detail-title">
        {isCreate ? 'New product' : `Edit: ${product?.name ?? slug}`}
      </h2>
      <AdminProductForm
        mode={isCreate ? 'create' : 'edit'}
        initial={product}
        onSubmit={handleSubmit}
      />
    </section>
  );
}

export default AdminProductEditor;
