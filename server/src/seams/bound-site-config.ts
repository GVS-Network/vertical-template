import { existsSync } from 'fs';
import { createRequire } from 'module';
import { join } from 'path';

import { TenantRegistry, type ITenantRegistry } from '../models/tenant-registry';
import type { SiteConfig } from '../types/site-config';
import type { PaymentProviderName } from '../types/site-config';
import { defaultSiteConfig } from '../types/site-config.defaults';

const REPO_ROOT = join(__dirname, '../../..');
const requireFromRepo = createRequire(join(REPO_ROOT, 'package.json'));

/** Loaded at runtime from repo-root verticals/ (avoids server rootDir import + file:// .ts under ts-node). */
type VerticalRegistryModule = {
  verticalPresets: Record<
    string,
    { preset: Partial<SiteConfig> }
  >;
  isVerticalPresetKey: (value: string) => boolean;
  mergePreset: (partial: Partial<SiteConfig>) => SiteConfig;
};

let cachedBoundConfig: SiteConfig | null | undefined;

function getVerticalRegistry(): VerticalRegistryModule {
  // Prefer TypeScript source — stale verticals/registry.js from accidental tsc breaks branding.
  const registryTs = join(REPO_ROOT, 'verticals/registry.ts');
  const specifier = existsSync(registryTs)
    ? './verticals/registry.ts'
    : './verticals/registry';
  return requireFromRepo(specifier) as VerticalRegistryModule;
}

function paymentProviderFromEnv(): PaymentProviderName {
  const raw = process.env.PAYMENT_PROVIDER?.trim().toLowerCase();
  if (raw === 'stripe' || raw === 'square' || raw === 'none') {
    return raw;
  }
  return defaultSiteConfig.payment.provider;
}

function applyPaymentOverride(config: SiteConfig): SiteConfig {
  const provider = paymentProviderFromEnv();
  if (provider === config.payment.provider) {
    return config;
  }
  return { ...config, payment: { provider } };
}

function loadBoundConfig(tenantId: string, presetKey: string): SiteConfig {
  const { verticalPresets, isVerticalPresetKey, mergePreset } =
    getVerticalRegistry();

  if (!isVerticalPresetKey(presetKey)) {
    throw new Error(`Unknown preset: ${presetKey}`);
  }

  const entry = verticalPresets[presetKey];
  return applyPaymentOverride(
    mergePreset({
      ...entry.preset,
      tenantId,
      vertical: presetKey as SiteConfig['vertical'],
    })
  );
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

  cachedBoundConfig = loadBoundConfig(bound, registry.preset);
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
