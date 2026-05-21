/**
 * Phase 0 environment check — Node, env files, Mongo connectivity.
 * Run from repo root: npm run doctor
 */

import { existsSync, readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { runContractCheck } from './contract-check';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

const ENV_PAIRS: { label: string; example: string; env: string }[] = [
  { label: 'root', example: join(ROOT, '.env.example'), env: join(ROOT, '.env') },
  { label: 'server', example: join(ROOT, 'server/.env.example'), env: join(ROOT, 'server/.env') },
  { label: 'client', example: join(ROOT, 'client/.env.example'), env: join(ROOT, 'client/.env') },
];

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

function checkEnvFiles(): string[] {
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

async function main(): Promise<void> {
  console.log('vertical-template doctor\n');

  const errors: string[] = [
    ...checkNodeVersion(),
    ...checkEnvFiles(),
    ...(await checkMongo()),
    ...(await runContractCheck()),
  ];

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
