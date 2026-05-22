import type { DeepPartial, ThemeTokens } from '../../client/src/types/theme-tokens';

/**
 * L2 vertical tokens — screen-printer.
 * see theme/verticals/screen-printer.brief.md
 */
export const verticalTokens: DeepPartial<ThemeTokens> = {
  color: {
    bg: {
      DEFAULT: '#f2f0eb',
      panel: '#ffffff',
    },
    ink: {
      DEFAULT: '#0a0a0a',
      soft: '#2d2d2d',
      muted: '#5c5c5c',
    },
    rule: '#d4d0c8',
    accent: {
      DEFAULT: '#c41e1e',
      soft: '#fde8e8',
    },
  },
  type: {
    heading: {
      family: '"JetBrains Mono", "Roboto Condensed", ui-monospace, monospace',
      weight: '700',
      tracking: '-0.04em',
    },
  },
  size: {
    h1: '2.75rem',
    h2: '2.125rem',
  },
  radius: {
    sm: '0.125rem',
    md: '0.25rem',
    lg: '0.375rem',
  },
  shadow: {
    sm: '0 1px 0 rgba(10, 10, 10, 0.12)',
    md: '0 4px 0 rgba(10, 10, 10, 0.08)',
  },
};
