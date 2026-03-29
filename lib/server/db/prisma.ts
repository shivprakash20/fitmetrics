import 'server-only';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

declare global {
  var __fitmetricsPrisma: PrismaClient | undefined;
}

function createPrismaClient() {
  const connectionString = process.env.POSTGRES_PRISMA_URL!;

  const useSSL = connectionString.includes('sslmode=');
  const adapter = new PrismaPg({
    connectionString,
    ...(useSSL && { ssl: { rejectUnauthorized: false } }),
  });

  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  });
}

// Reuse client across hot-reloads in development to avoid exhausting connections.
export const prisma = globalThis.__fitmetricsPrisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalThis.__fitmetricsPrisma = prisma;
}
