import ProductCard from './ProductCard';
import { useProducts } from '../hooks/useProducts';

function ProductList() {
  const { products, loading, error } = useProducts();

  if (loading) {
    return <p className="text-gray-600">Loading products…</p>;
  }

  if (error) {
    return <p className="text-red-600">{error}</p>;
  }

  if (products.length === 0) {
    return <p className="text-gray-600">No products yet.</p>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Catalog</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
}

export default ProductList;
