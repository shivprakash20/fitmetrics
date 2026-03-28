import Link from 'next/link';
import { resetPasswordAction } from '@/app/(auth)/actions';
import { getQueryValue, type QueryParams } from '@/app/(auth)/query';
import styles from '@/app/(auth)/auth.module.scss';

export default async function ResetPasswordPage({
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
          <h1 className={styles.title}>Reset password</h1>
          <p className={styles.subtitle}>
            Enter your email, OTP, and a strong new password.
          </p>

          {message ? <p className={`${styles.message} ${styles.messageInfo}`}>{message}</p> : null}
          {error ? <p className={`${styles.message} ${styles.messageError}`}>{error}</p> : null}

          <form action={resetPasswordAction} className={styles.form}>
            <div className={styles.row}>
              <label htmlFor="email" className={styles.label}>Email</label>
              <input id="email" name="email" type="email" defaultValue={email} className={styles.input} required />
            </div>
            <div className={styles.row}>
              <label htmlFor="otp" className={styles.label}>OTP code</label>
              <input id="otp" name="otp" inputMode="numeric" maxLength={6} className={styles.input} required />
            </div>
            <div className={styles.row}>
              <label htmlFor="password" className={styles.label}>New password</label>
              <input id="password" name="password" type="password" className={styles.input} required />
            </div>
            <div className={styles.row}>
              <label htmlFor="confirmPassword" className={styles.label}>Confirm new password</label>
              <input id="confirmPassword" name="confirmPassword" type="password" className={styles.input} required />
            </div>
            <button type="submit" className={styles.submitBtn}>Reset password</button>
          </form>

          <div className={styles.linkRow}>
            <Link href="/login" className={styles.link}>Back to sign in</Link>
          </div>
        </section>
      </div>
    </main>
  );
}
