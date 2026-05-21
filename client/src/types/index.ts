export type {
  Vertical,
  PaymentProviderName,
  SiteConfigFeatures,
  SiteConfigPayment,
  SiteConfigBranding,
  SiteConfigContact,
  SiteConfigLocale,
  SiteConfig,
} from './site-config';

export type { ThemeTokens } from './theme-tokens';

export { defaultSiteConfig } from './site-config.defaults';

export interface ApiError {
  message: string;
  status: number;
}
