import Link from 'next/link';
import OAuthFlash from '@/app/(auth)/OAuthFlash';
import { registerAction } from '@/app/(auth)/actions';
import { getQueryValue, type QueryParams } from '@/app/(auth)/query';
import styles from '@/app/(auth)/auth.module.scss';
import auth from '@/data/auth.json';

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"/>
    </svg>
  );
}

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<QueryParams>;
}) {
  const params = await searchParams;
  const email = getQueryValue(params, 'email');
  const message = getQueryValue(params, 'message');
  const error = getQueryValue(params, 'error');
  const next = getQueryValue(params, 'next');

  return (
    <main className={styles.page}>
      <div className="container">
        <section className={styles.card}>
          <h1 className={styles.title}>{auth.register.title}</h1>
          <p className={styles.subtitle}>{auth.register.subtitle}</p>

          <OAuthFlash />
          {message ? <p className={`${styles.message} ${styles.messageInfo}`}>{message}</p> : null}
          {error ? <p className={`${styles.message} ${styles.messageError}`}>{error}</p> : null}

          {/* SSO */}
          <div className={styles.ssoGroup}>
            <a href={next ? `/api/auth/google?next=${encodeURIComponent(next)}` : '/api/auth/google'} className={styles.ssoBtn}>
              <GoogleIcon /> Continue with Google
            </a>
            <a href={next ? `/api/auth/github?next=${encodeURIComponent(next)}` : '/api/auth/github'} className={styles.ssoBtn}>
              <GitHubIcon /> Continue with GitHub
            </a>
          </div>

          <div className={styles.divider}><span>or</span></div>

          <form action={registerAction} className={styles.form}>
            <input type="hidden" name="next" value={next} />
            <div className={styles.gridTwo}>
              <div className={styles.row}>
                <label htmlFor="firstName" className={styles.label}>{auth.register.fields.firstName.label}</label>
                <input id="firstName" name="firstName" className={styles.input} required />
              </div>
              <div className={styles.row}>
                <label htmlFor="middleName" className={styles.label}>{auth.register.fields.middleName.label}</label>
                <input id="middleName" name="middleName" className={styles.input} />
              </div>
            </div>

            <div className={styles.row}>
              <label htmlFor="lastName" className={styles.label}>{auth.register.fields.lastName.label}</label>
              <input id="lastName" name="lastName" className={styles.input} />
            </div>

            <div className={styles.gridTwo}>
              <div className={styles.row}>
                <label htmlFor="gender" className={styles.label}>{auth.register.fields.gender.label}</label>
                <select id="gender" name="gender" className={styles.select} defaultValue="prefer_not_to_say">
                  {auth.genderOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
              <div className={styles.row}>
                <label htmlFor="mobile" className={styles.label}>{auth.register.fields.mobile.label}</label>
                <input id="mobile" name="mobile" className={styles.input} placeholder={auth.register.fields.mobile.placeholder} required />
              </div>
            </div>

            <div className={styles.row}>
              <label htmlFor="email" className={styles.label}>{auth.register.fields.email.label}</label>
              <input id="email" name="email" type="email" defaultValue={email} className={styles.input} required />
            </div>

            <div className={styles.row}>
              <label htmlFor="password" className={styles.label}>{auth.register.fields.password.label}</label>
              <input id="password" name="password" type="password" className={styles.input} required />
            </div>

            <button type="submit" className={styles.submitBtn}>{auth.register.submitButton}</button>
          </form>

          <div className={styles.linkRow}>
            <span>{auth.register.links.signInPrompt}</span>
            <Link href={next ? `/login?next=${encodeURIComponent(next)}` : '/login'} className={styles.link}>
              {auth.register.links.signIn}
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
