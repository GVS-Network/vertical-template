import { z } from 'zod';

import { createError } from '../../../middleware/errorHandler';

export const markSubmissionProcessedSchema = z
  .object({
    processed: z.boolean(),
  })
  .strict();

export type MarkSubmissionProcessedBody = z.output<
  typeof markSubmissionProcessedSchema
>;

export function parseBody<S extends z.ZodTypeAny>(
  schema: S,
  body: unknown
): z.output<S> {
  const result = schema.safeParse(body);
  if (!result.success) {
    const message = result.error.errors
      .map((issue) => {
        const path = issue.path.length ? issue.path.join('.') : 'body';
        return `${path}: ${issue.message}`;
      })
      .join('; ');
    throw createError(message, 400);
  }
  return result.data;
}
