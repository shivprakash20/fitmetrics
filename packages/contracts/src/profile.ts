import { z } from 'zod';
import { genderSchema, mobileNumberSchema } from './auth';

export const updateProfileSchema = z.object({
  firstName: z.string().trim().min(2, 'First name must be at least 2 characters.'),
  middleName: z.string().trim().optional(),
  lastName: z.string().trim().min(2, 'Last name must be at least 2 characters.'),
  gender: genderSchema,
  mobile: mobileNumberSchema,
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
