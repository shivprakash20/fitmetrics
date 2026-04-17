import { mobileLogoutSchema } from '@fitmetrics/contracts';
import { requireUser } from '@/lib/server/auth/guards';
import {
  revokeMobileRefreshToken,
  revokeMobileTokensForUser,
} from '@/lib/server/auth/mobile-tokens';
import { ApiError } from '@/lib/server/http/errors';
import { fail, ok } from '@/lib/server/http/response';

async function parseJsonSafe(request: Request): Promise<unknown> {
  try {
    return await request.json();
  } catch {
    return {};
  }
}

export async function POST(request: Request) {
  try {
    const payload = mobileLogoutSchema.safeParse(await parseJsonSafe(request));

    if (!payload.success) {
      throw new ApiError(400, 'INVALID_PAYLOAD', payload.error.issues[0]?.message ?? 'Invalid logout payload.');
    }

    let loggedOut = false;

    try {
      const user = await requireUser(request);
      await revokeMobileTokensForUser(user.id);
      loggedOut = true;
    } catch {
      // Ignore missing auth; refresh-token-only logout is still supported.
    }

    if (payload.data.refreshToken) {
      const revoked = await revokeMobileRefreshToken(payload.data.refreshToken);
      loggedOut = loggedOut || revoked;
    }

    if (!loggedOut) {
      throw new ApiError(401, 'UNAUTHORIZED', 'A valid token is required to logout.');
    }

    return ok({ loggedOut: true });
  } catch (error) {
    return fail(error);
  }
}
