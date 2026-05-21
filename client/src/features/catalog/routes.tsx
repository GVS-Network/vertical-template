import { Route } from 'react-router-dom';
import ProductDetail from './components/ProductDetail';
import ProductList from './components/ProductList';

export function CatalogRoutes() {
  return (
    <>
      <Route path="/catalog" element={<ProductList />} />
      <Route path="/catalog/:slug" element={<ProductDetail />} />
    </>
  );
}
