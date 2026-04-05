import 'server-only';
import { prisma } from '@/lib/server/db/prisma';

export interface OAuthUserInput {
  provider: string;
  providerId: string;
  email: string;
  firstName: string;
  lastName: string | null;
}

/**
 * Upsert a user from an OAuth callback.
 *
 * Priority order:
 * 1. Existing OAuthAccount for this provider+providerId → return that user
 * 2. Existing User with the same email → link the OAuthAccount, return that user
 * 3. No match → create new User + OAuthAccount
 */
export async function upsertOAuthUser(input: OAuthUserInput): Promise<string> {
  const { provider, providerId, email, firstName, lastName } = input;

  // 1. Already connected
  const existing = await prisma.oAuthAccount.findUnique({
    where: { provider_providerId: { provider, providerId } },
    select: { userId: true },
  });

  if (existing) {
    return existing.userId;
  }

  // 2. Email already registered — link the OAuth account
  const userByEmail = await prisma.user.findUnique({
    where: { email },
    select: { id: true, emailVerifiedAt: true },
  });

  if (userByEmail) {
    await prisma.$transaction([
      // Mark email verified if not already (OAuth provider confirmed it)
      ...(!userByEmail.emailVerifiedAt
        ? [prisma.user.update({ where: { id: userByEmail.id }, data: { emailVerifiedAt: new Date() } })]
        : []),
      prisma.oAuthAccount.create({
        data: { userId: userByEmail.id, provider, providerId },
      }),
    ]);
    return userByEmail.id;
  }

  // 3. New user
  const user = await prisma.user.create({
    data: {
      email,
      firstName,
      lastName,
      emailVerifiedAt: new Date(),
      oauthAccounts: {
        create: { provider, providerId },
      },
    },
    select: { id: true },
  });

  return user.id;
}
