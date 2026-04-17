import { mobileRefreshSchema } from '@fitmetrics/contracts';
import { rotateMobileRefreshToken } from '@/lib/server/auth/mobile-tokens';
import { ApiError } from '@/lib/server/http/errors';
import { fail, ok } from '@/lib/server/http/response';

export async function POST(request: Request) {
  try {
    const payload = mobileRefreshSchema.safeParse(await request.json());

    if (!payload.success) {
      throw new ApiError(400, 'INVALID_PAYLOAD', payload.error.issues[0]?.message ?? 'Invalid refresh payload.');
    }

    const refreshed = await rotateMobileRefreshToken(payload.data.refreshToken);

    if (!refreshed) {
      throw new ApiError(401, 'INVALID_REFRESH_TOKEN', 'Refresh token is invalid or expired.');
    }

    return ok(refreshed);
  } catch (error) {
    return fail(error);
  }
}
