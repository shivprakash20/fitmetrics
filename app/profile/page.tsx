import { redirect } from 'next/navigation';
import {
  getProfileForPage,
  logoutAction,
  updateProfileAction,
} from '@/app/(auth)/actions';
import { getQueryValue, type QueryParams } from '@/app/(auth)/query';
import styles from '@/app/profile/page.module.scss';

export default async function ProfilePage({
  searchParams,
}: {
  searchParams: Promise<QueryParams>;
}) {
  const profile = await getProfileForPage();

  if (!profile) {
    redirect('/register');
  }

  const params = await searchParams;
  const message = getQueryValue(params, 'message');
  const error = getQueryValue(params, 'error');

  return (
    <main className={styles.page}>
      <div className="container">
        <section className={styles.card}>
          <h1 className={styles.title}>My Profile</h1>
          <p className={styles.subtitle}>
            Update your profile details. This data is stored in your user account.
          </p>

          {message ? <p className={`${styles.message} ${styles.messageInfo}`}>{message}</p> : null}
          {error ? <p className={`${styles.message} ${styles.messageError}`}>{error}</p> : null}

          <div className={styles.meta}>
            <p>Email: {profile.email}</p>
            <p>
              Email verification status:{' '}
              {profile.emailVerifiedAt ? 'Verified' : 'Not verified'}
            </p>
            <p>Joined: {profile.createdAt.toISOString().slice(0, 10)}</p>
          </div>

          <form action={updateProfileAction} className={styles.form}>
            <div className={styles.gridTwo}>
              <div className={styles.row}>
                <label htmlFor="firstName" className={styles.label}>First name</label>
                <input
                  id="firstName"
                  name="firstName"
                  defaultValue={profile.firstName}
                  className={styles.input}
                  required
                />
              </div>
              <div className={styles.row}>
                <label htmlFor="middleName" className={styles.label}>Middle name (optional)</label>
                <input
                  id="middleName"
                  name="middleName"
                  defaultValue={profile.middleName ?? ''}
                  className={styles.input}
                />
              </div>
            </div>

            <div className={styles.row}>
              <label htmlFor="lastName" className={styles.label}>Last name</label>
              <input
                id="lastName"
                name="lastName"
                defaultValue={profile.lastName}
                className={styles.input}
                required
              />
            </div>

            <div className={styles.gridTwo}>
              <div className={styles.row}>
                <label htmlFor="gender" className={styles.label}>Gender</label>
                <select
                  id="gender"
                  name="gender"
                  defaultValue={profile.gender}
                  className={styles.select}
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                  <option value="prefer_not_to_say">Prefer not to say</option>
                </select>
              </div>

              <div className={styles.row}>
                <label htmlFor="mobile" className={styles.label}>Mobile number</label>
                <input
                  id="mobile"
                  name="mobile"
                  defaultValue={profile.mobile}
                  className={styles.input}
                  required
                />
              </div>
            </div>

            <div className={styles.actions}>
              <button type="submit" className={styles.submitBtn}>Save profile</button>
            </div>
          </form>

          <form action={logoutAction}>
            <button type="submit" className={styles.ghostBtn}>Logout</button>
          </form>
        </section>
      </div>
    </main>
  );
}
