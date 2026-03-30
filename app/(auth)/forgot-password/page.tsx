import Link from 'next/link';
import { forgotPasswordAction } from '@/app/(auth)/actions';
import { getQueryValue, type QueryParams } from '@/app/(auth)/query';
import styles from '@/app/(auth)/auth.module.scss';
import auth from '@/data/auth.json';

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
          <h1 className={styles.title}>{auth.forgotPassword.title}</h1>
          <p className={styles.subtitle}>{auth.forgotPassword.subtitle}</p>

          {message ? <p className={`${styles.message} ${styles.messageInfo}`}>{message}</p> : null}
          {error ? <p className={`${styles.message} ${styles.messageError}`}>{error}</p> : null}

          <form action={forgotPasswordAction} className={styles.form}>
            <div className={styles.row}>
              <label htmlFor="email" className={styles.label}>{auth.forgotPassword.fields.email.label}</label>
              <input id="email" name="email" type="email" className={styles.input} required />
            </div>
            <button type="submit" className={styles.submitBtn}>{auth.forgotPassword.submitButton}</button>
          </form>

          <div className={styles.linkRow}>
            <Link href="/login" className={styles.link}>{auth.forgotPassword.links.backToSignIn}</Link>
          </div>
        </section>
      </div>
    </main>
  );
}
