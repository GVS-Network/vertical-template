/**
 * Vertical preset registry smoke (Prompt 4.2).
 * Run: npm run test:vertical-registry
 */
import {
  VERTICAL_PRESET_KEYS,
  mergePreset,
  verticalPresets,
} from './registry';

function main(): void {
  for (const key of VERTICAL_PRESET_KEYS) {
    const entry = verticalPresets[key];
    if (entry.preset.vertical !== key) {
      throw new Error(
        `preset.vertical mismatch for ${key}: got ${String(entry.preset.vertical)}`
      );
    }

    const merged = mergePreset({ ...entry.preset, tenantId: 'smoke-tenant' });
    if (merged.vertical !== key) {
      throw new Error(`mergePreset vertical mismatch for ${key}`);
    }
    if (!merged.payment.provider || merged.payment.provider === 'none') {
      throw new Error(`${key}: payment.provider must be stripe or square in stub`);
    }

    const parsed = entry.productAttributesSchema.safeParse({});
    if (!parsed.success) {
      throw new Error(`${key}: empty attributes must parse: ${parsed.error.message}`);
    }
  }

  console.log('vertical-registry smoke: all presets registered and merge OK');
  for (const key of VERTICAL_PRESET_KEYS) {
    console.log(`  ${key} → ${verticalPresets[key].preset.payment?.provider}`);
  }
}

main();
