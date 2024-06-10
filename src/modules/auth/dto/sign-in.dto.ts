import { z } from 'zod';

// Schema for sign in
export const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(32),
});

// this can be used for Body() in Controller or in Service for params type
export type SignInDto = z.infer<typeof signInSchema>;
