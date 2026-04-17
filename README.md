# FitMetrics Monorepo

This repository now uses npm workspaces.

## Apps

- `apps/web` - Next.js web app + API (source of truth backend)
- `apps/mobile` - Expo React Native mobile app

## Packages

- `packages/contracts` - Shared API/domain schemas and types

## Commands

- `npm run dev` - Start web app
- `npm run dev:web` - Start web app
- `npm run dev:mobile` - Start Expo mobile app
- `npm run build` - Build web app
- `npm run lint` - Lint web app
- `npm run lint:all` - Lint all workspaces with lint script

## Notes

- Web and mobile should use the same backend/API in `apps/web/app/api`.
- For native auth, mobile endpoints are available under `/api/v1/auth/mobile/*`.
