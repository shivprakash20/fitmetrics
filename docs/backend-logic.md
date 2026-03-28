# FitMetrics Backend Logic (Next.js App Router)

This project now uses a backend-for-frontend structure inside the Next.js app.

## Folder layout

```txt
app/
  (auth)/
    actions.ts                    # Server Actions for register/login/OTP/reset/logout
    register/page.tsx             # Registration page
    login/page.tsx                # Login page
    verify-email/page.tsx         # Email OTP verification page
    forgot-password/page.tsx      # Forgot password page
    reset-password/page.tsx       # Reset password page
  api/
    health/route.ts               # Uptime/health endpoint
    v1/
      analytics/route.ts          # Analytics event intake
      profile/route.ts            # Protected profile read/update example
  profile/page.tsx                # Protected profile page

lib/
  server/
    analytics/events.ts           # Analytics event schema validation
    auth/constants.ts             # Auth constants (cookie names, OTP/session TTL)
    auth/guards.ts                # Auth guard abstraction
    auth/otp.ts                   # OTP generation + hashing
    auth/password.ts              # Password hashing + verification
    auth/session.ts               # Session creation/read/clear
    config/env.ts                 # Centralized env access
    dal/auth.ts                   # DAL for users/otp/profile persistence
    db/prisma.ts                  # Prisma client singleton
    email/otp-email.ts            # SMTP OTP sender
    http/errors.ts                # API error model + normalization
    http/response.ts              # Consistent API response helpers
proxy.ts                          # Next.js Proxy route protection
```

## Why this structure

- `app/api/*` handles transport concerns: HTTP methods, parsing request/response, status codes.
- `lib/server/*` holds reusable backend logic that can be shared across routes and server actions.
- `v1` namespace in API routes allows non-breaking iteration when APIs evolve.

## Next build steps

1. Add Prisma migration (`npx prisma migrate dev --name init_auth`) after DB env is set.
2. Add rate limiting and attempt throttling for OTP and login flows.
3. Send analytics events to PostHog (and optionally keep critical events in DB).
4. Add Gym registration module under `app/api/v1/gyms/*`.
5. Add ecommerce checkout routes under `app/api/v1/checkout/*` with Stripe webhook.
