import type { ReactNode } from 'react';
import { defaultSiteConfig } from '../types/site-config.defaults';
import { catalogRouteElements } from './catalog/routes';
import { contentRouteElements } from './content/routes';
import { intakeRouteElements } from './intake/routes';

/**
 * Client feature registry — mirrors server toggle gate (option b).
 * Returns route elements for use inside <Routes>. Must be function calls
 * (catalogRouteElements()), not components (<CatalogRoutes />) — RR v6 only
 * accepts <Route> or <Fragment> as descendants, not custom components.
 */
export function featureRouteElements(): ReactNode {
  const { features } = defaultSiteConfig;

  return (
    <>
      {features.catalog && catalogRouteElements()}
      {features.content && contentRouteElements()}
      {features.intake && intakeRouteElements()}
    </>
  );
}
