import { redirect } from 'next/navigation';
import {
  getProfileForPage,
  logoutAction,
  updateProfileAction,
} from '@/app/(auth)/actions';
import { getQueryValue, type QueryParams } from '@/app/(auth)/query';
import styles from '@/app/profile/page.module.scss';
import profile from '@/data/profile.json';

export default async function ProfilePage({
  searchParams,
}: {
  searchParams: Promise<QueryParams>;
}) {
  const profileData = await getProfileForPage();

  if (!profileData) {
    redirect('/register');
  }

  const params = await searchParams;
  const message = getQueryValue(params, 'message');
  const error = getQueryValue(params, 'error');

  return (
    <main className={styles.page}>
      <div className="container">
        <section className={styles.card}>
          <h1 className={styles.title}>{profile.title}</h1>
          <p className={styles.subtitle}>{profile.subtitle}</p>

          {message ? <p className={`${styles.message} ${styles.messageInfo}`}>{message}</p> : null}
          {error ? <p className={`${styles.message} ${styles.messageError}`}>{error}</p> : null}

          <div className={styles.meta}>
            <p>{profile.meta.emailLabel} {profileData.email}</p>
            <p>
              {profile.meta.verificationLabel}{' '}
              {profileData.emailVerifiedAt ? profile.meta.verified : profile.meta.notVerified}
            </p>
            <p>{profile.meta.joinedLabel} {profileData.createdAt.toISOString().slice(0, 10)}</p>
          </div>

          <form action={updateProfileAction} className={styles.form}>
            <div className={styles.gridTwo}>
              <div className={styles.row}>
                <label htmlFor="firstName" className={styles.label}>{profile.fields.firstName.label}</label>
                <input
                  id="firstName"
                  name="firstName"
                  defaultValue={profileData.firstName}
                  className={styles.input}
                  required
                />
              </div>
              <div className={styles.row}>
                <label htmlFor="middleName" className={styles.label}>{profile.fields.middleName.label}</label>
                <input
                  id="middleName"
                  name="middleName"
                  defaultValue={profileData.middleName ?? ''}
                  className={styles.input}
                />
              </div>
            </div>

            <div className={styles.row}>
              <label htmlFor="lastName" className={styles.label}>{profile.fields.lastName.label}</label>
              <input
                id="lastName"
                name="lastName"
                defaultValue={profileData.lastName}
                className={styles.input}
                required
              />
            </div>

            <div className={styles.gridTwo}>
              <div className={styles.row}>
                <label htmlFor="gender" className={styles.label}>{profile.fields.gender.label}</label>
                <select
                  id="gender"
                  name="gender"
                  defaultValue={profileData.gender}
                  className={styles.select}
                >
                  {profile.genderOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              <div className={styles.row}>
                <label htmlFor="mobile" className={styles.label}>{profile.fields.mobile.label}</label>
                <input
                  id="mobile"
                  name="mobile"
                  defaultValue={profileData.mobile}
                  className={styles.input}
                  required
                />
              </div>
            </div>

            <div className={styles.actions}>
              <button type="submit" className={styles.submitBtn}>{profile.submitButton}</button>
            </div>
          </form>

          <form action={logoutAction}>
            <button type="submit" className={styles.ghostBtn}>{profile.logoutButton}</button>
          </form>
        </section>
      </div>
    </main>
  );
}
