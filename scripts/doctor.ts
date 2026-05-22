/**
 * Phase 0 environment check — Node, env files, Mongo connectivity.
 * Phase 3.6 — payment provider env + credential smoke when payments pack is on.
 * Phase 4.6 — when BOUND_TENANT_ID is set, verify _tenants row, preset, and seeded packs.
 * Run from repo root: npm run doctor
 */

import { existsSync, readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { connectDatabase, disconnectDatabase } from '../server/src/config/database';
import { runContractCheck } from './contract-check';
import { scopedForTenant } from '../server/src/db/scoped';
import { Product } from '../server/src/features/catalog/schemas/product';
import { Page } from '../server/src/features/content/schemas/page';
import { FormDefinition } from '../server/src/features/intake/schemas/form-definition';
import { TenantRegistry } from '../server/src/models/tenant-registry';
import { defaultSiteConfig } from '../server/src/types/site-config.defaults';
import type { PaymentProviderName, SiteConfig } from '../server/src/types/site-config';
import {
  isVerticalPresetKey,
  resolveSiteConfigForPreset,
} from '../verticals/registry';

const SQUARE_API_VERSION = '2024-12-18';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

const ENV_PAIRS: { label: string; example: string; env: string }[] = [
  { label: 'root', example: join(ROOT, '.env.example'), env: join(ROOT, '.env') },
  { label: 'server', example: join(ROOT, 'server/.env.example'), env: join(ROOT, 'server/.env') },
  { label: 'client', example: join(ROOT, 'client/.env.example'), env: join(ROOT, 'client/.env') },
];

const STRIPE_ENV_KEYS = new Set([
  'STRIPE_SECRET_KEY',
  'STRIPE_WEBHOOK_SECRET',
]);

const SQUARE_ENV_KEYS = new Set([
  'SQUARE_ACCESS_TOKEN',
  'SQUARE_LOCATION_ID',
  'SQUARE_WEBHOOK_SIGNATURE_KEY',
  'SQUARE_ENV',
  'SQUARE_WEBHOOK_NOTIFICATION_URL',
]);

function paymentEnvKeysToSkip(provider: PaymentProviderName): Set<string> {
  if (provider === 'stripe') {
    return SQUARE_ENV_KEYS;
  }
  if (provider === 'square') {
    return STRIPE_ENV_KEYS;
  }
  return new Set([...STRIPE_ENV_KEYS, ...SQUARE_ENV_KEYS]);
}

function parseEnvKeys(filePath: string): string[] {
  const content = readFileSync(filePath, 'utf8');
  const keys: string[] = [];
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq > 0) keys.push(trimmed.slice(0, eq).trim());
  }
  return keys;
}

function parseEnvMap(filePath: string): Map<string, string> {
  const map = new Map<string, string>();
  const content = readFileSync(filePath, 'utf8');
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq > 0) {
      map.set(trimmed.slice(0, eq).trim(), trimmed.slice(eq + 1).trim());
    }
  }
  return map;
}

function checkNodeVersion(): string[] {
  const errors: string[] = [];
  const [major] = process.versions.node.split('.').map(Number);
  if (major < 20) {
    errors.push(
      `Node ${process.versions.node} — require >= 20 (use .nvmrc: nvm use)`
    );
  }
  return errors;
}

function checkEnvFiles(skipKeys: Set<string> = new Set()): string[] {
  const errors: string[] = [];

  for (const { label, example, env } of ENV_PAIRS) {
    if (!existsSync(example)) {
      errors.push(`${label}: missing ${example}`);
      continue;
    }
    if (!existsSync(env)) {
      errors.push(`${label}: missing ${env} (copy from ${example})`);
      continue;
    }

    const requiredKeys = parseEnvKeys(example);
    const envMap = parseEnvMap(env);

    for (const key of requiredKeys) {
      if (skipKeys.has(key)) {
        continue;
      }
      const value = envMap.get(key);
      if (value === undefined || value === '') {
        errors.push(`${label}: missing or empty ${key} in ${env}`);
      }
    }
  }

  return errors;
}

