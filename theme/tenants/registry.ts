import type { DeepPartial, ThemeTokens } from '../../client/src/types/theme-tokens';

import { pick as demoBarRestaurantPick } from './demo-bar-restaurant.pick';
import { override as demoBarRestaurantOverride } from './demo-bar-restaurant.override';
import { pick as demoFarmSourcePick } from './demo-farm-source.pick';
import { override as demoFarmSourceOverride } from './demo-farm-source.override';
import { pick as demoFoodTruckPick } from './demo-food-truck.pick';
import { override as demoFoodTruckOverride } from './demo-food-truck.override';
import { pick as demoScreenPrinterPick } from './demo-screen-printer.pick';
import { override as demoScreenPrinterOverride } from './demo-screen-printer.override';

/** Demo tenant IDs provisioned by Phase 4 init-vertical. */
export const DEMO_TENANT_IDS = [
  'demo-screen-printer',
  'demo-bar-restaurant',
  'demo-food-truck',
  'demo-farm-source',
] as const;

export type DemoTenantId = (typeof DEMO_TENANT_IDS)[number];

export interface TenantThemeLayers {
  pick: DeepPartial<ThemeTokens>;
  override: DeepPartial<ThemeTokens>;
}

/** L3 pick + L4 override layers keyed by tenantId. */
export const tenantThemes: Record<DemoTenantId, TenantThemeLayers> = {
  'demo-screen-printer': {
    pick: demoScreenPrinterPick,
    override: demoScreenPrinterOverride,
  },
  'demo-bar-restaurant': {
    pick: demoBarRestaurantPick,
    override: demoBarRestaurantOverride,
  },
  'demo-food-truck': {
    pick: demoFoodTruckPick,
    override: demoFoodTruckOverride,
  },
  'demo-farm-source': {
    pick: demoFarmSourcePick,
    override: demoFarmSourceOverride,
  },
};
