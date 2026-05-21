import mongoose, { Schema, type Document } from 'mongoose';
import {
  applyTenantCompoundIndex,
  tenantIdSchemaDefinition,
} from '../../../db/tenant-schema';

export type FormFieldType =
  | 'text'
  | 'email'
  | 'textarea'
  | 'select'
  | 'checkbox';

export interface FormFieldDefinition {
  name: string;
  type: FormFieldType;
  required: boolean;
  options?: string[];
}

export interface IFormDefinition {
  tenantId: string;
  slug: string;
  title: string;
  fields: FormFieldDefinition[];
  submitButtonLabel: string;
}

export type FormDefinitionDocument = IFormDefinition & Document;

const formFieldSchema = new Schema<FormFieldDefinition>(
  {
    name: { type: String, required: true },
    type: {
      type: String,
      enum: ['text', 'email', 'textarea', 'select', 'checkbox'],
      required: true,
    },
    required: { type: Boolean, required: true, default: false },
    options: { type: [String] },
  },
  { _id: false }
);

const formDefinitionSchema = new Schema<IFormDefinition>(
  {
    ...tenantIdSchemaDefinition,
    slug: { type: String, required: true, trim: true, lowercase: true },
    title: { type: String, required: true, trim: true },
    fields: { type: [formFieldSchema], required: true, default: [] },
    submitButtonLabel: { type: String, required: true, default: 'Submit' },
  },
  { timestamps: true }
);

applyTenantCompoundIndex(formDefinitionSchema, 'slug', { unique: true });

export const FormDefinition =
  mongoose.models.FormDefinition ??
  mongoose.model<IFormDefinition>('FormDefinition', formDefinitionSchema);
