import type { ThemeTokens } from '../client/src/types/theme-tokens';

/**
 * L1 foundation — neutral, accessible defaults.
 * A site using only this layer should read as a quiet, well-typeset blank page.
 * see docs/prompts/phase-5-visual-system.html §5.3
 */
export const foundation: ThemeTokens = {
  color: {
    bg: {
      DEFAULT: '#f5f1ea',
      panel: '#faf8f5',
    },
    ink: {
      DEFAULT: '#1a1a1a',
      soft: '#4a4a4a',
      muted: '#6b6b6b',
    },
    rule: '#e0dcd4',
    accent: {
      DEFAULT: '#1e4a7a',
      soft: '#e8eef4',
    },
    green: '#2f6b3a',
    amber: '#9a6700',
    blue: '#1e4a7a',
    danger: '#b42318',
  },
  type: {
    heading: {
      family: 'Fraunces, Georgia, "Times New Roman", serif',
      weight: '600',
      tracking: '-0.02em',
    },
    body: {
      family: '"Inter Tight", system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
      weight: '400',
    },
    mono: {
      family: '"JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace',
    },
  },
  size: {
    base: '1rem',
    h1: '2.5rem',
    h2: '2rem',
    h3: '1.5rem',
    body: '1rem',
    small: '0.875rem',
    mono: '0.875rem',
  },
  space: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2.5rem',
  },
  radius: {
    sm: '0.25rem',
    md: '0.5rem',
    lg: '0.75rem',
  },
  shadow: {
    sm: '0 1px 2px rgba(26, 26, 26, 0.06)',
    md: '0 4px 12px rgba(26, 26, 26, 0.08)',
  },
  motion: {
    duration: {
      fast: '150ms',
      med: '250ms',
    },
    ease: 'ease',
  },
};
