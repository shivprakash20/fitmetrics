import { randomBytes } from 'node:crypto';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { buildGoogleAuthUrl } from '@/lib/server/oauth/google';

export async function GET(req: NextRequest) {
  const next = req.nextUrl.searchParams.get('next') ?? '';
  const csrf = randomBytes(16).toString('hex');
  const state = Buffer.from(JSON.stringify({ csrf, next })).toString('base64url');

  const cookieStore = await cookies();
  cookieStore.set('oauth_state_google', csrf, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 10, // 10 minutes
  });

  return NextResponse.redirect(buildGoogleAuthUrl(state));
}
