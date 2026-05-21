import { join } from 'path';
import { pathToFileURL } from 'url';

import { TenantRegistry, type ITenantRegistry } from '../models/tenant-registry';
import type { SiteConfig } from '../types/site-config';
import type { PaymentProviderName } from '../types/site-config';
import { defaultSiteConfig } from '../types/site-config.defaults';

const REPO_ROOT = join(__dirname, '../../..');

let cachedBoundConfig: SiteConfig | null | undefined;

const PRESET_KEYS = new Set([
  'screen-printer',
  'bar-restaurant',
  'food-truck',
  'farm-source',
]);

function paymentProviderFromEnv(): PaymentProviderName {
  const raw = process.env.PAYMENT_PROVIDER?.trim().toLowerCase();
  if (raw === 'stripe' || raw === 'square' || raw === 'none') {
    return raw;
  }
  return defaultSiteConfig.payment.provider;
}

function mergePresetPartial(
  partial: Partial<SiteConfig>,
  tenantId: string
): SiteConfig {
  return {
    ...defaultSiteConfig,
    ...partial,
    tenantId,
    features: {
      ...defaultSiteConfig.features,
      ...partial.features,
    },
    payment: {
      ...defaultSiteConfig.payment,
      ...partial.payment,
    },
    branding: {
      ...defaultSiteConfig.branding,
      ...partial.branding,
    },
    contact: {
      ...defaultSiteConfig.contact,
      ...partial.contact,
    },
    locale: {
      ...defaultSiteConfig.locale,
      ...partial.locale,
    },
  };
}

function applyPaymentOverride(config: SiteConfig): SiteConfig {
  const provider = paymentProviderFromEnv();
  if (provider === config.payment.provider) {
    return config;
  }
  return { ...config, payment: { provider } };
}

async function loadPresetPartial(
  presetKey: string
): Promise<Partial<SiteConfig>> {
  if (!PRESET_KEYS.has(presetKey)) {
    throw new Error(`Unknown preset: ${presetKey}`);
  }
  const presetPath = join(
    REPO_ROOT,
    'verticals',
    presetKey,
    'site-config.preset.ts'
  );
  const mod = (await import(pathToFileURL(presetPath).href)) as {
    preset: Partial<SiteConfig>;
  };
  return mod.preset;
}

/**
 * Load BOUND_TENANT_ID config once after MongoDB connects (phase 4.4+).
 * Returns null when env is unset.
 */
export async function primeBoundSiteConfig(): Promise<SiteConfig | null> {
  const bound = process.env.BOUND_TENANT_ID?.trim();
  if (!bound) {
    cachedBoundConfig = null;
    return null;
  }

  const registry = (await TenantRegistry.findById(
    bound
  ).lean()) as ITenantRegistry | null;
  if (!registry) {
    throw new Error(
      `BOUND_TENANT_ID=${bound} has no _tenants row — run init-vertical first`
    );
  }

  const partial = await loadPresetPartial(registry.preset);
  cachedBoundConfig = applyPaymentOverride(
    mergePresetPartial(partial, bound)
  );
  console.log(
    `[site-config] BOUND_TENANT_ID=${bound} preset=${registry.preset}`
  );
  return cachedBoundConfig;
}

export function getBoundSiteConfig(): SiteConfig | null {
  if (cachedBoundConfig === undefined) {
    return null;
  }
  return cachedBoundConfig;
}

export function clearBoundSiteConfigCache(): void {
  cachedBoundConfig = undefined;
}
