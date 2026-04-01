'use server';

import { OtpPurpose } from '@prisma/client';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import {
  createOtpCode,
  createUserRegistration,
  findUserByEmail,
  findUserByMobile,
  getProfileByUserId,
  isUniqueViolation,
  markUserEmailVerified,
  updateUserPassword,
  updatePendingUser,
  updateProfileByUserId,
  consumeOtpCode,
} from '@/lib/server/dal/auth';
import { createSession, clearSession, getCurrentUser } from '@/lib/server/auth/session';
import { generateOtpCode, getOtpExpiryDate, hashOtpCode } from '@/lib/server/auth/otp';
import { hashPassword, verifyPassword } from '@/lib/server/auth/password';
import { sendOtpEmail } from '@/lib/server/email/otp-email';

const registerSchema = z.object({
  firstName: z.string().trim().min(2, 'First name must be at least 2 characters.'),
  middleName: z.string().trim().optional(),
  lastName: z.string().trim().min(2, 'Last name must be at least 2 characters.'),
  gender: z.enum(['male', 'female', 'other', 'prefer_not_to_say']),
  mobile: z
    .string()
    .trim()
    .regex(/^\+?[0-9]{8,15}$/, 'Enter a valid mobile number with 8-15 digits.'),
  email: z.string().email('Enter a valid email address.').trim().toLowerCase(),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters.')
    .regex(/[A-Z]/, 'Password must include at least one uppercase letter.')
    .regex(/[a-z]/, 'Password must include at least one lowercase letter.')
    .regex(/[0-9]/, 'Password must include at least one number.')
    .regex(/[^a-zA-Z0-9]/, 'Password must include at least one special character.'),
});

const loginSchema = z.object({
  email: z.string().email('Enter a valid email address.').trim().toLowerCase(),
  password: z.string().min(1, 'Password is required.'),
});

const otpSchema = z.object({
  email: z.string().email('Enter a valid email address.').trim().toLowerCase(),
  otp: z.string().trim().regex(/^[0-9]{6}$/, 'OTP must be 6 digits.'),
});

const forgotSchema = z.object({
  email: z.string().email('Enter a valid email address.').trim().toLowerCase(),
});

const resetPasswordSchema = z
  .object({
    email: z.string().email('Enter a valid email address.').trim().toLowerCase(),
    otp: z.string().trim().regex(/^[0-9]{6}$/, 'OTP must be 6 digits.'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters.')
      .regex(/[A-Z]/, 'Password must include at least one uppercase letter.')
      .regex(/[a-z]/, 'Password must include at least one lowercase letter.')
      .regex(/[0-9]/, 'Password must include at least one number.')
      .regex(/[^a-zA-Z0-9]/, 'Password must include at least one special character.'),
    confirmPassword: z.string(),
  })
  .refine((value) => value.password === value.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Password and confirm password must match.',
  });

const updateProfileSchema = z.object({
  firstName: z.string().trim().min(2, 'First name must be at least 2 characters.'),
  middleName: z.string().trim().optional(),
  lastName: z.string().trim().min(2, 'Last name must be at least 2 characters.'),
  gender: z.enum(['male', 'female', 'other', 'prefer_not_to_say']),
  mobile: z
    .string()
    .trim()
    .regex(/^\+?[0-9]{8,15}$/, 'Enter a valid mobile number with 8-15 digits.'),
});

function getFirstErrorMessage(issues: z.ZodIssue[]): string {
  return issues[0]?.message ?? 'Please check your form details.';
}

function buildUrl(pathname: string, params: Record<string, string | undefined>): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value && value.trim().length > 0) {
      search.set(key, value);
    }
  }
  const query = search.toString();
  return query ? `${pathname}?${query}` : pathname;
}

function sanitizeNextPath(value: string): string | undefined {
  const next = value.trim();
  if (!next.startsWith('/') || next.startsWith('//')) {
    return undefined;
  }

  const disallowedAuthRoutes = ['/login', '/register', '/verify-email', '/forgot-password', '/reset-password'];
  const isAuthRoute = disallowedAuthRoutes.some(route => next === route || next.startsWith(`${route}?`));
  if (isAuthRoute) {
    return undefined;
  }

  return next;
}

function sanitizeLogoutReturnPath(value: string): string | undefined {
  const from = value.trim();
  if (!from.startsWith('/') || from.startsWith('//')) {
    return undefined;
  }

  if (from.startsWith('/calculator/')) {
    return from;
  }

  const allowedStaticRoutes = new Set([
    '/',
    '/about',
    '/contact',
    '/login',
    '/register',
    '/forgot-password',
    '/reset-password',
    '/verify-email',
  ]);

  return allowedStaticRoutes.has(from) ? from : undefined;
}

