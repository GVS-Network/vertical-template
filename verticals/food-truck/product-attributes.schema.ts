import { z } from 'zod';

export const productAttributesSchema = z.object({
  dailyAvailable: z.boolean().optional(),
  locationToday: z.string().optional(),
});

export type ProductAttributes = z.infer<typeof productAttributesSchema>;
