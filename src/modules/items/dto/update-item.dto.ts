import { z } from 'zod';

// Schema for create an item
export const updateItemSchema = z.object({
  name: z.string().trim().max(50),
  note: z.string().max(255).nullish(),
  imageUrl: z.string().nullish(),
  categoryId: z.number(),
  userId: z.number(),
});

// this can be used for Body() in Controller or in Service for params type
export type UpdateItemDto = z.infer<typeof updateItemSchema>;
