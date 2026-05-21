import type { Express } from 'express';
import type { SiteConfig } from '../../types/site-config';

export const packKey = 'payments' as const;

export function register(_app: Express, _siteConfig: SiteConfig): void {
  // Prompt 2.7+
}
