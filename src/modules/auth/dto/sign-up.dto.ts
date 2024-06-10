import { z } from 'zod';

// Schema for sign in
export const signUpSchema = z.object({
  name: z.string().max(100),
  email: z.string().email(),
  password: z.string().min(6).max(32),
});

// this can be used for Body() in Controller or in Service for params type
export type SignUpDto = z.infer<typeof signUpSchema>;
