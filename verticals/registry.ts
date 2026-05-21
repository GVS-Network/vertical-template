import { brandStub as barRestaurantBrand } from './bar-restaurant/brand-stub';
import { preset as barRestaurantPreset } from './bar-restaurant/site-config.preset';
import { productAttributesSchema as barRestaurantAttributes } from './bar-restaurant/product-attributes.schema';
import { brandStub as farmSourceBrand } from './farm-source/brand-stub';
import { preset as farmSourcePreset } from './farm-source/site-config.preset';
import { productAttributesSchema as farmSourceAttributes } from './farm-source/product-attributes.schema';
import { brandStub as foodTruckBrand } from './food-truck/brand-stub';
import { preset as foodTruckPreset } from './food-truck/site-config.preset';
import { productAttributesSchema as foodTruckAttributes } from './food-truck/product-attributes.schema';
import { mergePreset } from './merge-preset';
import { brandStub as screenPrinterBrand } from './screen-printer/brand-stub';
import { preset as screenPrinterPreset } from './screen-printer/site-config.preset';
import { productAttributesSchema as screenPrinterAttributes } from './screen-printer/product-attributes.schema';
import type { VerticalPresetEntry, VerticalPresetKey } from './types';

export { mergePreset } from './merge-preset';
export type { VerticalPresetEntry, VerticalPresetKey } from './types';

/** Built-in vertical presets (excludes `generic`). Order matches build order in README. */
export const VERTICAL_PRESET_KEYS = [
  'screen-printer',
  'bar-restaurant',
  'food-truck',
  'farm-source',
] as const satisfies readonly VerticalPresetKey[];

export const verticalPresets: Record<VerticalPresetKey, VerticalPresetEntry> = {
  'screen-printer': {
    preset: screenPrinterPreset,
    brandStub: screenPrinterBrand,
    productAttributesSchema: screenPrinterAttributes,
  },
  'bar-restaurant': {
    preset: barRestaurantPreset,
    brandStub: barRestaurantBrand,
    productAttributesSchema: barRestaurantAttributes,
  },
  'food-truck': {
    preset: foodTruckPreset,
    brandStub: foodTruckBrand,
    productAttributesSchema: foodTruckAttributes,
  },
  'farm-source': {
    preset: farmSourcePreset,
    brandStub: farmSourceBrand,
    productAttributesSchema: farmSourceAttributes,
  },
};

export function isVerticalPresetKey(value: string): value is VerticalPresetKey {
  return (VERTICAL_PRESET_KEYS as readonly string[]).includes(value);
}

export function resolveSiteConfigForPreset(
  key: VerticalPresetKey,
  tenantId: string
): ReturnType<typeof mergePreset> {
  const entry = verticalPresets[key];
  return mergePreset({
    ...entry.preset,
    tenantId,
    vertical: key,
  });
}
