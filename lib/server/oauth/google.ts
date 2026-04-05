import 'server-only';

const GOOGLE_AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth';
const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token';
const GOOGLE_USERINFO_URL = 'https://www.googleapis.com/oauth2/v3/userinfo';

export interface GoogleProfile {
  sub: string;       // provider ID
  email: string;
  name: string;
  given_name?: string;
  family_name?: string;
  picture?: string;
  email_verified?: boolean;
}

function getCredentials() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    throw new Error('GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET must be set.');
  }
  return { clientId, clientSecret };
}

function getRedirectUri(): string {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';
  return `${appUrl}/api/auth/google/callback`;
}

export function buildGoogleAuthUrl(state: string): string {
  const { clientId } = getCredentials();
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: getRedirectUri(),
    response_type: 'code',
    scope: 'openid email profile',
    state,
    access_type: 'online',
    prompt: 'select_account',
  });
  return `${GOOGLE_AUTH_URL}?${params.toString()}`;
}

export async function exchangeGoogleCode(code: string): Promise<GoogleProfile> {
  const { clientId, clientSecret } = getCredentials();

  const tokenRes = await fetch(GOOGLE_TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: getRedirectUri(),
      grant_type: 'authorization_code',
    }),
  });

  if (!tokenRes.ok) {
    throw new Error(`Google token exchange failed: ${tokenRes.status}`);
  }

  const { access_token } = await tokenRes.json() as { access_token: string };

  const profileRes = await fetch(GOOGLE_USERINFO_URL, {
    headers: { Authorization: `Bearer ${access_token}` },
  });

  if (!profileRes.ok) {
    throw new Error(`Google userinfo fetch failed: ${profileRes.status}`);
  }

  return profileRes.json() as Promise<GoogleProfile>;
}
