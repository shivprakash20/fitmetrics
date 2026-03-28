import Link from 'next/link';
import { loginAction } from '@/app/(auth)/actions';
import { getQueryValue, type QueryParams } from '@/app/(auth)/query';
import styles from '@/app/(auth)/auth.module.scss';

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<QueryParams>;
}) {
  const params = await searchParams;
  const email = getQueryValue(params, 'email');
  const message = getQueryValue(params, 'message');
  const error = getQueryValue(params, 'error');

  return (
    <main className={styles.page}>
      <div className="container">
        <section className={styles.card}>
          <h1 className={styles.title}>Sign in to FitMetrics</h1>
          <p className={styles.subtitle}>
            Use your registered email and password. If your account does not exist, we redirect to registration.
          </p>

          {message ? <p className={`${styles.message} ${styles.messageInfo}`}>{message}</p> : null}
          {error ? <p className={`${styles.message} ${styles.messageError}`}>{error}</p> : null}

          <form action={loginAction} className={styles.form}>
            <div className={styles.row}>
              <label htmlFor="email" className={styles.label}>Email</label>
              <input id="email" name="email" type="email" defaultValue={email} className={styles.input} required />
            </div>

            <div className={styles.row}>
              <label htmlFor="password" className={styles.label}>Password</label>
              <input id="password" name="password" type="password" className={styles.input} required />
            </div>

            <div className={styles.linkRow}>
              <Link href="/register" className={styles.link}>Don&apos;t have an account? Register</Link>
            </div>

            <button type="submit" className={styles.submitBtn}>Sign in</button>
          </form>

          <div className={styles.linkRow}>
            <Link href="/forgot-password" className={styles.link}>Forgot password?</Link>
          </div>
        </section>
      </div>
    </main>
  );
}
