import Link from 'next/link';
import { resendVerificationOtpAction, verifyEmailOtpAction } from '@/app/(auth)/actions';
import { getQueryValue, type QueryParams } from '@/app/(auth)/query';
import styles from '@/app/(auth)/auth.module.scss';

export default async function VerifyEmailPage({
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
          <h1 className={styles.title}>Verify your email</h1>
          <p className={styles.subtitle}>
            Enter the 6-digit OTP sent to your email. OTP expires in 10 minutes.
          </p>

          {message ? <p className={`${styles.message} ${styles.messageInfo}`}>{message}</p> : null}
          {error ? <p className={`${styles.message} ${styles.messageError}`}>{error}</p> : null}

          <form action={verifyEmailOtpAction} className={styles.form}>
            <div className={styles.row}>
              <label htmlFor="email" className={styles.label}>Email</label>
              <input id="email" name="email" type="email" defaultValue={email} className={styles.input} required />
            </div>
            <div className={styles.row}>
              <label htmlFor="otp" className={styles.label}>OTP code</label>
              <input id="otp" name="otp" inputMode="numeric" maxLength={6} className={styles.input} required />
            </div>
            <button type="submit" className={styles.submitBtn}>Verify & Sign in</button>
          </form>

          <form action={resendVerificationOtpAction} className={styles.form}>
            <input type="hidden" name="email" value={email} />
            <button type="submit" className={styles.ghostBtn}>Resend OTP</button>
          </form>

          <div className={styles.linkRow}>
            <Link href="/login" className={styles.link}>Back to sign in</Link>
          </div>
        </section>
      </div>
    </main>
  );
}
