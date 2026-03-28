import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const SESSION_COOKIE_NAME = 'fitmetrics_session';

/**
 * Proxy performs quick auth route redirects.
 * Full authorization checks are still done inside server actions/routes.
 */
export function proxy(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const { pathname } = request.nextUrl;

  const isProtectedProfileRoute = pathname.startsWith('/profile');
  const isAuthPage =
    pathname.startsWith('/login')
    || pathname.startsWith('/register')
    || pathname.startsWith('/verify-email')
    || pathname.startsWith('/forgot-password')
    || pathname.startsWith('/reset-password');

  if (isProtectedProfileRoute && !token) {
    return NextResponse.redirect(new URL('/register', request.url));
  }

  if (isAuthPage && token) {
    return NextResponse.redirect(new URL('/profile', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/profile/:path*', '/login', '/register', '/verify-email', '/forgot-password', '/reset-password'],
};
