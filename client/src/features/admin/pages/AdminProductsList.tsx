import { Link } from 'react-router-dom';

import Loading from '../../../components/Loading';
import { formatPriceCents } from '../../catalog/hooks/useProducts';
import { useAdminProductsList } from '../hooks/useAdminProducts';

function AdminProductsList() {
  const { products, loading, error } = useAdminProductsList();

  if (loading) {
    return <Loading />;
  }

  return (
    <section>
      <div className="pack-admin-header">
        <h2 className="pack-detail-title">Products</h2>
        <Link to="/admin/products/new" className="btn btn-primary">
          New product
        </Link>
      </div>

      {error && <p className="pack-message pack-message--error">{error}</p>}

      {!error && products.length === 0 && (
        <p className="pack-subhead">No products yet. Create your first product.</p>
      )}

      {products.length > 0 && (
        <ul className="pack-list">
          {products.map((product) => (
            <li key={product._id} className="pack-list-item">
              <Link
                to={`/admin/products/${product.slug}`}
                className="pack-list-link"
              >
                {product.name}
              </Link>
              <p className="pack-admin-meta">
                <span>{formatPriceCents(product.price)}</span>
                <span>{product.slug}</span>
                <span className="pack-admin-badge">{product.status}</span>
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default AdminProductsList;
