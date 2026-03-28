/**
 * Centralized server environment access.
 * Keep all env reads here so the rest of the backend logic stays testable.
 */
function getEnv(name: string, fallback: string): string {
  const raw = process.env[name];
  return raw && raw.trim().length > 0 ? raw : fallback;
}

export const serverEnv = Object.freeze({
  nodeEnv: getEnv('NODE_ENV', 'development'),
  appUrl: getEnv('NEXT_PUBLIC_APP_URL', 'http://localhost:3000'),
  appVersion: getEnv('npm_package_version', '0.1.0'),
});

export const isProduction = serverEnv.nodeEnv === 'production';
