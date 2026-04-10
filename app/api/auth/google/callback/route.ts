import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { exchangeGoogleCode } from '@/lib/server/oauth/google';
import { upsertOAuthUser } from '@/lib/server/dal/oauth';
import { createSession } from '@/lib/server/auth/session';
import { redirectWithFlash } from '@/lib/server/oauth/flash';
import { queueAnalyticsEvent } from '@/lib/server/analytics/event-cookie';

function sanitizeNext(value: string): string {
  const next = value.trim();
  if (!next.startsWith('/') || next.startsWith('//')) return '/profile';
  const blocked = ['/login', '/register', '/verify-email', '/forgot-password', '/reset-password'];
  if (blocked.some(r => next === r || next.startsWith(`${r}?`))) return '/profile';
  return next;
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const code = searchParams.get('code');
  const stateParam = searchParams.get('state');

  if (!code || !stateParam) {
    return redirectWithFlash(req, '/login', 'error', 'Google sign-in failed. Please try again.');
  }

  let csrf = '';
  let next = '/profile';
  try {
    const decoded = JSON.parse(Buffer.from(stateParam, 'base64url').toString());
    csrf = decoded.csrf ?? '';
    next = sanitizeNext(decoded.next ?? '');
  } catch {
    return redirectWithFlash(req, '/login', 'error', 'Google sign-in failed. Please try again.');
  }

  const cookieStore = await cookies();
  const storedCsrf = cookieStore.get('oauth_state_google')?.value;
  cookieStore.delete('oauth_state_google');

  if (!storedCsrf || storedCsrf !== csrf) {
    return redirectWithFlash(req, '/login', 'error', 'Google sign-in failed. Please try again.');
  }

  try {
    const profile = await exchangeGoogleCode(code);

    if (!profile.email) {
      return redirectWithFlash(req, '/login', 'error', 'No email returned from Google. Please check your Google account settings.');
    }

    const nameParts = (profile.name ?? '').split(' ');
    const firstName = profile.given_name ?? nameParts[0] ?? 'User';
    const lastName = profile.family_name ?? (nameParts.slice(1).join(' ') || null);

    const { userId, isNewUser } = await upsertOAuthUser({
      provider: 'google',
      providerId: String(profile.sub),
      email: profile.email,
      firstName,
      lastName,
    });

    await createSession(userId);
    await queueAnalyticsEvent(isNewUser
      ? { name: 'sign_up', params: { method: 'google' } }
      : { name: 'login',   params: { method: 'google' } },
    );
    return NextResponse.redirect(new URL(next, req.url));
  } catch (err) {
    console.error('[Google OAuth callback]', err);
    return redirectWithFlash(req, '/login', 'error', 'Google sign-in failed. Please try again.');
  }
}
