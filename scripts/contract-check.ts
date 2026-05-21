/**
 * Dual-file contract: client/server site-config.ts must match, and
 * defaultSiteConfig must supply every required SiteConfig field.
 */

import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import ts from 'typescript';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

const TWIN_PAIRS = [
  {
    label: 'site-config.ts',
    client: join(ROOT, 'client/src/types/site-config.ts'),
    server: join(ROOT, 'server/src/types/site-config.ts'),
  },
  {
    label: 'theme-tokens.ts',
    client: join(ROOT, 'client/src/types/theme-tokens.ts'),
    server: join(ROOT, 'server/src/types/theme-tokens.ts'),
  },
];

const SITE_CONFIG_PATH = join(ROOT, 'server/src/types/site-config.ts');
const DEFAULTS_PATH = join(ROOT, 'server/src/types/site-config.defaults.ts');

function parseInterfaces(filePath: string): Map<string, ts.InterfaceDeclaration> {
  const content = readFileSync(filePath, 'utf8');
  const source = ts.createSourceFile(filePath, content, ts.ScriptTarget.Latest, true);
  const interfaces = new Map<string, ts.InterfaceDeclaration>();

  for (const statement of source.statements) {
    if (ts.isInterfaceDeclaration(statement)) {
      interfaces.set(statement.name.text, statement);
    }
  }

  return interfaces;
}

function referencedInterfaceName(type: ts.TypeNode): string | null {
  if (ts.isTypeReferenceNode(type) && ts.isIdentifier(type.typeName)) {
    return type.typeName.text;
  }
  return null;
}

/** Required field paths (dot notation) derived from SiteConfig and nested interfaces. */
function collectRequiredPaths(
  interfaceName: string,
  interfaces: Map<string, ts.InterfaceDeclaration>,
  prefix = ''
): string[] {
  const declaration = interfaces.get(interfaceName);
  if (!declaration) {
    return [];
  }

  const paths: string[] = [];

  for (const member of declaration.members) {
    if (!ts.isPropertySignature(member) || member.name === undefined || member.type === undefined) {
      continue;
    }
    if (member.questionToken) {
      continue;
    }

    const key = member.name.getText();
    const path = prefix ? `${prefix}.${key}` : key;
    const nestedInterface = referencedInterfaceName(member.type);

    if (nestedInterface && interfaces.has(nestedInterface)) {
      const nestedPaths = collectRequiredPaths(nestedInterface, interfaces, path);
      if (nestedPaths.length > 0) {
        paths.push(...nestedPaths);
      } else {
        paths.push(path);
      }
    } else {
      paths.push(path);
    }
  }

  return paths;
}

function getAtPath(value: unknown, path: string): unknown {
  let current: unknown = value;
  for (const segment of path.split('.')) {
    if (current === null || current === undefined || typeof current !== 'object') {
      return undefined;
    }
    current = (current as Record<string, unknown>)[segment];
  }
  return current;
}

function checkTwinFiles(): string[] {
  const errors: string[] = [];

  for (const { label, client, server } of TWIN_PAIRS) {
    const clientText = readFileSync(client, 'utf8');
    const serverText = readFileSync(server, 'utf8');
    if (clientText !== serverText) {
      errors.push(
        `${label}: client and server files differ (must be byte-identical)`
      );
    }
  }

  return errors;
}

function checkDefaultsAgainstType(requiredPaths: string[], defaults: unknown): string[] {
  const errors: string[] = [];

  for (const path of requiredPaths) {
    const value = getAtPath(defaults, path);
    if (value === undefined) {
      errors.push(`defaultSiteConfig: missing required field "${path}"`);
    }
  }

  return errors;
}

export async function runContractCheck(): Promise<string[]> {
  const errors: string[] = [...checkTwinFiles()];

  const interfaces = parseInterfaces(SITE_CONFIG_PATH);
  const requiredPaths = collectRequiredPaths('SiteConfig', interfaces);

  if (requiredPaths.length === 0) {
    errors.push('contract-check: could not parse SiteConfig required fields');
    return errors;
  }

  const { defaultSiteConfig } = await import(DEFAULTS_PATH);
  errors.push(...checkDefaultsAgainstType(requiredPaths, defaultSiteConfig));

  return errors;
}

async function main(): Promise<void> {
  console.log('vertical-template contract-check\n');

  const errors = await runContractCheck();

  if (errors.length === 0) {
    console.log('✅ Contract check passed.');
    console.log(`   ${collectRequiredPaths('SiteConfig', parseInterfaces(SITE_CONFIG_PATH)).length} required SiteConfig fields have defaults.`);
    console.log(`   ${TWIN_PAIRS.length} twin type file pairs are byte-identical.`);
    process.exit(0);
  }

  console.error('❌ Contract check failed:\n');
  for (const err of errors) {
    console.error(`  • ${err}`);
  }
  process.exit(1);
}

main();
