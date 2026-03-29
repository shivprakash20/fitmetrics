import 'server-only';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

declare global {
  var __fitmetricsPrisma: PrismaClient | undefined;
}

function createPrismaClient() {
  const raw = process.env.POSTGRES_PRISMA_URL!;

  // Strip SSL-related params from the connection string so pg-connection-string
  // doesn't override our explicit ssl config with stricter cert verification.
  const hasSSL = raw.includes('sslmode=');
  const connectionString = raw.replace(/[?&](sslmode|uselibpqcompat|pgbouncer)=[^&]*/g, '').replace(/\?&/, '?').replace(/[?&]$/, '');

  const pool = new Pool({
    connectionString,
    ...(hasSSL && { ssl: { rejectUnauthorized: false } }),
  });

  const adapter = new PrismaPg(pool);

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
