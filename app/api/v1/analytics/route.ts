import { validateAnalyticsEvent } from '@/lib/server/analytics/events';
import { fail, ok } from '@/lib/server/http/response';

/**
 * Event intake endpoint.
 * Later this will forward events to PostHog/Segment and persist high-value events.
 */
export async function POST(request: Request) {
  try {
    const payload = validateAnalyticsEvent(await request.json());

    return ok(
      {
        accepted: true,
        event: payload.event,
        receivedAt: new Date().toISOString(),
      },
      { status: 202 },
    );
  } catch (error) {
    return fail(error);
  }
}
