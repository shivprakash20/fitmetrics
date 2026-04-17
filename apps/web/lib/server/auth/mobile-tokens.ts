import 'server-only';
import { createHash, randomBytes } from 'node:crypto';
import { AuthTokenType, Prisma } from '@prisma/client';
import { prisma } from '@/lib/server/db/prisma';
import { MOBILE_ACCESS_TOKEN_TTL_MINUTES, MOBILE_REFRESH_TOKEN_TTL_DAYS } from '@/lib/server/auth/constants';

function getTokenSecret(): string {
  return process.env.AUTH_MOBILE_TOKEN_SECRET ?? process.env.AUTH_SESSION_SECRET ?? '';
}

function hashToken(rawToken: string): string {
  return createHash('sha256').update(`${rawToken}:${getTokenSecret()}`).digest('hex');
}

function getAccessExpiryDate() {
  return new Date(Date.now() + MOBILE_ACCESS_TOKEN_TTL_MINUTES * 60 * 1000);
}

function getRefreshExpiryDate() {
  return new Date(Date.now() + MOBILE_REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000);
}

function generateToken(size = 32) {
  return randomBytes(size).toString('hex');
}

async function issueTokenPairWithClient(db: Prisma.TransactionClient | typeof prisma, userId: string) {
  const accessToken = generateToken(32);
  const refreshToken = generateToken(48);

  const accessExpiresAt = getAccessExpiryDate();
  const refreshExpiresAt = getRefreshExpiryDate();

  await db.authToken.createMany({
    data: [
      {
        userId,
        type: AuthTokenType.mobile_access,
        tokenHash: hashToken(accessToken),
        expiresAt: accessExpiresAt,
      },
      {
        userId,
        type: AuthTokenType.mobile_refresh,
        tokenHash: hashToken(refreshToken),
        expiresAt: refreshExpiresAt,
      },
    ],
  });

  return {
    accessToken,
    refreshToken,
    tokenType: 'Bearer' as const,
    accessTokenExpiresAt: accessExpiresAt.toISOString(),
    refreshTokenExpiresAt: refreshExpiresAt.toISOString(),
    expiresIn: MOBILE_ACCESS_TOKEN_TTL_MINUTES * 60,
  };
}

export async function issueMobileTokenPair(userId: string) {
  return issueTokenPairWithClient(prisma, userId);
}

export function getBearerTokenFromRequest(request: Request): string | null {
  const authHeader = request.headers.get('authorization') ?? '';
  const [scheme, rawToken] = authHeader.split(' ');

  if (!scheme || !rawToken || scheme.toLowerCase() !== 'bearer') {
    return null;
  }

  return rawToken.trim().length > 0 ? rawToken.trim() : null;
}

export async function getUserFromMobileAccessToken(rawAccessToken: string) {
  const token = await prisma.authToken.findUnique({
    where: { tokenHash: hashToken(rawAccessToken) },
    include: { user: true },
  });

  if (!token) {
    return null;
  }

  if (token.type !== AuthTokenType.mobile_access || token.revokedAt || token.expiresAt.getTime() <= Date.now()) {
    return null;
  }

  return token.user;
}

export async function rotateMobileRefreshToken(rawRefreshToken: string) {
  const refreshTokenHash = hashToken(rawRefreshToken);

  return prisma.$transaction(async tx => {
    const currentRefreshToken = await tx.authToken.findUnique({
      where: { tokenHash: refreshTokenHash },
    });

    if (!currentRefreshToken) {
      return null;
    }

    if (
      currentRefreshToken.type !== AuthTokenType.mobile_refresh
      || currentRefreshToken.revokedAt
      || currentRefreshToken.expiresAt.getTime() <= Date.now()
    ) {
      return null;
    }

    const now = new Date();

    await tx.authToken.update({
      where: { id: currentRefreshToken.id },
      data: { revokedAt: now },
    });

    await tx.authToken.updateMany({
      where: {
        userId: currentRefreshToken.userId,
        type: AuthTokenType.mobile_access,
        revokedAt: null,
      },
      data: { revokedAt: now },
    });

    const tokenPair = await issueTokenPairWithClient(tx, currentRefreshToken.userId);

    const user = await tx.user.findUnique({
      where: { id: currentRefreshToken.userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        emailVerifiedAt: true,
      },
    });

    return {
      ...tokenPair,
      user,
    };
  });
}

export async function revokeMobileRefreshToken(rawRefreshToken: string) {
  const tokenHash = hashToken(rawRefreshToken);
  const token = await prisma.authToken.findUnique({ where: { tokenHash } });

  if (!token || token.type !== AuthTokenType.mobile_refresh || token.revokedAt) {
    return false;
  }

  await prisma.authToken.update({
    where: { id: token.id },
    data: { revokedAt: new Date() },
  });

  return true;
}

export async function revokeMobileTokensForUser(userId: string) {
  const now = new Date();

  await prisma.authToken.updateMany({
    where: {
      userId,
      revokedAt: null,
      type: {
        in: [AuthTokenType.mobile_access, AuthTokenType.mobile_refresh],
      },
    },
    data: { revokedAt: now },
  });
}
