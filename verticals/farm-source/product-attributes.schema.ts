import { z } from 'zod';

export const productAttributesSchema = z.object({
  season: z.string().optional(),
  csaShare: z.boolean().optional(),
  originLot: z.string().optional(),
});

export type ProductAttributes = z.infer<typeof productAttributesSchema>;
