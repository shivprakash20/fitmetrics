import 'server-only';
import { createHmac, randomInt } from 'node:crypto';
import { OTP_EXPIRY_MINUTES } from '@/lib/server/auth/constants';
import { ApiError } from '@/lib/server/http/errors';

function getOtpSecret(): string {
  const secret = process.env.AUTH_OTP_SECRET;
  if (!secret || secret.trim().length < 16) {
    throw new ApiError(
      500,
      'OTP_SECRET_MISSING',
      'AUTH_OTP_SECRET is missing or too short. Set it in your environment.',
    );
  }
  return secret;
}

export function generateOtpCode(): string {
  return String(randomInt(0, 1_000_000)).padStart(6, '0');
}

export function hashOtpCode(otpCode: string): string {
  return createHmac('sha256', getOtpSecret()).update(otpCode).digest('hex');
}

export function getOtpExpiryDate(): Date {
  return new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);
}
