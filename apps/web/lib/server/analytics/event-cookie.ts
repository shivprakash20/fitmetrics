import 'server-only';
import { cookies } from 'next/headers';
import type { AuthMethod } from '@/lib/analytics';

export type AnalyticsEventPayload =
  | { name: 'sign_up';                params: { method: AuthMethod } }
  | { name: 'login';                  params: { method: AuthMethod } }
  | { name: 'logout' }
  | { name: 'profile_updated' }
  | { name: 'contact_form_submitted'; params: { topic: string } }
  | { name: 'form_error';             params: { form_name: string; error_message: string } };

/**
 * Queues an analytics event to be fired client-side after the next page load.
 * Uses a short-lived non-httpOnly cookie so EventFlusher can read and clear it.
 * Call this immediately before redirect() in a Server Action or Route Handler.
 */
export async function queueAnalyticsEvent(event: AnalyticsEventPayload): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set('analytics_event', JSON.stringify(event), {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60, // auto-expire after 60s as safety net
  });
}
