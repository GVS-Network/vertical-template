import mongoose, { Schema, type Document } from 'mongoose';
import {
  applyTenantCompoundIndex,
  tenantIdSchemaDefinition,
} from '../../../db/tenant-schema';
import type { ContentStatus } from './page';

export interface IPost {
  tenantId: string;
  slug: string;
  title: string;
  body: string;
  publishedAt: Date | null;
  tags: string[];
  status: ContentStatus;
}

export type PostDocument = IPost & Document;

const postSchema = new Schema<IPost>(
  {
    ...tenantIdSchemaDefinition,
    slug: { type: String, required: true, trim: true, lowercase: true },
    title: { type: String, required: true, trim: true },
    body: { type: String, required: true, default: '' },
    publishedAt: { type: Date, default: null },
    tags: { type: [String], default: [] },
    status: {
      type: String,
      enum: ['published', 'draft', 'archived'],
      required: true,
      default: 'draft',
    },
  },
  { timestamps: true }
);

applyTenantCompoundIndex(postSchema, 'slug', { unique: true });

export const Post =
  mongoose.models.Post ?? mongoose.model<IPost>('Post', postSchema);
