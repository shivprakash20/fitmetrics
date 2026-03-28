import { z } from 'zod';
import { requireUser } from '@/lib/server/auth/guards';
import { getProfileByUserId, updateProfileByUserId } from '@/lib/server/dal/auth';
import { ApiError } from '@/lib/server/http/errors';
import { fail, ok } from '@/lib/server/http/response';

const updateProfileSchema = z.object({
  firstName: z.string().trim().min(2, 'First name must be at least 2 characters.'),
  middleName: z.string().trim().optional(),
  lastName: z.string().trim().min(2, 'Last name must be at least 2 characters.'),
  gender: z.enum(['male', 'female', 'other', 'prefer_not_to_say']),
  mobile: z
    .string()
    .trim()
    .regex(/^\+?[0-9]{8,15}$/, 'Enter a valid mobile number with 8-15 digits.'),
});

/**
 * Protected profile read endpoint.
 */
export async function GET() {
  try {
    const user = await requireUser();
    const profile = await getProfileByUserId(user.id);

    if (!profile) {
      throw new ApiError(404, 'PROFILE_NOT_FOUND', 'Profile was not found.');
    }

    return ok(profile);
  } catch (error) {
    return fail(error);
  }
}

/**
 * Protected profile update endpoint.
 */
export async function PUT(request: Request) {
  try {
    const user = await requireUser();
    const parsed = updateProfileSchema.safeParse(await request.json());

    if (!parsed.success) {
      throw new ApiError(400, 'INVALID_PAYLOAD', parsed.error.issues[0]?.message ?? 'Invalid profile payload.');
    }

    const profile = await updateProfileByUserId(user.id, {
      firstName: parsed.data.firstName,
      middleName: parsed.data.middleName || undefined,
      lastName: parsed.data.lastName,
      gender: parsed.data.gender,
      mobile: parsed.data.mobile,
    });

    return ok(profile);
  } catch (error) {
    return fail(error);
  }
}
