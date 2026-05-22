import { Route, Routes } from 'react-router-dom';

import { useSiteConfig } from '../contexts/SiteConfigContext';
import Home from '../pages/Home';
import { catalogRouteElements } from './catalog/routes';
import { contentRouteElements } from './content/routes';
import { intakeRouteElements } from './intake/routes';

/**
 * Client feature registry — mirrors server toggle gate (option b).
 * Owns <Routes> and runtime feature flags; route factories return <Route> only.
 */
export function AppRoutes() {
  const { config } = useSiteConfig();
  const { features } = config;

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      {features.catalog && catalogRouteElements()}
      {features.content && contentRouteElements()}
      {features.intake && intakeRouteElements()}
    </Routes>
  );
}