async function createAndSendOtp(params: {
  userId: string;
  email: string;
  purpose: OtpPurpose;
}) {
  const otpCode = generateOtpCode();
  await createOtpCode({
    userId: params.userId,
    purpose: params.purpose,
    codeHash: hashOtpCode(otpCode),
    expiresAt: getOtpExpiryDate(),
  });

  await sendOtpEmail({
    to: params.email,
    otpCode,
    purpose: params.purpose === OtpPurpose.VERIFY_EMAIL ? 'verify_email' : 'reset_password',
  });
}

export async function registerAction(formData: FormData) {
  const next = sanitizeNextPath(String(formData.get('next') ?? ''));
  const raw = {
    firstName: String(formData.get('firstName') ?? ''),
    middleName: String(formData.get('middleName') ?? ''),
    lastName: String(formData.get('lastName') ?? ''),
    gender: String(formData.get('gender') ?? ''),
    mobile: String(formData.get('mobile') ?? ''),
    email: String(formData.get('email') ?? ''),
    password: String(formData.get('password') ?? ''),
  };

  const parsed = registerSchema.safeParse(raw);
  if (!parsed.success) {
    redirect(buildUrl('/register', { error: getFirstErrorMessage(parsed.error.issues), email: raw.email, next }));
  }

  const input = parsed.data;

  const existingByMobile = await findUserByMobile(input.mobile);
  if (existingByMobile && existingByMobile.email !== input.email) {
    redirect(buildUrl('/register', { error: 'Mobile number is already registered.', email: input.email, next }));
  }

  const passwordHash = await hashPassword(input.password);
  const existingByEmail = await findUserByEmail(input.email);

  if (existingByEmail && existingByEmail.emailVerifiedAt) {
    redirect(buildUrl('/login', { error: 'Account already exists. Please sign in.', email: input.email, next }));
  }

  const registrationPayload = {
    email: input.email,
    passwordHash,
    firstName: input.firstName,
    middleName: input.middleName || undefined,
    lastName: input.lastName,
    gender: input.gender,
    mobile: input.mobile,
  } as const;

  let userId: string;

  try {
    if (existingByEmail) {
      const updated = await updatePendingUser(existingByEmail.id, registrationPayload);
      userId = updated.id;
    } else {
      const created = await createUserRegistration(registrationPayload);
      userId = created.id;
    }
  } catch (error) {
    if (isUniqueViolation(error, 'mobile')) {
      redirect(buildUrl('/register', { error: 'Mobile number is already in use.', email: input.email, next }));
    }
    redirect(buildUrl('/register', { error: 'Could not create account. Please try again.', email: input.email, next }));
  }

  await createAndSendOtp({ userId, email: input.email, purpose: OtpPurpose.VERIFY_EMAIL });

  redirect(
    buildUrl('/verify-email', {
      email: input.email,
      message: 'OTP sent to your email. Please verify to complete registration.',
      next,
    }),
  );
}

export async function loginAction(formData: FormData) {
  const next = sanitizeNextPath(String(formData.get('next') ?? ''));
  const raw = {
    email: String(formData.get('email') ?? ''),
    password: String(formData.get('password') ?? ''),
  };

  const parsed = loginSchema.safeParse(raw);
  if (!parsed.success) {
    redirect(buildUrl('/login', { error: getFirstErrorMessage(parsed.error.issues), email: raw.email, next }));
  }

  const input = parsed.data;
  const user = await findUserByEmail(input.email);

  if (!user) {
    redirect(
      buildUrl('/register', {
        email: input.email,
        message: 'No user found with this email. Please register first.',
        next,
      }),
    );
  }

  const isValidPassword = await verifyPassword(input.password, user.passwordHash);
  if (!isValidPassword) {
    redirect(buildUrl('/login', { error: 'Invalid email or password.', email: input.email, next }));
  }

  if (!user.emailVerifiedAt) {
    await createAndSendOtp({
      userId: user.id,
      email: user.email,
      purpose: OtpPurpose.VERIFY_EMAIL,
    });

    redirect(
      buildUrl('/verify-email', {
        email: user.email,
        message: 'Your email is not verified yet. A new OTP has been sent.',
        next,
      }),
    );
  }

  await createSession(user.id);
  redirect(next ?? '/profile');
}

