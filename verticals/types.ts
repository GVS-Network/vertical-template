import type { z } from 'zod';
import type { SiteConfig, Vertical } from '../server/src/types/site-config';
import type { ThemeTokens } from '../client/src/types/theme-tokens';

/** Preset keys — all built-in verticals except `generic`. */
export type VerticalPresetKey = Exclude<Vertical, 'generic'>;

export type VerticalPresetEntry = {
  preset: Partial<SiteConfig>;
  brandStub: Partial<ThemeTokens>;
  productAttributesSchema: z.ZodTypeAny;
};
