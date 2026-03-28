import 'server-only';
import nodemailer from 'nodemailer';
import { ApiError } from '@/lib/server/http/errors';

function getSmtpConfig() {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : undefined;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.SMTP_FROM;

  if (!host || !port || !user || !pass || !from) {
    return null;
  }

  return { host, port, user, pass, from };
}

/**
 * Sends OTP email using SMTP.
 * In production, keep these credentials in your deployment secret manager.
 */
export async function sendOtpEmail(params: {
  to: string;
  otpCode: string;
  purpose: 'verify_email' | 'reset_password';
}) {
  const smtp = getSmtpConfig();

  if (!smtp) {
    throw new ApiError(
      500,
      'SMTP_NOT_CONFIGURED',
      'SMTP is not configured. Set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, and SMTP_FROM.',
    );
  }

  const transporter = nodemailer.createTransport({
    host: smtp.host,
    port: smtp.port,
    secure: smtp.port === 465,
    auth: {
      user: smtp.user,
      pass: smtp.pass,
    },
  });

  const subject =
    params.purpose === 'verify_email'
      ? 'FitMetrics email verification OTP'
      : 'FitMetrics password reset OTP';

  const actionLine =
    params.purpose === 'verify_email'
      ? 'Use this OTP to verify your email address.'
      : 'Use this OTP to reset your password.';

  await transporter.sendMail({
    from: smtp.from,
    to: params.to,
    subject,
    text: `${actionLine}\n\nOTP: ${params.otpCode}\n\nThis OTP expires in 10 minutes.`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:560px;margin:auto;padding:20px">
        <h2 style="margin:0 0 12px;color:#111827">FitMetrics</h2>
        <p style="margin:0 0 12px;color:#374151">${actionLine}</p>
        <p style="font-size:28px;letter-spacing:8px;font-weight:700;margin:16px 0;color:#111827">${params.otpCode}</p>
        <p style="margin:0;color:#6b7280">This OTP expires in 10 minutes.</p>
      </div>
    `,
  });
}
