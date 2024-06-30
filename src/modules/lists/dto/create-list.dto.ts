import { z } from 'zod';

export const createListSchema = z.object({
  name: z.string().trim().max(50),
});

export type CreateListDto = z.infer<typeof createListSchema>;
