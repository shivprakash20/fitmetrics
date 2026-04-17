import { z } from 'zod';

export const genderSchema = z.enum(['male', 'female', 'other', 'prefer_not_to_say']);

export const mobileNumberSchema = z
  .string()
  .trim()
  .regex(/^\+?[0-9]{8,15}$/, 'Enter a valid mobile number with 8-15 digits.');

export const mobileLoginSchema = z.object({
  email: z.string().email('Enter a valid email address.').trim().toLowerCase(),
  password: z.string().min(1, 'Password is required.'),
});

export const mobileRefreshSchema = z.object({
  refreshToken: z.string().trim().min(32, 'Refresh token is required.'),
});

export const mobileLogoutSchema = z.object({
  refreshToken: z.string().trim().min(32).optional(),
});

export type MobileLoginInput = z.infer<typeof mobileLoginSchema>;
export type MobileRefreshInput = z.infer<typeof mobileRefreshSchema>;
export type MobileLogoutInput = z.infer<typeof mobileLogoutSchema>;
