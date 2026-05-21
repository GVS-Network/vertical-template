import { defaultSiteConfig } from '../types/site-config.defaults';
import { CatalogRoutes } from './catalog/routes';
import { ContentRoutes } from './content/routes';
import { IntakeRoutes } from './intake/routes';

/**
 * Client feature registry — mirrors server toggle gate (option b).
 * Disabled packs: no routes imported from this module for that pack's paths.
 */
export function FeatureRoutes() {
  const { features } = defaultSiteConfig;

  return (
    <>
      {features.catalog && <CatalogRoutes />}
      {features.content && <ContentRoutes />}
      {features.intake && <IntakeRoutes />}
    </>
  );
}
