import mongoose, { Schema, type Document } from 'mongoose';
import {
  applyTenantCompoundIndex,
  tenantIdSchemaDefinition,
} from '../../../db/tenant-schema';

export type ContentStatus = 'published' | 'draft' | 'archived';

export interface PageHero {
  imageUrl?: string;
  headline?: string;
  subheadline?: string;
}

export interface IPage {
  tenantId: string;
  slug: string;
  title: string;
  body: string;
  hero?: PageHero;
  status: ContentStatus;
}

export type PageDocument = IPage & Document;

const pageSchema = new Schema<IPage>(
  {
    ...tenantIdSchemaDefinition,
    slug: { type: String, required: true, trim: true, lowercase: true },
    title: { type: String, required: true, trim: true },
    body: { type: String, required: true, default: '' },
    hero: {
      imageUrl: { type: String },
      headline: { type: String },
      subheadline: { type: String },
    },
    status: {
      type: String,
      enum: ['published', 'draft', 'archived'],
      required: true,
      default: 'draft',
    },
  },
  { timestamps: true }
);

applyTenantCompoundIndex(pageSchema, 'slug', { unique: true });

export const Page =
  mongoose.models.Page ?? mongoose.model<IPage>('Page', pageSchema);
