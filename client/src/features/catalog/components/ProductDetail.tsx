import { Link, useParams } from 'react-router-dom';
import { formatPriceCents, useProduct } from '../hooks/useProducts';

function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { product, loading, error } = useProduct(slug);

  if (loading) {
    return <p className="text-gray-600">Loading product…</p>;
  }

  if (error || !product) {
    return (
      <div>
        <p className="text-red-600">{error ?? 'Product not found'}</p>
        <Link to="/catalog" className="text-primary-600 text-sm mt-4 inline-block">
          ← Back to catalog
        </Link>
      </div>
    );
  }

  return (
    <div>
      <Link to="/catalog" className="text-primary-600 text-sm mb-4 inline-block">
        ← Back to catalog
      </Link>
      <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
      <p className="text-gray-500 mt-2">SKU {product.sku}</p>
      <p className="text-2xl font-semibold text-primary-600 mt-4">
        {formatPriceCents(product.price)}
      </p>
      {product.stock !== null && (
        <p className="text-gray-600 mt-2">{product.stock} in stock</p>
      )}
      <p className="text-sm text-gray-500 mt-4 capitalize">Status: {product.status}</p>
    </div>
  );
}

export default ProductDetail;
