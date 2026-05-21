import type { IndexOptions, Schema } from 'mongoose';

/** Reuse on every Mongoose schema (phase 1+). */
export const tenantIdSchemaDefinition = {
  tenantId: {
    type: String,
    required: true,
    default: 'default',
    index: true,
  },
} as const;

/**
 * Compound index: (tenantId, primaryLookupField).
 * Call once per schema after fields are defined (e.g. slug, auth0Id, sku).
 */
export function applyTenantCompoundIndex(
  schema: Schema,
  primaryLookupField: string,
  indexOptions?: IndexOptions
): void {
  schema.index({ tenantId: 1, [primaryLookupField]: 1 }, indexOptions);
}
