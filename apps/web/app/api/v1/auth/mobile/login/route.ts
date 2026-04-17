import { mobileLoginSchema } from '@fitmetrics/contracts';
import { findUserByEmail } from '@/lib/server/dal/auth';
import { verifyPassword } from '@/lib/server/auth/password';
import { issueMobileTokenPair } from '@/lib/server/auth/mobile-tokens';
import { ApiError } from '@/lib/server/http/errors';
import { fail, ok } from '@/lib/server/http/response';

export async function POST(request: Request) {
  try {
    const payload = mobileLoginSchema.safeParse(await request.json());

    if (!payload.success) {
      throw new ApiError(400, 'INVALID_PAYLOAD', payload.error.issues[0]?.message ?? 'Invalid login payload.');
    }

    const user = await findUserByEmail(payload.data.email);

    if (!user || !user.passwordHash) {
      throw new ApiError(401, 'INVALID_CREDENTIALS', 'Invalid email or password.');
    }

    const isValidPassword = await verifyPassword(payload.data.password, user.passwordHash);
    if (!isValidPassword) {
      throw new ApiError(401, 'INVALID_CREDENTIALS', 'Invalid email or password.');
    }

    if (!user.emailVerifiedAt) {
      throw new ApiError(403, 'EMAIL_NOT_VERIFIED', 'Please verify your email before signing in.');
    }

    const tokens = await issueMobileTokenPair(user.id);

    return ok({
      ...tokens,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        emailVerifiedAt: user.emailVerifiedAt,
      },
    });
  } catch (error) {
    return fail(error);
  }
}
