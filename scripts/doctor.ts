/**
 * Phase 0 environment check — Node, env files, Mongo connectivity.
 * Phase 3.6 — payment provider env + credential smoke when payments pack is on.
 * Run from repo root: npm run doctor
 */

import { existsSync, readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { runContractCheck } from './contract-check';
import { defaultSiteConfig } from '../server/src/types/site-config.defaults';
import type { PaymentProviderName } from '../server/src/types/site-config';

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

async function checkMongo(): Promise<string[]> {
  const errors: string[] = [];
  const serverEnv = join(ROOT, 'server/.env');

  if (!existsSync(serverEnv)) {
    errors.push('server: cannot check Mongo — server/.env missing');
    return errors;
  }

  dotenv.config({ path: serverEnv });
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    errors.push('server: MONGODB_URI not set in server/.env');
    return errors;
  }

  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 3000 });
    await mongoose.disconnect();
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    errors.push(`MongoDB: connection failed — ${message}`);
  }

  return errors;
}

function requireEnvVar(name: string): string | null {
  const value = process.env[name]?.trim();
  return value ? value : null;
}

/** Mirrors getSiteConfig payment resolution (server/.env PAYMENT_PROVIDER override). */
function effectivePaymentProvider(): PaymentProviderName {
  const raw = process.env.PAYMENT_PROVIDER?.trim().toLowerCase();
  if (raw === 'stripe' || raw === 'square' || raw === 'none') {
    return raw;
  }
  return defaultSiteConfig.payment.provider;
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

async function checkPayments(): Promise<{
  errors: string[];
  warnings: string[];
}> {
  if (!defaultSiteConfig.features.payments) {
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
  const provider = effectivePaymentProvider();

  if (provider === 'none') {
    return {
      errors: [],
      warnings: [
        'payments: feature pack is on but payment.provider is none — checkout returns 501 until configured',
      ],
    };
  }

  const errors: string[] = [];

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
    return { errors, warnings: [] };
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
      errors.push(
        'payments/square: missing SQUARE_WEBHOOK_SIGNATURE_KEY in server/.env'
      );
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
    return { errors, warnings: [] };
  }

  return { errors: [`payments: unknown provider ${String(provider)}`], warnings: [] };
}

async function main(): Promise<void> {
  console.log('vertical-template doctor\n');

  const serverEnvPath = join(ROOT, 'server/.env');
  if (existsSync(serverEnvPath)) {
    dotenv.config({ path: serverEnvPath });
  }

  const paymentResult = await checkPayments();
  const envSkipKeys = defaultSiteConfig.features.payments
    ? paymentEnvKeysToSkip(effectivePaymentProvider())
    : new Set([...STRIPE_ENV_KEYS, ...SQUARE_ENV_KEYS, 'PAYMENT_PROVIDER']);

  const errors: string[] = [
    ...checkNodeVersion(),
    ...checkEnvFiles(envSkipKeys),
    ...(await checkMongo()),
    ...(await runContractCheck()),
    ...paymentResult.errors,
  ];

  if (paymentResult.warnings.length > 0) {
    console.log('⚠️  Warnings:\n');
    for (const warn of paymentResult.warnings) {
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
