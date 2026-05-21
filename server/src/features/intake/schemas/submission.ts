import mongoose, { Schema, type Document } from 'mongoose';
import {
  applyTenantCompoundIndex,
  tenantIdSchemaDefinition,
} from '../../../db/tenant-schema';

export interface ISubmission {
  tenantId: string;
  formSlug: string;
  data: Record<string, unknown>;
  createdAt: Date;
  ip?: string;
  processed: boolean;
}

export type SubmissionDocument = ISubmission & Document;

const submissionSchema = new Schema<ISubmission>(
  {
    ...tenantIdSchemaDefinition,
    formSlug: { type: String, required: true, lowercase: true, index: true },
    data: { type: Schema.Types.Mixed, required: true, default: {} },
    createdAt: { type: Date, required: true, default: () => new Date() },
    ip: { type: String },
    processed: { type: Boolean, required: true, default: false },
  },
  { timestamps: false }
);

applyTenantCompoundIndex(submissionSchema, 'formSlug');

export const Submission =
  mongoose.models.Submission ??
  mongoose.model<ISubmission>('Submission', submissionSchema);
