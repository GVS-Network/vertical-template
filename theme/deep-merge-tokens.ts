import type { DeepPartial, ThemeTokens } from '../client/src/types/theme-tokens';

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

/** Deep-merge partial theme layers onto a full token object. */
export function deepMergeThemeTokens(
  base: ThemeTokens,
  partial: DeepPartial<ThemeTokens>
): ThemeTokens {
  const result = structuredClone(base) as unknown as Record<string, unknown>;
  mergeInto(result, partial as Record<string, unknown>);
  return result as ThemeTokens;
}

function mergeInto(target: Record<string, unknown>, source: Record<string, unknown>): void {
  for (const [key, value] of Object.entries(source)) {
    if (value === undefined) {
      continue;
    }

    if (isPlainObject(value) && isPlainObject(target[key])) {
      mergeInto(target[key] as Record<string, unknown>, value);
    } else {
      target[key] = value;
    }
  }
}
