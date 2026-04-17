import { redirect } from 'next/navigation';
import {
  getProfileForPage,
  logoutAction,
  updateProfileAction,
} from '@/app/(auth)/actions';
import { getQueryValue, type QueryParams } from '@/app/(auth)/query';
import FlashMessage from './FlashMessage';
import SubmitButton from './SubmitButton';
import styles from './page.module.scss';
import profile from '@/data/profile.json';

export const metadata = {
  title: 'Profile Settings — FitMetrics',
  description: 'Update your FitMetrics profile details.',
};

export default async function ProfileSettingsPage({
  searchParams,
}: {
  searchParams: Promise<QueryParams>;
}) {
  const profileData = await getProfileForPage();
  if (!profileData) redirect('/login');

  const params  = await searchParams;
  const message = getQueryValue(params, 'message');
  const error   = getQueryValue(params, 'error');

  const initials = `${profileData.firstName[0]}${(profileData.lastName?.[0] ?? '')}`.toUpperCase();
  const fullName = [profileData.firstName, profileData.middleName, profileData.lastName].filter(Boolean).join(' ');

  return (
    <main className={styles.page}>

      {/* ── Hero ────────────────────────────────────────────────── */}
      <div className={styles.hero}>
        <div className={`${styles.heroInner} container`}>
          <a href="/profile" className={styles.backBtn}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 18-6-6 6-6" />
            </svg>
            <span className={styles.backBtnLabel}>Health Data</span>
          </a>
          <div className={styles.avatar}>{initials}</div>
          <div className={styles.heroText}>
            <h1 className={styles.heroName}>Profile Settings</h1>
            <p className={styles.heroMeta}>{fullName}</p>
          </div>
        </div>
      </div>

      <div className={`${styles.body} container`}>

        {/* ── Account info ─────────────────────────────────────────── */}
        <section className={styles.card}>
          <h2 className={styles.cardTitle}>Account</h2>
          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Email</span>
              <span className={styles.infoValue}>{profileData.email}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Email Verification</span>
              <span className={`${styles.infoValue} ${profileData.emailVerifiedAt ? styles.verified : styles.unverified}`}>
                {profileData.emailVerifiedAt ? '✓ Verified' : '✗ Not verified'}
              </span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Member Since</span>
              <span className={styles.infoValue}>
                {profileData.createdAt.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
              </span>
            </div>
          </div>
        </section>

        {/* ── Edit profile ─────────────────────────────────────────── */}
        <section className={styles.card}>
          <h2 className={styles.cardTitle}>Personal Details</h2>

          {message && <FlashMessage type="info">{message}</FlashMessage>}
          {error   && <FlashMessage type="error">{error}</FlashMessage>}

          {/* Fields — submit button lives outside via form="profile-form" */}
          <form id="profile-form" action={updateProfileAction} className={styles.form}>
            <div className={styles.gridTwo}>
              <div className={styles.row}>
                <label htmlFor="firstName" className={styles.label}>{profile.fields.firstName.label}</label>
                <input id="firstName" name="firstName" defaultValue={profileData.firstName} className={styles.input} required />
              </div>
              <div className={styles.row}>
                <label htmlFor="middleName" className={styles.label}>{profile.fields.middleName.label}</label>
                <input id="middleName" name="middleName" defaultValue={profileData.middleName ?? ''} className={styles.input} />
              </div>
            </div>
            <div className={styles.row}>
              <label htmlFor="lastName" className={styles.label}>{profile.fields.lastName.label}</label>
              <input id="lastName" name="lastName" defaultValue={profileData.lastName ?? ''} className={styles.input} />
            </div>
            <div className={styles.gridTwo}>
              <div className={styles.row}>
                <label htmlFor="gender" className={styles.label}>{profile.fields.gender.label}</label>
                <select id="gender" name="gender" defaultValue={profileData.gender} className={styles.select}>
                  {profile.genderOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
              <div className={styles.row}>
                <label htmlFor="mobile" className={styles.label}>{profile.fields.mobile.label}</label>
                <input id="mobile" name="mobile" defaultValue={profileData.mobile ?? ''} className={styles.input} required />
              </div>
            </div>

            {/* Actions row — inside the form so SubmitButton hooks into useFormStatus */}
            <div className={styles.actionsRow}>
              <SubmitButton label={profile.submitButton} />
              <button 
                formAction={logoutAction} 
                formNoValidate 
                className={styles.logoutBtn}
              >
                {profile.logoutButton}
              </button>
            </div>
          </form>
        </section>

      </div>
    </main>
  );
}
