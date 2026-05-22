/**
 * Valid ThemeTokens leaf paths (dot notation, including DEFAULT keys).
 * Keep in sync with ThemeTokens — contract-check parses the same shape from types.
 */
export const THEME_TOKEN_LEAF_PATHS = new Set<string>([
  'color.bg.DEFAULT',
  'color.bg.panel',
  'color.ink.DEFAULT',
  'color.ink.soft',
  'color.ink.muted',
  'color.rule',
  'color.accent.DEFAULT',
  'color.accent.soft',
  'color.green',
  'color.amber',
  'color.blue',
  'color.danger',
  'type.heading.family',
  'type.heading.weight',
  'type.heading.tracking',
  'type.body.family',
  'type.body.weight',
  'type.mono.family',
  'size.base',
  'size.h1',
  'size.h2',
  'size.h3',
  'size.body',
  'size.small',
  'size.mono',
  'space.xs',
  'space.sm',
  'space.md',
  'space.lg',
  'space.xl',
  'radius.sm',
  'radius.md',
  'radius.lg',
  'shadow.sm',
  'shadow.md',
  'motion.duration.fast',
  'motion.duration.med',
  'motion.ease',
]);

/** Display path for errors (`color.bg.DEFAULT` → `color.bg`). */
export function toCanonicalLeafPath(path: string): string {
  return path.endsWith('.DEFAULT') ? path.slice(0, -'.DEFAULT'.length) : path;
}
