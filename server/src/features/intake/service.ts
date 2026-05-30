import type { Request } from 'express';
import mongoose, { type HydratedDocument } from 'mongoose';

import { scoped, scopedForTenant } from '../../db/scoped';
import { createError } from '../../middleware/errorHandler';
import type { SiteConfig } from '../../types/site-config';
import { notifyIntakeSubmission } from './notify-submission';
import {
  FormDefinition,
  type FormFieldDefinition,
  type IFormDefinition,
} from './schemas/form-definition';
import { Submission, type ISubmission } from './schemas/submission';

export async function getFormBySlug(
  tenantId: string,
  slug: string
): Promise<IFormDefinition | null> {
  const forms = scopedForTenant(FormDefinition, tenantId);
  const doc = (await forms.findOne({
    slug: slug.toLowerCase(),
  })) as HydratedDocument<IFormDefinition> | null;
  return doc ? doc.toObject() : null;
}

function validateSubmissionData(
  fields: FormFieldDefinition[],
  data: Record<string, unknown>
): void {
  for (const field of fields) {
    const value = data[field.name];
    if (field.required) {
      if (value === undefined || value === null || value === '') {
        throw createError(`Field "${field.name}" is required`, 400);
      }
    }
    if (field.type === 'email' && typeof value === 'string' && value) {
      const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      if (!ok) {
        throw createError(`Field "${field.name}" must be a valid email`, 400);
      }
    }
    if (field.type === 'select' && field.options?.length && value) {
      if (!field.options.includes(String(value))) {
        throw createError(`Field "${field.name}" has an invalid option`, 400);
      }
    }
  }
}

export async function createSubmission(
  siteConfig: SiteConfig,
  formSlug: string,
  data: Record<string, unknown>,
  ip?: string
): Promise<ISubmission> {
  const tenantId = siteConfig.tenantId;
  const form = await getFormBySlug(tenantId, formSlug);
  if (!form) {
    throw createError('Form not found', 404);
  }

  validateSubmissionData(form.fields, data);

  const submissions = scopedForTenant(Submission, tenantId);
  const doc = await submissions.create({
    formSlug: formSlug.toLowerCase(),
    data,
    createdAt: new Date(),
    ip,
    processed: false,
  });

  const submission = doc.toObject() as ISubmission;
  await notifyIntakeSubmission(siteConfig, form, submission);

  return submission;
}

export type SubmissionListFilter = {
  page: number;
  limit: number;
  processed?: boolean;
  formSlug?: string;
};

export type PaginatedSubmissions = {
  items: ISubmission[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export async function listSubmissions(
  req: Request,
  filter: SubmissionListFilter
): Promise<PaginatedSubmissions> {
  const submissions = scoped(Submission, req);
  const query: Record<string, unknown> = {};

  if (filter.processed !== undefined) {
    query.processed = filter.processed;
  }
  if (filter.formSlug) {
    query.formSlug = filter.formSlug.toLowerCase();
  }

  const skip = (filter.page - 1) * filter.limit;
  const docs = (await submissions
    .find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(filter.limit)) as HydratedDocument<ISubmission>[];
  const total = await submissions.countDocuments(query);

  return {
    items: docs.map((doc) => doc.toObject() as ISubmission),
    page: filter.page,
    limit: filter.limit,
    total,
    totalPages: Math.max(1, Math.ceil(total / filter.limit)),
  };
}

export async function markSubmissionProcessed(
  req: Request,
  id: string,
  processed: boolean
): Promise<ISubmission | null> {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return null;
  }

  const submissions = scoped(Submission, req);
  const existing = (await submissions.findById(id)) as HydratedDocument<ISubmission> | null;
  if (!existing) {
    return null;
  }

  await submissions.updateOne({ _id: id }, { processed });
  const doc = (await submissions.findById(id)) as HydratedDocument<ISubmission> | null;
  return doc ? (doc.toObject() as ISubmission) : null;
}
