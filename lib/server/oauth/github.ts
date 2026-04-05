import 'server-only';

const GITHUB_AUTH_URL = 'https://github.com/login/oauth/authorize';
const GITHUB_TOKEN_URL = 'https://github.com/login/oauth/access_token';
const GITHUB_USER_URL = 'https://api.github.com/user';
const GITHUB_EMAILS_URL = 'https://api.github.com/user/emails';

export interface GitHubProfile {
  id: number;         // provider ID
  email: string | null;
  name: string | null;
  login: string;
}

interface GitHubEmail {
  email: string;
  primary: boolean;
  verified: boolean;
}

function getCredentials() {
  const clientId = process.env.GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    throw new Error('GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET must be set.');
  }
  return { clientId, clientSecret };
}

function getRedirectUri(): string {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';
  return `${appUrl}/api/auth/github/callback`;
}

export function buildGitHubAuthUrl(state: string): string {
  const { clientId } = getCredentials();
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: getRedirectUri(),
    scope: 'read:user user:email',
    state,
  });
  return `${GITHUB_AUTH_URL}?${params.toString()}`;
}

export async function exchangeGitHubCode(code: string): Promise<GitHubProfile> {
  const { clientId, clientSecret } = getCredentials();

  const tokenRes = await fetch(GITHUB_TOKEN_URL, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: getRedirectUri(),
    }),
  });

  if (!tokenRes.ok) {
    throw new Error(`GitHub token exchange failed: ${tokenRes.status}`);
  }

  const { access_token } = await tokenRes.json() as { access_token: string };

  const headers = {
    Authorization: `Bearer ${access_token}`,
    Accept: 'application/json',
    'User-Agent': 'FitMetrics',
  };

  const [userRes, emailsRes] = await Promise.all([
    fetch(GITHUB_USER_URL, { headers }),
    fetch(GITHUB_EMAILS_URL, { headers }),
  ]);

  if (!userRes.ok) {
    throw new Error(`GitHub user fetch failed: ${userRes.status}`);
  }

  const user = await userRes.json() as GitHubProfile;

  // Resolve primary verified email if public email is null
  if (!user.email && emailsRes.ok) {
    const emails = await emailsRes.json() as GitHubEmail[];
    const primary = emails.find(e => e.primary && e.verified);
    if (primary) user.email = primary.email;
  }

  return user;
}
