import { z } from 'zod';

export const createCategorySchema = z.object({
  name: z.string().max(50),
  userId: z.number(),
});

export type CreateCategoryDto = z.infer<typeof createCategorySchema>;
