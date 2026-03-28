import { normalizeError } from '@/lib/server/http/errors';

interface SuccessEnvelope<T> {
  success: true;
  data: T;
}

/**
 * Standard JSON success response for route handlers.
 */
export function ok<T>(data: T, init?: ResponseInit): Response {
  return Response.json({ success: true, data } as SuccessEnvelope<T>, init);
}

/**
 * Standard JSON error response for route handlers.
 */
export function fail(error: unknown): Response {
  const normalized = normalizeError(error);
  return Response.json(normalized.body, { status: normalized.statusCode });
}