export async function verifyEmailOtpAction(formData: FormData) {
  const next = sanitizeNextPath(String(formData.get('next') ?? ''));
  const raw = {
    email: String(formData.get('email') ?? ''),
    otp: String(formData.get('otp') ?? ''),
  };

  const parsed = otpSchema.safeParse(raw);
  if (!parsed.success) {
    redirect(buildUrl('/verify-email', { error: getFirstErrorMessage(parsed.error.issues), email: raw.email, next }));
  }

  const input = parsed.data;
  const user = await findUserByEmail(input.email);

  if (!user) {
    redirect(buildUrl('/register', { email: input.email, error: 'No account found. Please register.' }));
  }

  const consumed = await consumeOtpCode({
    userId: user.id,
    purpose: OtpPurpose.VERIFY_EMAIL,
    codeHash: hashOtpCode(input.otp),
  });

  if (!consumed) {
    redirect(buildUrl('/verify-email', { email: input.email, error: 'Invalid or expired OTP.', next }));
  }

  if (!user.emailVerifiedAt) {
    await markUserEmailVerified(user.id);
  }

  await createSession(user.id);
  redirect(next ?? '/profile');
}

export async function resendVerificationOtpAction(formData: FormData) {
  const next = sanitizeNextPath(String(formData.get('next') ?? ''));
  const email = String(formData.get('email') ?? '').trim().toLowerCase();
  if (!email) {
    redirect(buildUrl('/verify-email', { error: 'Email is required to resend OTP.', next }));
  }

  const user = await findUserByEmail(email);
  if (!user) {
    redirect(buildUrl('/register', { email, error: 'No account found. Please register.' }));
  }

  await createAndSendOtp({
    userId: user.id,
    email: user.email,
    purpose: OtpPurpose.VERIFY_EMAIL,
  });

  redirect(buildUrl('/verify-email', { email, message: 'A new OTP has been sent to your email.', next }));
}

export async function forgotPasswordAction(formData: FormData) {
  const raw = {
    email: String(formData.get('email') ?? ''),
  };

  const parsed = forgotSchema.safeParse(raw);
  if (!parsed.success) {
    redirect(buildUrl('/forgot-password', { error: getFirstErrorMessage(parsed.error.issues) }));
  }

  const email = parsed.data.email;
  const user = await findUserByEmail(email);

  if (user) {
    await createAndSendOtp({
      userId: user.id,
      email: user.email,
      purpose: OtpPurpose.RESET_PASSWORD,
    });
  }

  redirect(
    buildUrl('/reset-password', {
      email,
      message: 'If your account exists, a password reset OTP has been sent to your email.',
    }),
  );
}

export async function resetPasswordAction(formData: FormData) {
  const raw = {
    email: String(formData.get('email') ?? ''),
    otp: String(formData.get('otp') ?? ''),
    password: String(formData.get('password') ?? ''),
    confirmPassword: String(formData.get('confirmPassword') ?? ''),
  };

  const parsed = resetPasswordSchema.safeParse(raw);
  if (!parsed.success) {
    redirect(buildUrl('/reset-password', { error: getFirstErrorMessage(parsed.error.issues), email: raw.email }));
  }

  const input = parsed.data;
  const user = await findUserByEmail(input.email);
  if (!user) {
    redirect(
      buildUrl('/register', {
        email: input.email,
        error: 'No account found for this email. Please register first.',
      }),
    );
  }

  const consumed = await consumeOtpCode({
    userId: user.id,
    purpose: OtpPurpose.RESET_PASSWORD,
    codeHash: hashOtpCode(input.otp),
  });

  if (!consumed) {
    redirect(buildUrl('/reset-password', { email: input.email, error: 'Invalid or expired OTP.' }));
  }

  const nextPasswordHash = await hashPassword(input.password);
  await updateUserPassword(user.id, nextPasswordHash);

  if (!user.emailVerifiedAt) {
    await markUserEmailVerified(user.id);
  }

  await createSession(user.id);
  redirect('/profile');
}

export async function updateProfileAction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/register');
  }

  const raw = {
    firstName: String(formData.get('firstName') ?? ''),
    middleName: String(formData.get('middleName') ?? ''),
    lastName: String(formData.get('lastName') ?? ''),
    gender: String(formData.get('gender') ?? ''),
    mobile: String(formData.get('mobile') ?? ''),
  };

  const parsed = updateProfileSchema.safeParse(raw);
  if (!parsed.success) {
    redirect(buildUrl('/profile/settings', { error: getFirstErrorMessage(parsed.error.issues) }));
  }

  await updateProfileByUserId(user.id, {
    firstName: parsed.data.firstName,
    middleName: parsed.data.middleName || null,
    lastName: parsed.data.lastName,
    gender: parsed.data.gender,
    mobile: parsed.data.mobile,
  });

  revalidatePath('/profile');
  redirect(buildUrl('/profile/settings', { message: 'Profile updated successfully.' }));
}

export async function logoutAction(formData: FormData) {
  const from = String(formData.get('from') ?? '');
  const redirectTo = sanitizeLogoutReturnPath(from) ?? '/';
  await clearSession();
  redirect(redirectTo);
}

export async function getProfileForPage() {
  const user = await getCurrentUser();
  if (!user) {
    return null;
  }
  return getProfileByUserId(user.id);
}
