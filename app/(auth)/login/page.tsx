import Link from 'next/link';
import { loginAction } from '@/app/(auth)/actions';
import { getQueryValue, type QueryParams } from '@/app/(auth)/query';
import styles from '@/app/(auth)/auth.module.scss';
import auth from '@/data/auth.json';

export default async function LoginPage({
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
          <h1 className={styles.title}>{auth.login.title}</h1>
          <p className={styles.subtitle}>{auth.login.subtitle}</p>

          {message ? <p className={`${styles.message} ${styles.messageInfo}`}>{message}</p> : null}
          {error ? <p className={`${styles.message} ${styles.messageError}`}>{error}</p> : null}

          <form action={loginAction} className={styles.form}>
            <input type="hidden" name="next" value={next} />
            <div className={styles.row}>
              <label htmlFor="email" className={styles.label}>{auth.login.fields.email.label}</label>
              <input id="email" name="email" type="email" defaultValue={email} className={styles.input} required />
            </div>

            <div className={styles.row}>
              <label htmlFor="password" className={styles.label}>{auth.login.fields.password.label}</label>
              <input id="password" name="password" type="password" className={styles.input} required />
            </div>

            <div className={styles.linkRow}>
              <Link href={next ? `/register?next=${encodeURIComponent(next)}` : '/register'} className={styles.link}>
                {auth.login.links.register}
              </Link>
            </div>

            <button type="submit" className={styles.submitBtn}>{auth.login.submitButton}</button>
          </form>

          <div className={styles.linkRow}>
            <Link href={next ? `/forgot-password?next=${encodeURIComponent(next)}` : '/forgot-password'} className={styles.link}>
              {auth.login.links.forgotPassword}
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
