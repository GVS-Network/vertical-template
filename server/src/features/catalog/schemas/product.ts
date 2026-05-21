import mongoose, { Schema, type Document } from 'mongoose';
import {
  applyTenantCompoundIndex,
  tenantIdSchemaDefinition,
} from '../../../db/tenant-schema';

export type ProductStatus = 'active' | 'draft' | 'archived';

export interface IProduct {
  tenantId: string;
  name: string;
  slug: string;
  sku: string;
  price: number;
  stock: number | null;
  status: ProductStatus;
  attributes: Record<string, unknown>;
}

export type ProductDocument = IProduct & Document;

const productSchema = new Schema<IProduct>(
  {
    ...tenantIdSchemaDefinition,
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, trim: true, lowercase: true },
    sku: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, default: null },
    status: {
      type: String,
      enum: ['active', 'draft', 'archived'],
      required: true,
      default: 'active',
    },
    attributes: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

applyTenantCompoundIndex(productSchema, 'slug', { unique: true });

export const Product =
  mongoose.models.Product ??
  mongoose.model<IProduct>('Product', productSchema);
