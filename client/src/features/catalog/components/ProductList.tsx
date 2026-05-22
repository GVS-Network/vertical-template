import ProductCard from './ProductCard';
import { useProducts } from '../hooks/useProducts';

function ProductList() {
  const { products, loading, error } = useProducts();

  if (loading) {
    return <p className="pack-loading">Loading products…</p>;
  }

  if (error) {
    return <p className="pack-error">{error}</p>;
  }

  if (products.length === 0) {
    return <p className="pack-empty">No products yet.</p>;
  }

  return (
    <div>
      <h1 className="pack-page-title">Catalog</h1>
      <div className="pack-grid pack-grid--catalog">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
}

export default ProductList;
