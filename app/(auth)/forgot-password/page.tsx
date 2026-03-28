import Link from 'next/link';
import { forgotPasswordAction } from '@/app/(auth)/actions';
import { getQueryValue, type QueryParams } from '@/app/(auth)/query';
import styles from '@/app/(auth)/auth.module.scss';

export default async function ForgotPasswordPage({
  searchParams,
}: {
  searchParams: Promise<QueryParams>;
}) {
  const params = await searchParams;
  const message = getQueryValue(params, 'message');
  const error = getQueryValue(params, 'error');

  return (
    <main className={styles.page}>
      <div className="container">
        <section className={styles.card}>
          <h1 className={styles.title}>Forgot password</h1>
          <p className={styles.subtitle}>
            Enter your email and we will send an OTP for password reset.
          </p>

          {message ? <p className={`${styles.message} ${styles.messageInfo}`}>{message}</p> : null}
          {error ? <p className={`${styles.message} ${styles.messageError}`}>{error}</p> : null}

          <form action={forgotPasswordAction} className={styles.form}>
            <div className={styles.row}>
              <label htmlFor="email" className={styles.label}>Email</label>
              <input id="email" name="email" type="email" className={styles.input} required />
            </div>
            <button type="submit" className={styles.submitBtn}>Send reset OTP</button>
          </form>

          <div className={styles.linkRow}>
            <Link href="/login" className={styles.link}>Back to sign in</Link>
          </div>
        </section>
      </div>
    </main>
  );
}
