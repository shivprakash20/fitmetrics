import { serverEnv } from '@/lib/server/config/env';
import { ok } from '@/lib/server/http/response';

/**
 * Service health endpoint for uptime checks and quick debugging.
 */
export async function GET() {
  return ok({
    status: 'ok',
    environment: serverEnv.nodeEnv,
    version: serverEnv.appVersion,
    timestamp: new Date().toISOString(),
  });
}
