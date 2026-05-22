/**
 * Resolved visual tokens — merge target for foundation → vertical → pick → override.
 * Dot paths drive contract-check, resolveTokens, emitCssVars, and contrast validation.
 *
 * Groups with a `DEFAULT` key use the parent path as the leaf (e.g. `color.bg` → `color.bg.DEFAULT`).
 * see visual-system-brief §03 — v1 leaf registry; phase-5 prompt narrows to CSS primitives.
 */

export interface ThemeTokens {
  color: ThemeColorTokens;
  type: ThemeTypeTokens;
  size: ThemeSizeTokens;
  space: ThemeSpaceTokens;
  radius: ThemeRadiusTokens;
  shadow: ThemeShadowTokens;
  motion: ThemeMotionTokens;
}

export interface ThemeColorTokens {
  bg: ThemeBgTokens;
  ink: ThemeInkTokens;
  rule: string;
  accent: ThemeAccentTokens;
  green: string;
  amber: string;
  blue: string;
  danger: string;
}

/** Page `color.bg` + raised surface `color.bg.panel`. */
export interface ThemeBgTokens {
  DEFAULT: string;
  panel: string;
}

/** Body copy `color.ink` + de-emphasis steps. */
export interface ThemeInkTokens {
  DEFAULT: string;
  soft: string;
  muted: string;
}

/** Primary brand accent `color.accent` + tinted surface `color.accent.soft`. */
export interface ThemeAccentTokens {
  DEFAULT: string;
  soft: string;
}

export interface ThemeTypeTokens {
  heading: ThemeTypeHeadingTokens;
  body: ThemeTypeBodyTokens;
  mono: ThemeTypeMonoTokens;
}

export interface ThemeTypeHeadingTokens {
  family: string;
  weight: string;
  tracking: string;
}

export interface ThemeTypeBodyTokens {
  family: string;
  weight: string;
}

export interface ThemeTypeMonoTokens {
  family: string;
}

export interface ThemeSizeTokens {
  base: string;
  h1: string;
  h2: string;
  h3: string;
  body: string;
  small: string;
  mono: string;
}

export interface ThemeSpaceTokens {
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
}

export interface ThemeRadiusTokens {
  sm: string;
  md: string;
  lg: string;
}

export interface ThemeShadowTokens {
  sm: string;
  md: string;
}

export interface ThemeMotionTokens {
  duration: ThemeMotionDurationTokens;
  ease: string;
}

export interface ThemeMotionDurationTokens {
  fast: string;
  med: string;
}

/** Deep partial for L2–L4 override layers (vertical, pick, tenant override). */
export type DeepPartialThemeTokens = DeepPartial<ThemeTokens>;

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};
