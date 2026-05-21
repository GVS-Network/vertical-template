import { Link } from 'react-router-dom';
import { formatPriceCents } from '../hooks/useProducts';
import type { CatalogProduct } from '../types';

interface ProductCardProps {
  product: CatalogProduct;
}

function ProductCard({ product }: ProductCardProps) {
  return (
    <Link
      to={`/catalog/${product.slug}`}
      className="block bg-white border border-gray-200 rounded-lg p-4 hover:border-primary-500 transition-colors"
    >
      <h3 className="font-semibold text-gray-900">{product.name}</h3>
      <p className="text-sm text-gray-500 mt-1">SKU {product.sku}</p>
      <p className="text-lg font-medium text-primary-600 mt-2">
        {formatPriceCents(product.price)}
      </p>
      {product.stock !== null && (
        <p className="text-xs text-gray-500 mt-1">{product.stock} in stock</p>
      )}
    </Link>
  );
}

export default ProductCard;
