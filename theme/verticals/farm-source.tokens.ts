import type { DeepPartial, ThemeTokens } from '../../client/src/types/theme-tokens';

/**
 * L2 vertical tokens — farm-source.
 * see theme/verticals/farm-source.brief.md
 */
export const verticalTokens: DeepPartial<ThemeTokens> = {
  color: {
    bg: {
      DEFAULT: '#f0e9dc',
      panel: '#f7f2e8',
    },
    ink: {
      DEFAULT: '#3d2c24',
      soft: '#5c4a40',
      muted: '#7a6a60',
    },
    rule: '#d4c8b4',
    accent: {
      DEFAULT: '#3d5c3a',
      soft: '#e8e4d0',
    },
    green: '#3d5c3a',
  },
  type: {
    heading: {
      family: '"Libre Baskerville", Georgia, "Times New Roman", serif',
      weight: '600',
      tracking: '0',
    },
  },
  radius: {
    sm: '0.3125rem',
    md: '0.5rem',
    lg: '0.625rem',
  },
  shadow: {
    sm: '0 1px 3px rgba(61, 44, 36, 0.08)',
    md: '0 4px 16px rgba(61, 44, 36, 0.1)',
  },
};
