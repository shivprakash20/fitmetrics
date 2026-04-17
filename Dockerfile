# Monorepo entrypoint Dockerfile for the web app
FROM node:20-alpine AS deps
WORKDIR /app

COPY package.json ./
COPY apps/web/package.json ./apps/web/package.json
COPY apps/web/package-lock.json ./apps/web/package-lock.json
RUN npm ci --workspace @fitmetrics/web

FROM node:20-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build --workspace @fitmetrics/web

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

COPY --from=builder /app/apps/web/public ./public
COPY --from=builder /app/apps/web/.next/standalone ./
COPY --from=builder /app/apps/web/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
CMD ["node", "server.js"]
