import type { ThemeTokens } from '../client/src/types/theme-tokens';

import { resolveTokens } from './resolve';
import { DEMO_TENANT_IDS } from './tenants/registry';
import {
  VERTICAL_PRESET_KEYS,
  resolveSiteConfigForPreset,
} from '../verticals/registry';

const BODY_MIN_RATIO = 4.5;
const ACCENT_MIN_RATIO = 3.0;
const ACCENT_WARN_RATIO = 4.5;

export type ContrastPairKind = 'body' | 'accent';

export type ContrastPairId =
  | 'ink-on-bg'
  | 'ink-soft-on-bg'
  | 'bg-on-accent'
  | 'ink-on-bg-panel';

export interface ContrastPairDefinition {
  id: ContrastPairId;
  label: string;
  kind: ContrastPairKind;
  foreground: (tokens: ThemeTokens) => string;
  background: (tokens: ThemeTokens) => string;
}

export interface ContrastPairResult {
  id: ContrastPairId;
  label: string;
  kind: ContrastPairKind;
  foreground: string;
  background: string;
  ratio: number;
}

export interface ContrastValidationResult {
  pairs: ContrastPairResult[];
  errors: string[];
  warnings: string[];
}

export const CONTRAST_PAIRS: ContrastPairDefinition[] = [
  {
    id: 'ink-on-bg',
    label: 'color.ink on color.bg',
    kind: 'body',
    foreground: (tokens) => tokens.color.ink.DEFAULT,
    background: (tokens) => tokens.color.bg.DEFAULT,
  },
  {
    id: 'ink-soft-on-bg',
    label: 'color.ink.soft on color.bg',
    kind: 'body',
    foreground: (tokens) => tokens.color.ink.soft,
    background: (tokens) => tokens.color.bg.DEFAULT,
  },
  {
    id: 'bg-on-accent',
    label: 'color.bg on color.accent',
    kind: 'accent',
    foreground: (tokens) => tokens.color.bg.DEFAULT,
    background: (tokens) => tokens.color.accent.DEFAULT,
  },
  {
    id: 'ink-on-bg-panel',
    label: 'color.ink on color.bg.panel',
    kind: 'body',
    foreground: (tokens) => tokens.color.ink.DEFAULT,
    background: (tokens) => tokens.color.bg.panel,
  },
];

function parseHexColor(input: string): [number, number, number] {
  const value = input.trim();
  const hex = value.startsWith('#') ? value.slice(1) : value;

  if (hex.length === 3) {
    const r = parseInt(hex[0] + hex[0], 16);
    const g = parseInt(hex[1] + hex[1], 16);
    const b = parseInt(hex[2] + hex[2], 16);
    return [r, g, b];
  }

  if (hex.length === 6) {
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    return [r, g, b];
  }

  throw new Error(`unsupported color format "${input}" — expected #RGB or #RRGGBB`);
}

function channelLuminance(channel: number): number {
  const normalized = channel / 255;
  return normalized <= 0.03928
    ? normalized / 12.92
    : ((normalized + 0.055) / 1.055) ** 2.4;
}

function relativeLuminance(color: string): number {
  const [r, g, b] = parseHexColor(color);
  return (
    0.2126 * channelLuminance(r) +
    0.7152 * channelLuminance(g) +
    0.0722 * channelLuminance(b)
  );
}

/** WCAG 2.x contrast ratio for two CSS color values. */
export function contrastRatio(foreground: string, background: string): number {
  const fg = relativeLuminance(foreground);
  const bg = relativeLuminance(background);
  const lighter = Math.max(fg, bg);
  const darker = Math.min(fg, bg);
  return (lighter + 0.05) / (darker + 0.05);
}

function formatRatio(ratio: number): string {
  return `${ratio.toFixed(2)}:1`;
}

function evaluatePair(pair: ContrastPairResult): { errors: string[]; warnings: string[] } {
  const errors: string[] = [];
  const warnings: string[] = [];
  const ratioLabel = formatRatio(pair.ratio);

  if (pair.kind === 'body') {
    if (pair.ratio < BODY_MIN_RATIO) {
      errors.push(
        `${pair.label} is ${ratioLabel} (${pair.foreground} on ${pair.background}) — requires >= ${BODY_MIN_RATIO}:1`
      );
    }
    return { errors, warnings };
  }

  if (pair.ratio < ACCENT_MIN_RATIO) {
    errors.push(
      `${pair.label} is ${ratioLabel} (${pair.foreground} on ${pair.background}) — requires >= ${ACCENT_MIN_RATIO}:1`
    );
  } else if (pair.ratio < ACCENT_WARN_RATIO) {
    warnings.push(
      `${pair.label} is ${ratioLabel} (${pair.foreground} on ${pair.background}) — passes large text (${ACCENT_MIN_RATIO}:1) but below ${ACCENT_WARN_RATIO}:1`
    );
  }

  return { errors, warnings };
}

/** Validate WCAG contrast for standard token pairs on resolved theme tokens. */
export function validateContrast(tokens: ThemeTokens): ContrastValidationResult {
  const pairs: ContrastPairResult[] = CONTRAST_PAIRS.map((definition) => {
    const foreground = definition.foreground(tokens);
    const background = definition.background(tokens);
    return {
      id: definition.id,
      label: definition.label,
      kind: definition.kind,
      foreground,
      background,
      ratio: contrastRatio(foreground, background),
    };
  });

  const errors: string[] = [];
  const warnings: string[] = [];

  for (const pair of pairs) {
    const result = evaluatePair(pair);
    errors.push(...result.errors);
    warnings.push(...result.warnings);
  }

  return { pairs, errors, warnings };
}

export interface ThemeContrastMatrixResult {
  errors: string[];
  warnings: string[];
  checked: number;
}

/** Validate contrast for every vertical × demo-tenant resolved token set. */
export function runThemeContrastMatrix(): ThemeContrastMatrixResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  let checked = 0;

  for (const vertical of VERTICAL_PRESET_KEYS) {
    for (const tenantId of DEMO_TENANT_IDS) {
      const siteConfig = resolveSiteConfigForPreset(vertical, tenantId);
      const tokens = resolveTokens(siteConfig, tenantId);
      const result = validateContrast(tokens);
      checked += 1;

      const prefix = `${vertical} × ${tenantId}`;
      for (const error of result.errors) {
        errors.push(`theme/contrast (${prefix}): ${error}`);
      }
      for (const warning of result.warnings) {
        warnings.push(`theme/contrast (${prefix}): ${warning}`);
      }
    }
  }

  return { errors, warnings, checked };
}
