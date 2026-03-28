import 'server-only';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

declare global {
  var __fitmetricsPrisma: PrismaClient | undefined;
}

/**
 * Reuse a single Prisma client in development to avoid too many connections
 * during hot-reload.
 */
function createPrismaClient() {
  // Keep a non-empty fallback so pages can render before env is configured.
  // Real DB operations still require a valid DATABASE_URL at runtime.
  const connectionString =
    process.env.DATABASE_URL ?? 'postgresql://postgres:postgres@localhost:5432/fitmetrics';

  const adapter = new PrismaPg({ connectionString });
  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  });
}

export const prisma =
  globalThis.__fitmetricsPrisma ??
  createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalThis.__fitmetricsPrisma = prisma;
}
