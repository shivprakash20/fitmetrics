# Auth + OTP Setup Guide (Next.js Backend)

This implementation includes:

- Email/password registration
- Email OTP verification
- Login and logout
- Forgot password + reset password via OTP
- Profile page with update flow
- Redirect to registration when a user does not exist

## 1. Environment variables

Set environment variables in `apps/web/.env` (or copy your root `.env` there) and fill the values:

- `POSTGRES_PRISMA_URL`
- `AUTH_SESSION_SECRET`
- `AUTH_MOBILE_TOKEN_SECRET` (recommended, falls back to `AUTH_SESSION_SECRET`)
- `AUTH_OTP_SECRET`
- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USER`
- `SMTP_PASS`
- `SMTP_FROM`

## 2. Database setup

Run Prisma migration once your DB credentials are ready:

```bash
cd apps/web
npx prisma migrate dev --name init_auth
```

## 3. Email OTP provider recommendation

Market-standard options:

1. SMTP from transactional email provider (Amazon SES, SendGrid, Mailgun)
2. API-first providers (Resend, Postmark) if you prefer SDK/webhook workflows

Current implementation uses SMTP via Nodemailer for portability.

## 4. Security notes

- OTPs are stored hashed in DB, not plain text.
- Session token is random and stored hashed in DB.
- Mobile access and refresh tokens are random, stored hashed in DB, and can be revoked.
- Session cookie is `httpOnly`, `sameSite=lax`, and `secure` in production.
- Password is stored as hashed value (scrypt).

## 5. Suggested production upgrades

1. Add rate limiting on OTP and login endpoints.
2. Add account lockout after repeated failed login attempts.
3. Add captcha on registration/login if abuse is detected.
4. Add audit log table for authentication events.
