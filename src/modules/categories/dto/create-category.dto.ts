import { z } from 'zod';

export const createCategorySchema = z.object({
  name: z.string().trim().max(50),
});

export type CreateCategoryDto = z.infer<typeof createCategorySchema>;
