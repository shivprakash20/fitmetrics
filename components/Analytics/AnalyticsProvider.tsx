'use client';

import { useEffect } from 'react';
import { setUserId, setUserProperties } from '@/lib/analytics';

interface Props {
  userId: string | null;
}

/**
 * Sets GA4 user_id and user_properties when a user is logged in.
 * Mount this once in the root layout.
 */
export default function AnalyticsProvider({ userId }: Props) {
  useEffect(() => {
    if (userId) {
      setUserId(userId);
      setUserProperties({ is_authenticated: 'true' });
    } else {
      setUserProperties({ is_authenticated: 'false' });
    }
  }, [userId]);

  return null;
}