/** Duplicate keys in server/.env — dotenv last-wins; common when swapping vertical walks. */
function checkServerEnvDuplicates(): string[] {
  const errors: string[] = [];
  const serverEnv = join(ROOT, 'server/.env');
  if (!existsSync(serverEnv)) {
    return errors;
  }

  const counts = new Map<string, number>();
  for (const line of readFileSync(serverEnv, 'utf8').split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq <= 0) continue;
    const key = trimmed.slice(0, eq).trim();
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }

  for (const [key, count] of counts) {
    if (count > 1) {
      errors.push(
        `server: duplicate ${key} in server/.env (${count}×) — last value wins; keep one active walk block`
      );
    }
  }

  return errors;
}

type BoundTenantResult = {
  errors: string[];
  notices: string[];
  warnings: string[];
  activeConfig: SiteConfig;
  /** Preset default before PAYMENT_PROVIDER env override */
  presetProvider?: PaymentProviderName;
};

async function checkBoundTenant(tenantId: string): Promise<BoundTenantResult> {
  const errors: string[] = [];
  const notices: string[] = [];

  const registry = await TenantRegistry.findById(tenantId).lean();
  if (!registry) {
    return {
      errors: [
        `bound tenant: no _tenants document for BOUND_TENANT_ID=${tenantId} — run init-vertical`,
      ],
      notices: [],
      warnings: [],
      activeConfig: defaultSiteConfig,
    };
  }

  if (!isVerticalPresetKey(registry.preset)) {
    return {
      errors: [
        `bound tenant: preset "${String(registry.preset)}" is not a registered vertical`,
      ],
      notices: [],
      warnings: [],
      activeConfig: defaultSiteConfig,
    };
  }

  const presetConfig = resolveSiteConfigForPreset(registry.preset, tenantId);
  const presetProvider = presetConfig.payment.provider;
  const config = applyPaymentEnvOverride(presetConfig);

  const envProvider = effectivePaymentProvider();
  if (envProvider !== presetProvider) {
    notices.push(
      `PAYMENT_PROVIDER=${envProvider} overrides preset default ${presetProvider} — set PAYMENT_PROVIDER=${presetProvider} for a clean ${registry.preset} walk`
    );
  }

  if (config.features.catalog) {
    const count = await scopedForTenant(Product, tenantId).countDocuments();
    if (count < 1) {
      errors.push(
        `bound tenant/catalog: no products for ${tenantId} — run init-vertical`
      );
    }
  }

  if (config.features.content) {
    const count = await scopedForTenant(Page, tenantId).countDocuments();
    if (count < 1) {
      errors.push(
        `bound tenant/content: no pages for ${tenantId} — run init-vertical`
      );
    }
  }

  if (config.features.intake) {
    const count = await scopedForTenant(FormDefinition, tenantId).countDocuments();
    if (count < 1) {
      errors.push(
        `bound tenant/intake: no forms for ${tenantId} — run init-vertical`
      );
    }
  }

  if (errors.length === 0) {
    const packsOn = (Object.keys(config.features) as (keyof SiteConfig['features'])[])
      .filter((k) => config.features[k])
      .join(', ');
    notices.push(
      `bound tenant: ${tenantId} → preset ${registry.preset} (${config.branding.name}); packs on: ${packsOn}`
    );
  }

  return { errors, notices, warnings: [], activeConfig: config, presetProvider };
}

async function checkMongo(): Promise<BoundTenantResult> {
  const errors: string[] = [];
  const notices: string[] = [];
  const warnings: string[] = [];
  let activeConfig = defaultSiteConfig;
  let presetProvider: PaymentProviderName | undefined;
  const serverEnv = join(ROOT, 'server/.env');

  if (!existsSync(serverEnv)) {
    errors.push('server: cannot check Mongo — server/.env missing');
    return { errors, notices, warnings, activeConfig, presetProvider };
  }

  if (!process.env.MONGODB_URI) {
    errors.push('server: MONGODB_URI not set in server/.env');
    return { errors, notices, warnings, activeConfig, presetProvider };
  }

  try {
    await connectDatabase();

    const bound = process.env.BOUND_TENANT_ID?.trim();
    if (bound) {
      const boundResult = await checkBoundTenant(bound);
      errors.push(...boundResult.errors);
      notices.push(...boundResult.notices);
      warnings.push(...boundResult.warnings);
      if (boundResult.errors.length === 0) {
        activeConfig = boundResult.activeConfig;
        presetProvider = boundResult.presetProvider;
      }
    }

    await disconnectDatabase();
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    errors.push(`MongoDB: connection failed — ${message}`);
    try {
      await disconnectDatabase();
    } catch {
      /* ignore disconnect errors */
    }
  }

  return { errors, notices, warnings, activeConfig, presetProvider };
}

