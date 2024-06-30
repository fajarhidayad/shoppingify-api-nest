import { z } from 'zod';

// Schema for create an item
export const createItemSchema = z.object({
  name: z.string().trim().max(50),
  note: z.string().max(255).nullish(),
  imageUrl: z.string().nullish(),
  categoryName: z.string(),
});

// this can be used for Body() in Controller or in Service for params type
export type CreateItemDto = z.infer<typeof createItemSchema>;
