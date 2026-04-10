'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { trackEvent } from '@/lib/analytics';
import type { AnalyticsEventPayload } from '@/lib/server/analytics/event-cookie';

/**
 * Reads the analytics_event cookie set by server actions,
 * fires the GA4 event, then immediately clears the cookie.
 * Mount once in the root layout.
 */
export default function EventFlusher() {
  const pathname = usePathname();

  useEffect(() => {
    const match = document.cookie.match(/(?:^|;\s*)analytics_event=([^;]+)/);
    if (!match) return;

    // Clear immediately so it fires exactly once
    document.cookie = 'analytics_event=; max-age=0; path=/';

    try {
      const event: AnalyticsEventPayload = JSON.parse(decodeURIComponent(match[1]));
      const params = 'params' in event ? event.params : undefined;
      trackEvent(event.name, params as Record<string, unknown> | undefined);
    } catch {
      // Malformed cookie — ignore
    }
  }, [pathname]);

  return null;
}
