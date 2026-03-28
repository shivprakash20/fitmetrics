import 'server-only';
import { OtpPurpose, Prisma } from '@prisma/client';
import { prisma } from '@/lib/server/db/prisma';

export interface RegistrationInput {
  email: string;
  passwordHash: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  gender: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  mobile: string;
}

export async function findUserByEmail(email: string) {
  return prisma.user.findUnique({ where: { email } });
}

export async function findUserByMobile(mobile: string) {
  return prisma.user.findUnique({ where: { mobile } });
}

export async function createUserRegistration(data: RegistrationInput) {
  return prisma.user.create({
    data: {
      email: data.email,
      passwordHash: data.passwordHash,
      firstName: data.firstName,
      middleName: data.middleName,
      lastName: data.lastName,
      gender: data.gender,
      mobile: data.mobile,
    },
  });
}

export async function updatePendingUser(userId: string, data: RegistrationInput) {
  return prisma.user.update({
    where: { id: userId },
    data: {
      passwordHash: data.passwordHash,
      firstName: data.firstName,
      middleName: data.middleName,
      lastName: data.lastName,
      gender: data.gender,
      mobile: data.mobile,
    },
  });
}

export async function markUserEmailVerified(userId: string) {
  return prisma.user.update({
    where: { id: userId },
    data: { emailVerifiedAt: new Date() },
  });
}

export async function updateUserPassword(userId: string, passwordHash: string) {
  return prisma.user.update({
    where: { id: userId },
    data: { passwordHash },
  });
}

export async function createOtpCode(params: {
  userId: string;
  purpose: OtpPurpose;
  codeHash: string;
  expiresAt: Date;
}) {
  // Keep only one active OTP per purpose to simplify verification UX.
  await prisma.otpCode.deleteMany({
    where: {
      userId: params.userId,
      purpose: params.purpose,
      consumedAt: null,
    },
  });

  return prisma.otpCode.create({
    data: {
      userId: params.userId,
      purpose: params.purpose,
      codeHash: params.codeHash,
      expiresAt: params.expiresAt,
    },
  });
}

export async function consumeOtpCode(params: {
  userId: string;
  purpose: OtpPurpose;
  codeHash: string;
}) {
  const now = new Date();

  const otpRecord = await prisma.otpCode.findFirst({
    where: {
      userId: params.userId,
      purpose: params.purpose,
      codeHash: params.codeHash,
      consumedAt: null,
      expiresAt: { gt: now },
    },
    orderBy: { createdAt: 'desc' },
  });

  if (!otpRecord) {
    return null;
  }

  return prisma.otpCode.update({
    where: { id: otpRecord.id },
    data: { consumedAt: now },
  });
}

export async function getProfileByUserId(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      email: true,
      firstName: true,
      middleName: true,
      lastName: true,
      mobile: true,
      gender: true,
      emailVerifiedAt: true,
      createdAt: true,
    },
  });
}

export async function updateProfileByUserId(
  userId: string,
  data: {
    firstName: string;
    middleName?: string;
    lastName: string;
    gender: 'male' | 'female' | 'other' | 'prefer_not_to_say';
    mobile: string;
  },
) {
  return prisma.user.update({
    where: { id: userId },
    data: {
      firstName: data.firstName,
      middleName: data.middleName,
      lastName: data.lastName,
      gender: data.gender,
      mobile: data.mobile,
    },
  });
}

export function isUniqueViolation(error: unknown, fieldName: string): boolean {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError
    && error.code === 'P2002'
    && Array.isArray(error.meta?.target)
    && error.meta.target.includes(fieldName)
  );
}
