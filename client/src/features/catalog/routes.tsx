import type { ReactNode } from 'react';
import { Route } from 'react-router-dom';
import ProductDetail from './components/ProductDetail';
import ProductList from './components/ProductList';

/** Route elements for <Routes> — call as catalogRouteElements(), not <CatalogRoutes />. */
export function catalogRouteElements(): ReactNode {
  return (
    <>
      <Route path="/catalog" element={<ProductList />} />
      <Route path="/catalog/:slug" element={<ProductDetail />} />
    </>
  );
}
