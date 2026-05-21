import mongoose, { Schema, type Document } from 'mongoose';

/** Mirrors SiteConfig vertical keys provisioned via init-vertical (phase 4). */
export type TenantRegistryPreset =
  | 'screen-printer'
  | 'bar-restaurant'
  | 'food-truck'
  | 'farm-source';

/**
 * Phase 4 placeholder until phase 7 Tenant model.
 * Collection: _tenants (not tenant-filtered — registry of provisioned tenants).
 */
export interface ITenantRegistry {
  _id: string;
  preset: TenantRegistryPreset;
  createdAt: Date;
  seededAt: Date;
}

export type TenantRegistryDocument = ITenantRegistry & Document;

const tenantRegistrySchema = new Schema<ITenantRegistry>(
  {
    _id: { type: String, required: true },
    preset: {
      type: String,
      enum: ['screen-printer', 'bar-restaurant', 'food-truck', 'farm-source'],
      required: true,
    },
    createdAt: { type: Date, required: true, default: () => new Date() },
    seededAt: { type: Date, required: true, default: () => new Date() },
  },
  { collection: '_tenants', timestamps: false, versionKey: false }
);

export const TenantRegistry =
  mongoose.models.TenantRegistry ??
  mongoose.model<ITenantRegistry>('TenantRegistry', tenantRegistrySchema);
