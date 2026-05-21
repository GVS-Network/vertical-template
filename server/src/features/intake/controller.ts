import { Request, Response } from 'express';
import { asyncHandler, createError } from '../../middleware/errorHandler';
import * as intakeService from './service';

function tenantId(req: Request): string {
  return req.siteConfig.tenantId;
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
      tenantId(req),
      req.params.slug,
      data,
      ip
    );

    res.status(201).json({ status: 'success', data: submission });
  }
);