function requireEnvVar(name: string): string | null {
  const value = process.env[name]?.trim();
  return value ? value : null;
}

/** Mirrors getSiteConfig payment resolution (server/.env PAYMENT_PROVIDER override). */
function effectivePaymentProvider(
  fallback: PaymentProviderName = defaultSiteConfig.payment.provider
): PaymentProviderName {
  const raw = process.env.PAYMENT_PROVIDER?.trim().toLowerCase();
  if (raw === 'stripe' || raw === 'square' || raw === 'none') {
    return raw;
  }
  return fallback;
}

function applyPaymentEnvOverride(config: SiteConfig): SiteConfig {
  const provider = effectivePaymentProvider(config.payment.provider);
  if (provider === config.payment.provider) {
    return config;
  }
  return { ...config, payment: { provider } };
}

async function pingStripe(secretKey: string): Promise<string | null> {
  try {
    const res = await fetch('https://api.stripe.com/v1/balance', {
      headers: { Authorization: `Bearer ${secretKey}` },
    });
    if (!res.ok) {
      const body = (await res.text()).slice(0, 160);
      return `Stripe API rejected credentials (HTTP ${res.status}): ${body}`;
    }
    return null;
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return `Stripe API unreachable — ${message}`;
  }
}

function squareApiBaseUrl(): string | null {
  const env = process.env.SQUARE_ENV?.trim().toLowerCase();
  if (env === 'sandbox') {
    return 'https://connect.squareupsandbox.com';
  }
  if (env === 'production') {
    return 'https://connect.squareup.com';
  }
  return null;
}

async function pingSquare(accessToken: string): Promise<string | null> {
  const base = squareApiBaseUrl();
  if (!base) {
    return 'SQUARE_ENV must be sandbox or production';
  }

  try {
    const res = await fetch(`${base}/v2/locations`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Square-Version': SQUARE_API_VERSION,
      },
    });
    if (!res.ok) {
      const body = (await res.text()).slice(0, 160);
      return `Square API rejected credentials (HTTP ${res.status}): ${body}`;
    }
    return null;
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return `Square API unreachable — ${message}`;
  }
}

function checkAuth(siteConfig: SiteConfig): string[] {
  if (!siteConfig.features.auth) {
    return [];
  }

  const errors: string[] = [];
  const issuer =
    requireEnvVar('AUTH0_ISSUER_BASE_URL') ?? requireEnvVar('AUTH0_DOMAIN');
  const audience = requireEnvVar('AUTH0_AUDIENCE');

  if (!issuer) {
    errors.push(
      'auth: missing AUTH0_ISSUER_BASE_URL (or AUTH0_DOMAIN) in server/.env'
    );
  }
  if (!audience) {
    errors.push('auth: missing AUTH0_AUDIENCE in server/.env');
  }

  return errors;
}

