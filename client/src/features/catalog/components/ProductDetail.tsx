import { Link, useParams } from 'react-router-dom';
import { formatPriceCents, useProduct } from '../hooks/useProducts';

function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { product, loading, error } = useProduct(slug);

  if (loading) {
    return <p className="pack-loading">Loading product…</p>;
  }

  if (error || !product) {
    return (
      <div>
        <p className="pack-error">{error ?? 'Product not found'}</p>
        <Link to="/catalog" className="pack-link-back pack-link-back--after-error">
          ← Back to catalog
        </Link>
      </div>
    );
  }

  return (
    <div>
      <Link to="/catalog" className="pack-link-back">
        ← Back to catalog
      </Link>
      <h1 className="pack-detail-title">{product.name}</h1>
      <p className="pack-meta">SKU {product.sku}</p>
      <p className="pack-detail-price">{formatPriceCents(product.price)}</p>
      {product.stock !== null && (
        <p className="pack-body-soft">{product.stock} in stock</p>
      )}
      <p className="pack-meta pack-meta--tight capitalize">Status: {product.status}</p>
    </div>
  );
}

export default ProductDetail;
