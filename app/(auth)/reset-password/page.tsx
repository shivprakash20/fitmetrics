import Link from 'next/link';
import { resetPasswordAction } from '@/app/(auth)/actions';
import { getQueryValue, type QueryParams } from '@/app/(auth)/query';
import styles from '@/app/(auth)/auth.module.scss';
import auth from '@/data/auth.json';

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
          <h1 className={styles.title}>{auth.resetPassword.title}</h1>
          <p className={styles.subtitle}>{auth.resetPassword.subtitle}</p>

          {message ? <p className={`${styles.message} ${styles.messageInfo}`}>{message}</p> : null}
          {error ? <p className={`${styles.message} ${styles.messageError}`}>{error}</p> : null}

          <form action={resetPasswordAction} className={styles.form}>
            <div className={styles.row}>
              <label htmlFor="email" className={styles.label}>{auth.resetPassword.fields.email.label}</label>
              <input id="email" name="email" type="email" defaultValue={email} className={styles.input} required />
            </div>
            <div className={styles.row}>
              <label htmlFor="otp" className={styles.label}>{auth.resetPassword.fields.otp.label}</label>
              <input id="otp" name="otp" inputMode="numeric" maxLength={6} className={styles.input} required />
            </div>
            <div className={styles.row}>
              <label htmlFor="password" className={styles.label}>{auth.resetPassword.fields.password.label}</label>
              <input id="password" name="password" type="password" className={styles.input} required />
            </div>
            <div className={styles.row}>
              <label htmlFor="confirmPassword" className={styles.label}>{auth.resetPassword.fields.confirmPassword.label}</label>
              <input id="confirmPassword" name="confirmPassword" type="password" className={styles.input} required />
            </div>
            <button type="submit" className={styles.submitBtn}>{auth.resetPassword.submitButton}</button>
          </form>

          <div className={styles.linkRow}>
            <Link href="/login" className={styles.link}>{auth.resetPassword.links.backToSignIn}</Link>
          </div>
        </section>
      </div>
    </main>
  );
}
