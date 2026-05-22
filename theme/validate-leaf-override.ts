import type { DeepPartial, ThemeTokens } from '../client/src/types/theme-tokens';

import { THEME_TOKEN_LEAF_PATHS, toCanonicalLeafPath } from './theme-token-leaf-paths';

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

/** Collect terminal primitive paths from a partial token tree. */
export function collectPartialLeafPaths(
  partial: DeepPartial<ThemeTokens>,
  prefix = ''
): string[] {
  const paths: string[] = [];

  for (const [key, value] of Object.entries(partial)) {
    if (value === undefined) {
      continue;
    }

    const path = prefix ? `${prefix}.${key}` : key;

    if (isPlainObject(value)) {
      paths.push(...collectPartialLeafPaths(value as DeepPartial<ThemeTokens>, path));
    } else {
      paths.push(path);
    }
  }

  return paths;
}

/**
 * L4 guardrail — every override path must terminate at a ThemeTokens leaf.
 * @throws when a path is missing or terminates at a non-leaf node
 */
export function validateLeafOnlyOverride(
  override: DeepPartial<ThemeTokens>,
  sourceFile: string
): void {
  const paths = collectPartialLeafPaths(override);

  for (const path of paths) {
    if (!THEME_TOKEN_LEAF_PATHS.has(path)) {
      throw new Error(
        `${sourceFile}: override path "${toCanonicalLeafPath(path)}" is not a ThemeTokens leaf — only leaf-level overrides are allowed`
      );
    }
  }
}
