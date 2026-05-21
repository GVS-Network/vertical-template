import { z } from 'zod';

export const productAttributesSchema = z.object({
  allergens: z.array(z.string()).optional(),
  spiceLevel: z.enum(['mild', 'medium', 'hot']).optional(),
  dietaryTags: z.array(z.string()).optional(),
});

export type ProductAttributes = z.infer<typeof productAttributesSchema>;
