import type { DeepPartial, ThemeTokens } from '../../client/src/types/theme-tokens';

/**
 * L2 vertical tokens — food-truck.
 * see theme/verticals/food-truck.brief.md
 */
export const verticalTokens: DeepPartial<ThemeTokens> = {
  color: {
    bg: {
      DEFAULT: '#ffffff',
      panel: '#f7f7f7',
    },
    ink: {
      DEFAULT: '#141414',
      soft: '#333333',
      muted: '#555555',
    },
    rule: '#e0e0e0',
    accent: {
      DEFAULT: '#d62828',
      soft: '#ffe5e5',
    },
  },
  type: {
    heading: {
      family: '"Roboto Condensed", "Arial Narrow", "Helvetica Neue", sans-serif',
      weight: '700',
      tracking: '0.02em',
    },
    body: {
      weight: '500',
    },
  },
  radius: {
    sm: '0.125rem',
    md: '0.1875rem',
    lg: '0.25rem',
  },
  motion: {
    duration: {
      fast: '120ms',
      med: '200ms',
    },
  },
};