async function checkPayments(siteConfig: SiteConfig): Promise<{
  errors: string[];
  warnings: string[];
}> {
  if (!siteConfig.features.payments) {
    return { errors: [], warnings: [] };
  }

  const serverEnv = join(ROOT, 'server/.env');
  if (!existsSync(serverEnv)) {
    return {
      errors: ['payments: cannot check provider — server/.env missing'],
      warnings: [],
    };
  }

  dotenv.config({ path: serverEnv });
  const provider = effectivePaymentProvider(siteConfig.payment.provider);

  if (provider === 'none') {
    return {
      errors: [],
      warnings: [
        'payments: feature pack is on but payment.provider is none — checkout returns 501 until configured',
      ],
    };
  }

  const errors: string[] = [];
  const warnings: string[] = [];

  if (provider === 'stripe') {
    const secret = requireEnvVar('STRIPE_SECRET_KEY');
    const webhookSecret = requireEnvVar('STRIPE_WEBHOOK_SECRET');
    if (!secret) {
      errors.push('payments/stripe: missing STRIPE_SECRET_KEY in server/.env');
    }
    if (!webhookSecret) {
      errors.push('payments/stripe: missing STRIPE_WEBHOOK_SECRET in server/.env');
    }
    if (secret) {
      const apiError = await pingStripe(secret);
      if (apiError) {
        errors.push(`payments/stripe: ${apiError}`);
      }
    }
    return { errors, warnings };
  }

  if (provider === 'square') {
    const token = requireEnvVar('SQUARE_ACCESS_TOKEN');
    const locationId = requireEnvVar('SQUARE_LOCATION_ID');
    const signatureKey = requireEnvVar('SQUARE_WEBHOOK_SIGNATURE_KEY');
    const squareEnv = requireEnvVar('SQUARE_ENV');

    if (!token) {
      errors.push('payments/square: missing SQUARE_ACCESS_TOKEN in server/.env');
    }
    if (!locationId) {
      errors.push('payments/square: missing SQUARE_LOCATION_ID in server/.env');
    }
    if (!signatureKey) {
      const msg =
        'payments/square: SQUARE_WEBHOOK_SIGNATURE_KEY unset — Square webhooks will not verify';
      if (process.env.NODE_ENV === 'production') {
        errors.push(`${msg} (required in production)`);
      } else {
        warnings.push(`${msg} (OK for catalog/content walk)`);
      }
    }
    if (!squareEnv) {
      errors.push('payments/square: missing SQUARE_ENV in server/.env');
    } else if (!squareApiBaseUrl()) {
      errors.push(
        'payments/square: SQUARE_ENV must be sandbox or production'
      );
    }
    if (token) {
      const apiError = await pingSquare(token);
      if (apiError) {
        errors.push(`payments/square: ${apiError}`);
      }
    }
    return { errors, warnings };
  }

  return {
    errors: [`payments: unknown provider ${String(provider)}`],
    warnings: [],
  };
}

async function main(): Promise<void> {
  console.log('vertical-template doctor\n');

  const serverEnvPath = join(ROOT, 'server/.env');
  if (existsSync(serverEnvPath)) {
    dotenv.config({ path: serverEnvPath });
  }

  const mongoResult = await checkMongo();
  const activeConfig = mongoResult.activeConfig;

  const paymentResult = await checkPayments(activeConfig);
  const envProviderForKeys =
    mongoResult.presetProvider ??
    effectivePaymentProvider(activeConfig.payment.provider);
  const envSkipKeys = new Set(
    activeConfig.features.payments
      ? paymentEnvKeysToSkip(envProviderForKeys)
      : [...STRIPE_ENV_KEYS, ...SQUARE_ENV_KEYS, 'PAYMENT_PROVIDER']
  );
  // Dev vertical walks do not need Square webhook signing; checkPayments still warns.
  if (process.env.NODE_ENV !== 'production') {
    envSkipKeys.add('SQUARE_WEBHOOK_SIGNATURE_KEY');
  }

  const warnings: string[] = [
    ...mongoResult.warnings,
    ...paymentResult.warnings,
  ];

  const errors: string[] = [
    ...checkNodeVersion(),
    ...checkServerEnvDuplicates(),
    ...checkEnvFiles(envSkipKeys),
    ...mongoResult.errors,
    ...(await runContractCheck()),
    ...checkAuth(activeConfig),
    ...paymentResult.errors,
  ];

  if (mongoResult.notices.length > 0) {
    for (const notice of mongoResult.notices) {
      console.log(`ℹ️  ${notice}`);
    }
    console.log('');
  }

  if (warnings.length > 0) {
    console.log('⚠️  Warnings:\n');
    for (const warn of warnings) {
      console.log(`  • ${warn}`);
    }
    console.log('');
  }

  if (errors.length === 0) {
    console.log('✅ All checks passed.');
    process.exit(0);
  }

  console.error('❌ Doctor found problems:\n');
  for (const err of errors) {
    console.error(`  • ${err}`);
  }
  console.error('\nFix the issues above, then run npm run doctor again.');
  process.exit(1);
}

main();
