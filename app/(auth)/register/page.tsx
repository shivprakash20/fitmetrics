import Link from 'next/link';
import { registerAction } from '@/app/(auth)/actions';
import { getQueryValue, type QueryParams } from '@/app/(auth)/query';
import styles from '@/app/(auth)/auth.module.scss';

export default async function RegisterPage({
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
          <h1 className={styles.title}>Create your FitMetrics account</h1>
          <p className={styles.subtitle}>
            Register with your details, then verify your email OTP to activate your account.
          </p>

          {message ? <p className={`${styles.message} ${styles.messageInfo}`}>{message}</p> : null}
          {error ? <p className={`${styles.message} ${styles.messageError}`}>{error}</p> : null}

          <form action={registerAction} className={styles.form}>
            <div className={styles.gridTwo}>
              <div className={styles.row}>
                <label htmlFor="firstName" className={styles.label}>First name</label>
                <input id="firstName" name="firstName" className={styles.input} required />
              </div>
              <div className={styles.row}>
                <label htmlFor="middleName" className={styles.label}>Middle name (optional)</label>
                <input id="middleName" name="middleName" className={styles.input} />
              </div>
            </div>

            <div className={styles.row}>
              <label htmlFor="lastName" className={styles.label}>Last name</label>
              <input id="lastName" name="lastName" className={styles.input} required />
            </div>

            <div className={styles.gridTwo}>
              <div className={styles.row}>
                <label htmlFor="gender" className={styles.label}>Gender</label>
                <select id="gender" name="gender" className={styles.select} defaultValue="prefer_not_to_say">
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                  <option value="prefer_not_to_say">Prefer not to say</option>
                </select>
              </div>
              <div className={styles.row}>
                <label htmlFor="mobile" className={styles.label}>Mobile number</label>
                <input id="mobile" name="mobile" className={styles.input} placeholder="+919876543210" required />
              </div>
            </div>

            <div className={styles.row}>
              <label htmlFor="email" className={styles.label}>Email</label>
              <input id="email" name="email" type="email" defaultValue={email} className={styles.input} required />
            </div>

            <div className={styles.row}>
              <label htmlFor="password" className={styles.label}>Password</label>
              <input id="password" name="password" type="password" className={styles.input} required />
            </div>

            <button type="submit" className={styles.submitBtn}>Register & Send OTP</button>
          </form>

          <div className={styles.linkRow}>
            <span>Already registered?</span>
            <Link href="/login" className={styles.link}>Sign in</Link>
          </div>
        </section>
      </div>
    </main>
  );
}
