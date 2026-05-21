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

export interface ApiError {
  message: string;
  status: number;
}
