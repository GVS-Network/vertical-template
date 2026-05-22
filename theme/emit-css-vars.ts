import type { ThemeTokens } from '../client/src/types/theme-tokens';

import { THEME_TOKEN_LEAF_PATHS, toCanonicalLeafPath } from './theme-token-leaf-paths';

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

/** Dot path → CSS custom property (`color.bg.DEFAULT` → `--color-bg`). */
export function leafPathToCssVar(leafPath: string): string {
  const canonical = toCanonicalLeafPath(leafPath);
  return `--${canonical.replace(/\./g, '-')}`;
}

/** Emit a `:root { … }` block of CSS variables from resolved theme tokens. */
export function emitCssVars(tokens: ThemeTokens): string {
  const lines = [':root {'];

  for (const path of [...THEME_TOKEN_LEAF_PATHS].sort()) {
    const value = getAtPath(tokens, path);
    if (value === undefined) {
      continue;
    }
    lines.push(`  ${leafPathToCssVar(path)}: ${String(value)};`);
  }

  lines.push('}');
  return lines.join('\n');
}
