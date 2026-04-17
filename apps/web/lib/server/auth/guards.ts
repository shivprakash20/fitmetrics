import 'server-only';
import { ApiError } from '@/lib/server/http/errors';
import { getCurrentUser } from '@/lib/server/auth/session';
import { getBearerTokenFromRequest, getUserFromMobileAccessToken } from '@/lib/server/auth/mobile-tokens';

/**
 * Guard helper for Route Handlers and Server Actions.
 * Always checks auth server-side instead of trusting client input.
 */
export async function requireUser(request?: Request) {
  const user = await getCurrentUser();

  if (user) {
    return user;
  }

  if (request) {
    const bearerToken = getBearerTokenFromRequest(request);

    if (bearerToken) {
      const mobileUser = await getUserFromMobileAccessToken(bearerToken);
      if (mobileUser) {
        return mobileUser;
      }
    }
  }

  throw new ApiError(401, 'UNAUTHORIZED', 'Login is required to access this resource.');
}
