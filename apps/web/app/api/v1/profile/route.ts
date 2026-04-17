import { updateProfileSchema } from '@fitmetrics/contracts';
import { requireUser } from '@/lib/server/auth/guards';
import { getProfileByUserId, updateProfileByUserId } from '@/lib/server/dal/auth';
import { ApiError } from '@/lib/server/http/errors';
import { fail, ok } from '@/lib/server/http/response';

/**
 * Protected profile read endpoint.
 */
export async function GET(request: Request) {
  try {
    const user = await requireUser(request);
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
    const user = await requireUser(request);
    const parsed = updateProfileSchema.safeParse(await request.json());

    if (!parsed.success) {
      throw new ApiError(400, 'INVALID_PAYLOAD', parsed.error.issues[0]?.message ?? 'Invalid profile payload.');
    }

    const profile = await updateProfileByUserId(user.id, {
      firstName: parsed.data.firstName,
      middleName: parsed.data.middleName || null,
      lastName: parsed.data.lastName || null,
      gender: parsed.data.gender,
      mobile: parsed.data.mobile,
    });

    return ok(profile);
  } catch (error) {
    return fail(error);
  }
}
