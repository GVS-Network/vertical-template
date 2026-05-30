import mongoose, { Schema, type Document } from 'mongoose';
import {
  applyTenantCompoundIndex,
  tenantIdSchemaDefinition,
} from '../../../db/tenant-schema';
import type { ContentStatus } from './page';

export interface PostEventLinks {
  map?: string;
  facebook?: string;
}

export interface IPost {
  tenantId: string;
  slug: string;
  title: string;
  body: string;
  publishedAt: Date | null;
  tags: string[];
  status: ContentStatus;
  eventStart?: Date | null;
  eventEnd?: Date | null;
  eventLocation?: string;
  links?: PostEventLinks;
}

export type PostDocument = IPost & Document;

const postEventLinksSchema = new Schema<PostEventLinks>(
  {
    map: { type: String, trim: true },
    facebook: { type: String, trim: true },
  },
  { _id: false }
);

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
    eventStart: { type: Date, default: null },
    eventEnd: { type: Date, default: null },
    eventLocation: { type: String, trim: true },
    links: { type: postEventLinksSchema, default: undefined },
  },
  { timestamps: true }
);

applyTenantCompoundIndex(postSchema, 'slug', { unique: true });

export const Post =
  mongoose.models.Post ?? mongoose.model<IPost>('Post', postSchema);
