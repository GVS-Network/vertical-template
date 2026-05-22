import type { DeepPartial, ThemeTokens } from '../../client/src/types/theme-tokens';

/**
 * L2 vertical tokens — bar-restaurant.
 * see theme/verticals/bar-restaurant.brief.md
 */
export const verticalTokens: DeepPartial<ThemeTokens> = {
  color: {
    bg: {
      DEFAULT: '#f3ebe0',
      panel: '#faf5ee',
    },
    ink: {
      DEFAULT: '#2a2220',
      soft: '#4a4038',
      muted: '#6b6158',
    },
    rule: '#ddd0c0',
    accent: {
      DEFAULT: '#8b4a42',
      soft: '#f0e4dc',
    },
  },
  type: {
    heading: {
      family: 'Fraunces, "Libre Baskerville", Georgia, serif',
      weight: '500',
      tracking: '-0.01em',
    },
  },
  radius: {
    sm: '0.375rem',
    md: '0.625rem',
    lg: '1rem',
  },
  shadow: {
    sm: '0 2px 8px rgba(42, 34, 32, 0.06)',
    md: '0 8px 24px rgba(42, 34, 32, 0.1)',
  },
};
