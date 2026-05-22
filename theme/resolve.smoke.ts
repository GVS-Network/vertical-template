/**
 * resolveTokens smoke tests (Prompt 5.6).
 * Run: npm run test:resolve-tokens
 */
import { defaultSiteConfig } from '../server/src/types/site-config.defaults';

import { foundation } from './foundation.tokens';
import {
  deepMergeThemeTokens,
  resolveTokens,
  validateLeafOnlyOverride,
} from './resolve';
import { verticalTokens as screenPrinterVertical } from './verticals/screen-printer.tokens';

function assert(condition: boolean, message: string): void {
  if (!condition) {
    throw new Error(message);
  }
}

function assertEqual<T>(actual: T, expected: T, label: string): void {
  if (actual !== expected) {
    throw new Error(`${label}: expected ${String(expected)}, got ${String(actual)}`);
  }
}

function testFoundationOnly(): void {
  const config = { ...defaultSiteConfig, vertical: 'generic' as const };
  const resolved = resolveTokens(config, 'unknown-tenant');

  assertEqual(resolved.color.bg.DEFAULT, foundation.color.bg.DEFAULT, 'foundation bg');
  assertEqual(resolved.color.accent.DEFAULT, foundation.color.accent.DEFAULT, 'foundation accent');
  assertEqual(
    resolved.type.heading.family,
    foundation.type.heading.family,
    'foundation heading family'
  );
}

function testVerticalOverridesFoundation(): void {
  const config = { ...defaultSiteConfig, vertical: 'screen-printer' as const };
  const resolved = resolveTokens(config, 'unknown-tenant');

  assertEqual(resolved.color.ink.DEFAULT, '#0a0a0a', 'screen-printer ink');
  assertEqual(resolved.color.accent.DEFAULT, '#c41e1e', 'screen-printer accent');
  assert(
    resolved.color.accent.DEFAULT !== foundation.color.accent.DEFAULT,
    'vertical accent must differ from foundation'
  );
  assertEqual(
    resolved.type.heading.family,
    screenPrinterVertical.type?.heading?.family,
    'screen-printer heading family'
  );
}

function testPickAddsBundledLeafChanges(): void {
  let tokens = deepMergeThemeTokens(foundation, screenPrinterVertical);
  tokens = deepMergeThemeTokens(tokens, {
    color: {
      accent: {
        DEFAULT: '#pick-accent',
      },
    },
  });

  assertEqual(tokens.color.accent.DEFAULT, '#pick-accent', 'pick accent');
  assertEqual(tokens.color.ink.DEFAULT, '#0a0a0a', 'vertical ink preserved under pick');
}

function testOverrideAtNonLeafThrows(): void {
  let threw = false;
  try {
    validateLeafOnlyOverride(
      {
        color: {
          bg: '#not-a-leaf',
        },
      },
      'theme/tenants/test.override.ts'
    );
  } catch (error) {
    threw = true;
    const message = error instanceof Error ? error.message : String(error);
    assert(message.includes('theme/tenants/test.override.ts'), 'error cites source file');
    assert(message.includes('color.bg'), 'error cites offending path');
  }

  assert(threw, 'non-leaf override must throw');
}

function testOverrideAtLeafWins(): void {
  const config = { ...defaultSiteConfig, vertical: 'screen-printer' as const };
  let tokens = resolveTokens(config, 'unknown-tenant');

  validateLeafOnlyOverride(
    {
      color: {
        accent: {
          DEFAULT: '#override-wins',
        },
      },
    },
    'theme/tenants/test.override.ts'
  );

  tokens = deepMergeThemeTokens(tokens, {
    color: {
      accent: {
        DEFAULT: '#override-wins',
      },
    },
  });

  assertEqual(tokens.color.accent.DEFAULT, '#override-wins', 'override accent wins');
  assertEqual(tokens.color.ink.DEFAULT, '#0a0a0a', 'non-overridden leaves unchanged');
}

function main(): void {
  testFoundationOnly();
  testVerticalOverridesFoundation();
  testPickAddsBundledLeafChanges();
  testOverrideAtNonLeafThrows();
  testOverrideAtLeafWins();

  console.log('resolve-tokens smoke: all tests passed');
  console.log('  foundation-only resolves correctly');
  console.log('  vertical overrides foundation leaf-by-leaf');
  console.log('  pick adds bundled leaf changes');
  console.log('  override at non-leaf throws');
  console.log('  override at leaf wins');
}

main();
