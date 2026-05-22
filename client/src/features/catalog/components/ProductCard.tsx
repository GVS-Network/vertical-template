import { Link } from 'react-router-dom';
import { formatPriceCents } from '../hooks/useProducts';
import type { CatalogProduct } from '../types';

interface ProductCardProps {
  product: CatalogProduct;
}

function ProductCard({ product }: ProductCardProps) {
  return (
    <Link to={`/catalog/${product.slug}`} className="product-card">
      <h3 className="product-card__title">{product.name}</h3>
      <p className="product-card__meta">SKU {product.sku}</p>
      <p className="product-card__price">{formatPriceCents(product.price)}</p>
      {product.stock !== null && (
        <p className="product-card__stock">{product.stock} in stock</p>
      )}
    </Link>
  );
}

export default ProductCard;
