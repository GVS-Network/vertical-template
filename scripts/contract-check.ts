/**
 * Dual-file contract: client/server site-config.ts must match, and
 * defaultSiteConfig must supply every required SiteConfig field.
 * ThemeTokens twin files must match; foundation must supply every leaf.
 */

import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
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
const THEME_TOKENS_PATH = join(ROOT, 'client/src/types/theme-tokens.ts');
const DEFAULTS_PATH = join(ROOT, 'server/src/types/site-config.defaults.ts');
const FOUNDATION_PATH = join(ROOT, 'theme/foundation.tokens.ts');

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

/** Required field paths (dot notation) derived from an interface and nested interfaces. */
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

/** Canonical leaf path for messages (`color.bg.DEFAULT` → `color.bg`). */
function toCanonicalLeafPath(path: string): string {
  return path.endsWith('.DEFAULT') ? path.slice(0, -'.DEFAULT'.length) : path;
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

function checkDefaultsAgainstType(
  label: string,
  requiredPaths: string[],
  defaults: unknown
): string[] {
  const errors: string[] = [];

  for (const path of requiredPaths) {
    const value = getAtPath(defaults, path);
    if (value === undefined) {
      errors.push(`${label}: missing required field "${toCanonicalLeafPath(path)}"`);
    }
  }

  return errors;
}

export async function runContractCheck(): Promise<string[]> {
  const errors: string[] = [...checkTwinFiles()];

  const siteInterfaces = parseInterfaces(SITE_CONFIG_PATH);
  const siteRequiredPaths = collectRequiredPaths('SiteConfig', siteInterfaces);

  if (siteRequiredPaths.length === 0) {
    errors.push('contract-check: could not parse SiteConfig required fields');
  } else {
    const { defaultSiteConfig } = await import(DEFAULTS_PATH);
    errors.push(
      ...checkDefaultsAgainstType('defaultSiteConfig', siteRequiredPaths, defaultSiteConfig)
    );
  }

  const themeInterfaces = parseInterfaces(THEME_TOKENS_PATH);
  const themeRequiredPaths = collectRequiredPaths('ThemeTokens', themeInterfaces);

  if (themeRequiredPaths.length === 0) {
    errors.push('contract-check: could not parse ThemeTokens required fields');
  } else {
    const { foundation } = await import(FOUNDATION_PATH);
    errors.push(
      ...checkDefaultsAgainstType('foundation', themeRequiredPaths, foundation)
    );
  }

  return errors;
}

async function main(): Promise<void> {
  console.log('vertical-template contract-check\n');

  const errors = await runContractCheck();

  if (errors.length === 0) {
    const sitePaths = collectRequiredPaths('SiteConfig', parseInterfaces(SITE_CONFIG_PATH));
    const themePaths = collectRequiredPaths('ThemeTokens', parseInterfaces(THEME_TOKENS_PATH));
    console.log('✅ Contract check passed.');
    console.log(`   ${sitePaths.length} required SiteConfig fields have defaults.`);
    console.log(`   ${themePaths.length} required ThemeTokens leaves have foundation values.`);
    console.log(`   ${TWIN_PAIRS.length} twin type file pairs are byte-identical.`);
    process.exit(0);
  }

  console.error('❌ Contract check failed:\n');
  for (const err of errors) {
    console.error(`  • ${err}`);
  }
  process.exit(1);
}

const isDirectRun =
  process.argv[1] !== undefined &&
  import.meta.url === pathToFileURL(process.argv[1]).href;

if (isDirectRun) {
  void main();
}
