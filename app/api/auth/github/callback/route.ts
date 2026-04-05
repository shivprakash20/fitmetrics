import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { exchangeGitHubCode } from '@/lib/server/oauth/github';
import { upsertOAuthUser } from '@/lib/server/dal/oauth';
import { createSession } from '@/lib/server/auth/session';
import { redirectWithFlash } from '@/lib/server/oauth/flash';

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
    return redirectWithFlash(req, '/login', 'error', 'GitHub sign-in failed. Please try again.');
  }

  let csrf = '';
  let next = '/profile';
  try {
    const decoded = JSON.parse(Buffer.from(stateParam, 'base64url').toString());
    csrf = decoded.csrf ?? '';
    next = sanitizeNext(decoded.next ?? '');
  } catch {
    return redirectWithFlash(req, '/login', 'error', 'GitHub sign-in failed. Please try again.');
  }

  const cookieStore = await cookies();
  const storedCsrf = cookieStore.get('oauth_state_github')?.value;
  cookieStore.delete('oauth_state_github');

  if (!storedCsrf || storedCsrf !== csrf) {
    return redirectWithFlash(req, '/login', 'error', 'GitHub sign-in failed. Please try again.');
  }

  try {
    const profile = await exchangeGitHubCode(code);

    if (!profile.email) {
      return redirectWithFlash(
        req,
        '/login',
        'error',
        'No email found on your GitHub account. Please make your email public or add a verified email in GitHub settings.',
      );
    }

    const nameParts = (profile.name ?? profile.login).split(' ');
    const firstName = nameParts[0] ?? 'User';
    const lastName = nameParts.slice(1).join(' ') || null;

    const userId = await upsertOAuthUser({
      provider: 'github',
      providerId: String(profile.id),
      email: profile.email,
      firstName,
      lastName,
    });

    await createSession(userId);
    return NextResponse.redirect(new URL(next, req.url));
  } catch (err) {
    console.error('[GitHub OAuth callback]', err);
    return redirectWithFlash(req, '/login', 'error', 'GitHub sign-in failed. Please try again.');
  }
}
