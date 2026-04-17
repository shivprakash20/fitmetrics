import 'server-only';
import { createHash, randomBytes } from 'node:crypto';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/server/db/prisma';
import { SESSION_COOKIE_NAME, SESSION_TTL_DAYS } from '@/lib/server/auth/constants';

function hashSessionToken(token: string): string {
  const secret = process.env.AUTH_SESSION_SECRET ?? '';
  return createHash('sha256').update(`${token}:${secret}`).digest('hex');
}

function getSessionExpiryDate(): Date {
  return new Date(Date.now() + SESSION_TTL_DAYS * 24 * 60 * 60 * 1000);
}

async function setSessionCookie(rawToken: string, expiresAt: Date) {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, rawToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    expires: expiresAt,
  });
}

export async function createSession(userId: string): Promise<void> {
  const rawToken = randomBytes(32).toString('hex');
  const expiresAt = getSessionExpiryDate();
  const tokenHash = hashSessionToken(rawToken);

  await prisma.session.create({
    data: {
      userId,
      tokenHash,
      expiresAt,
    },
  });

  await setSessionCookie(rawToken, expiresAt);
}

export async function clearSession(): Promise<void> {
  const cookieStore = await cookies();
  const rawToken = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (rawToken) {
    const tokenHash = hashSessionToken(rawToken);
    await prisma.session.deleteMany({ where: { tokenHash } });
  }

  cookieStore.delete(SESSION_COOKIE_NAME);
}

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const rawToken = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!rawToken) {
    return null;
  }

  const tokenHash = hashSessionToken(rawToken);

  const session = await prisma.session.findUnique({
    where: { tokenHash },
    include: { user: true },
  });

  if (!session) {
    return null;
  }

  if (session.expiresAt.getTime() <= Date.now()) {
    await prisma.session.delete({ where: { tokenHash } });
    cookieStore.delete(SESSION_COOKIE_NAME);
    return null;
  }

  return session.user;
}
