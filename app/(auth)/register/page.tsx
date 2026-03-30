import Link from 'next/link';
import { registerAction } from '@/app/(auth)/actions';
import { getQueryValue, type QueryParams } from '@/app/(auth)/query';
import styles from '@/app/(auth)/auth.module.scss';
import auth from '@/data/auth.json';

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
          <h1 className={styles.title}>{auth.register.title}</h1>
          <p className={styles.subtitle}>{auth.register.subtitle}</p>

          {message ? <p className={`${styles.message} ${styles.messageInfo}`}>{message}</p> : null}
          {error ? <p className={`${styles.message} ${styles.messageError}`}>{error}</p> : null}

          <form action={registerAction} className={styles.form}>
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
              <input id="lastName" name="lastName" className={styles.input} required />
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
            <Link href="/login" className={styles.link}>{auth.register.links.signIn}</Link>
          </div>
        </section>
      </div>
    </main>
  );
}
