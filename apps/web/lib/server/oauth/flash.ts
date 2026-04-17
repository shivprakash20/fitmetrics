import { NextRequest, NextResponse } from 'next/server';

type FlashType = 'error' | 'info';

export function redirectWithFlash(req: NextRequest, path: string, type: FlashType, message: string): NextResponse {
  const res = NextResponse.redirect(new URL(path, req.url));
  res.cookies.set('oauth_flash', JSON.stringify({ type, message }), {
    httpOnly: false, // must be readable by client JS
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60, // auto-expire after 60s as safety net
  });
  return res;
}
