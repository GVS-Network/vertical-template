import type { SiteConfig } from '../client/src/types/site-config';
import type { ThemeTokens } from '../client/src/types/theme-tokens';

import { deepMergeThemeTokens } from './deep-merge-tokens';
import { foundation } from './foundation.tokens';
import { tenantThemes } from './tenants/registry';
import { validateLeafOnlyOverride } from './validate-leaf-override';
import { verticalThemeTokens } from './verticals/registry';

/**
 * Walk L1→L4 and return fully resolved theme tokens.
 * see visual-system-brief §02 — four-layer resolution model
 */
export function resolveTokens(siteConfig: SiteConfig, tenantId: string): ThemeTokens {
  let tokens = structuredClone(foundation);

  const verticalPartial = verticalThemeTokens[siteConfig.vertical];
  if (verticalPartial) {
    tokens = deepMergeThemeTokens(tokens, verticalPartial);
  }

  const tenantLayers = tenantThemes[tenantId as keyof typeof tenantThemes];
  if (tenantLayers) {
    tokens = deepMergeThemeTokens(tokens, tenantLayers.pick);

    const overrideSource = `theme/tenants/${tenantId}.override.ts`;
    validateLeafOnlyOverride(tenantLayers.override, overrideSource);
    tokens = deepMergeThemeTokens(tokens, tenantLayers.override);
  }

  return tokens;
}

export { deepMergeThemeTokens } from './deep-merge-tokens';
export { validateLeafOnlyOverride, collectPartialLeafPaths } from './validate-leaf-override';
