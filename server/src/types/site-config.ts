export type Vertical =
  | 'bar-restaurant'
  | 'food-truck'
  | 'farm-source'
  | 'screen-printer'
  | 'generic';

export type PaymentProviderName = 'stripe' | 'square' | 'none';

export interface SiteConfigFeatures {
  catalog: boolean;
  content: boolean;
  intake: boolean;
  payments: boolean;
  auth: boolean;
}

export interface SiteConfigPayment {
  provider: PaymentProviderName;
}

export interface SiteConfigBranding {
  name: string;
  tagline?: string;
}

export interface SiteConfigContact {
  email?: string;
  phone?: string;
  address?: string;
}

export interface SiteConfigLocale {
  currency: string;
  timezone: string;
  lang: string;
}

export interface SiteConfig {
  vertical: Vertical;
  tenantId: string;
  features: SiteConfigFeatures;
  payment: SiteConfigPayment;
  branding: SiteConfigBranding;
  contact: SiteConfigContact;
  locale: SiteConfigLocale;
}
