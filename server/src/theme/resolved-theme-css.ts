import type { Request } from 'express';

import { getSiteConfig } from '../seams/get-site-config';
import { loadRepoModule } from './load-repo-module';

type ThemeResolveModule = {
  resolveTokens: (
    siteConfig: ReturnType<typeof getSiteConfig>,
    tenantId: string
  ) => unknown;
};

type ThemeEmitModule = {
  emitCssVars: (tokens: unknown) => string;
};

/** Resolve tenant theme tokens and emit `:root` CSS for the current request. */
export function resolvedThemeCssForRequest(req: Request): string {
  const { resolveTokens } = loadRepoModule<ThemeResolveModule>('theme/resolve');
  const { emitCssVars } = loadRepoModule<ThemeEmitModule>('theme/emit-css-vars');
  const config = getSiteConfig(req);
  const tokens = resolveTokens(config, config.tenantId);
  return emitCssVars(tokens);
}
