import type { Express } from 'express';
import type { SiteConfig } from '../../types/site-config';

export const packKey = 'catalog' as const;

/** Stub until Prompt 2.4 — registry only calls this when features.catalog is true. */
export function register(_app: Express, _siteConfig: SiteConfig): void {
  // router mount lands in 2.4
}
