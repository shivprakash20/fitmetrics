import 'server-only';
import { ApiError } from '@/lib/server/http/errors';
import { getCurrentUser } from '@/lib/server/auth/session';

/**
 * Guard helper for Route Handlers and Server Actions.
 * Always checks auth server-side instead of trusting client input.
 */
export async function requireUser() {
  const user = await getCurrentUser();

  if (!user) {
    throw new ApiError(401, 'UNAUTHORIZED', 'Login is required to access this resource.');
  }

  return user;
}
