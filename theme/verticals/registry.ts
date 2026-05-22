import type { Vertical } from '../../client/src/types/site-config';
import type { DeepPartial, ThemeTokens } from '../../client/src/types/theme-tokens';

import { verticalTokens as barRestaurantTokens } from './bar-restaurant.tokens';
import { verticalTokens as farmSourceTokens } from './farm-source.tokens';
import { verticalTokens as foodTruckTokens } from './food-truck.tokens';
import { verticalTokens as screenPrinterTokens } from './screen-printer.tokens';

/** L2 vertical token overrides keyed by SiteConfig.vertical. */
export const verticalThemeTokens: Partial<Record<Vertical, DeepPartial<ThemeTokens>>> = {
  'screen-printer': screenPrinterTokens,
  'bar-restaurant': barRestaurantTokens,
  'food-truck': foodTruckTokens,
  'farm-source': farmSourceTokens,
};
