import { z } from 'zod';

export const productAttributesSchema = z.object({
  printSides: z.enum(['one', 'two']).optional(),
  garmentBlank: z.string().optional(),
  minQty: z.number().int().positive().optional(),
});

export type ProductAttributes = z.infer<typeof productAttributesSchema>;
