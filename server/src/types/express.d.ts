import type { SiteConfig } from './site-config';

declare global {
  namespace Express {
    interface Request {
      siteConfig: SiteConfig;
    }
  }
}

export {};
