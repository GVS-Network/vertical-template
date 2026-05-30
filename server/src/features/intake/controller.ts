import { Request, Response } from 'express';
import { asyncHandler, createError } from '../../middleware/errorHandler';
import * as intakeService from './service';
import {
  markSubmissionProcessedSchema,
  parseBody,
} from './schemas/validators';

function tenantId(req: Request): string {
  return req.siteConfig.tenantId;
}

function parsePage(value: unknown): number {
  const parsed = parseInt(String(value ?? '1'), 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
}

function parseLimit(value: unknown): number {
  const parsed = parseInt(String(value ?? '20'), 10);
  if (!Number.isFinite(parsed) || parsed < 1) {
    return 20;
  }
  return Math.min(parsed, 100);
}

function parseProcessedFilter(value: unknown): boolean | undefined {
  if (value === 'true') {
    return true;
  }
  if (value === 'false') {
    return false;
  }
  return undefined;
}

export const getFormBySlug = asyncHandler(async (req: Request, res: Response) => {
  const form = await intakeService.getFormBySlug(tenantId(req), req.params.slug);
  if (!form) {
    throw createError('Form not found', 404);
  }
  res.json({ status: 'success', data: form });
});

export const createSubmission = asyncHandler(
  async (req: Request, res: Response) => {
    const data =
      req.body?.data && typeof req.body.data === 'object'
        ? (req.body.data as Record<string, unknown>)
        : req.body;

    if (!data || typeof data !== 'object' || Array.isArray(data)) {
      throw createError('Submission body must be an object', 400);
    }

    const ip =
      (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
      req.socket.remoteAddress;

    const submission = await intakeService.createSubmission(
      req.siteConfig,
      req.params.slug,
      data,
      ip
    );

    res.status(201).json({ status: 'success', data: submission });
  }
);

export const listSubmissions = asyncHandler(async (req: Request, res: Response) => {
  const page = parsePage(req.query.page);
  const limit = parseLimit(req.query.limit);
  const processed = parseProcessedFilter(req.query.processed);
  const formSlug =
    typeof req.query.formSlug === 'string' ? req.query.formSlug : undefined;

  const result = await intakeService.listSubmissions(req, {
    page,
    limit,
    processed,
    formSlug,
  });

  res.json({
    status: 'success',
    data: result.items,
    meta: {
      page: result.page,
      limit: result.limit,
      total: result.total,
      totalPages: result.totalPages,
    },
  });
});

export const markSubmissionProcessed = asyncHandler(
  async (req: Request, res: Response) => {
    const body = parseBody(markSubmissionProcessedSchema, req.body);
    const submission = await intakeService.markSubmissionProcessed(
      req,
      req.params.id,
      body.processed
    );
    if (!submission) {
      throw createError('Submission not found', 404);
    }
    res.json({ status: 'success', data: submission });
  }
);
