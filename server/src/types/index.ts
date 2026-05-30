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

export type {
  Order,
  PaymentProvider,
  Product,
  WebhookEvent,
} from './payment-provider';

export type {
  NotificationProvider,
  SendIntakeSubmissionParams,
} from './notification-provider';

export type { AssetRef, AssetResourceType } from './asset-ref';

export type {
  MediaProvider,
  MediaUploadPurpose,
  MediaUploadParams,
} from './media-provider';

// Note: Auth types are provided by express-oauth2-jwt-bearer

export interface EnvConfig {
  PORT: number;
  NODE_ENV: 'development' | 'production' | 'test';
  MONGODB_URI: string;
  AUTH0_DOMAIN: string;
  AUTH0_AUDIENCE: string;
  CLIENT_URL?: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
