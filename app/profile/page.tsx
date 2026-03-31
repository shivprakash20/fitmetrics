import { redirect } from 'next/navigation';
import {
  getProfileForPage,
  logoutAction,
  updateProfileAction,
} from '@/app/(auth)/actions';
import { getQueryValue, type QueryParams } from '@/app/(auth)/query';
import { getReadingsForProfile, type ReadingWithTrend, type TrendDirection } from '@/lib/server/dal/readings';
import styles from '@/app/profile/page.module.scss';
import profile from '@/data/profile.json';

// ─── Display metadata per calculator type ─────────────────────────────────────
const CALC_META: Record<string, { label: string; unit: string; href: string }> = {
  bmi:            { label: 'BMI Score',       unit: '',        href: '/calculator/bmi' },
  bmr:            { label: 'BMR',             unit: 'kcal',    href: '/calculator/bmr' },
  ibw:            { label: 'Ideal Weight',    unit: '',        href: '/calculator/ibw' },
  bodyfat:        { label: 'Body Fat',        unit: '%',       href: '/calculator/body-fat' },
  tdee:           { label: 'TDEE',            unit: 'kcal/day',href: '/calculator/tdee' },
  calorie:        { label: 'Daily Calories',  unit: 'kcal/day',href: '/calculator/calorie-intake' },
  carbohydrate:   { label: 'Daily Carbs',     unit: 'g/day',   href: '/calculator/carbohydrate' },
  caloriesburned: { label: 'Calories Burned', unit: 'kcal',    href: '/calculator/calories-burned' },
  bodytype:       { label: 'WHR',             unit: '',        href: '/calculator/body-type' },
  protein:        { label: 'Daily Protein',   unit: 'g/day',   href: '/calculator/protein' },
  water:          { label: 'Daily Water',     unit: 'L/day',   href: '/calculator/water' },
  'weight-loss':  { label: 'Target Calories', unit: 'kcal/day',href: '/calculator/weight-loss' },
  'weight-gain':  { label: 'Target Calories', unit: 'kcal/day',href: '/calculator/weight-gain' },
  weightloss:     { label: 'Target Calories', unit: 'kcal/day',href: '/calculator/weight-loss' },
  weightgain:     { label: 'Target Calories', unit: 'kcal/day',href: '/calculator/weight-gain' },
};

function trendIcon(t: TrendDirection) {
  if (t === 'up')   return '↑';
  if (t === 'down') return '↓';
  if (t === 'flat') return '→';
  return null;
}

function formatDate(d: Date) {
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

// ─── Snapshot card ─────────────────────────────────────────────────────────────
function SnapshotCard({ reading }: { reading: ReadingWithTrend }) {
  const meta = CALC_META[reading.calculatorType] ?? {
    label: reading.calculatorType,
    unit: '',
    href: '#',
  };
  const icon = trendIcon(reading.trend);

  return (
    <a href={meta.href} className={styles.snapshotCard}>
      <span className={styles.snapshotLabel}>{meta.label}</span>
      <div className={styles.snapshotValueRow}>
        <span className={styles.snapshotValue}>
          {reading.currentValue !== null ? reading.currentValue : '—'}
        </span>
        {meta.unit && <span className={styles.snapshotUnit}>{meta.unit}</span>}
        {icon && (
          <span className={`${styles.trendBadge} ${styles[`trend_${reading.trend}`]}`}>
            {icon}
          </span>
        )}
      </div>
      <span className={styles.snapshotDate}>{formatDate(reading.savedAt)}</span>
    </a>
  );
}

// ─── Activity row ──────────────────────────────────────────────────────────────
function ActivityRow({ reading }: { reading: ReadingWithTrend }) {
  const meta = CALC_META[reading.calculatorType] ?? {
    label: reading.calculatorType,
    unit: '',
    href: '#',
  };
  const icon = trendIcon(reading.trend);

  return (
    <a href={meta.href} className={styles.activityRow}>
      <div className={styles.activityDot} />
      <div className={styles.activityContent}>
        <span className={styles.activityCalc}>{meta.label}</span>
        <div className={styles.activityResultRow}>
          <span className={styles.activityValue}>
            {reading.currentValue !== null ? reading.currentValue : '—'}
            {meta.unit ? ` ${meta.unit}` : ''}
          </span>
          {icon && (
            <span className={`${styles.trendBadge} ${styles[`trend_${reading.trend}`]}`}>
              {icon}
            </span>
          )}
        </div>
      </div>
      <span className={styles.activityDate}>{formatDate(reading.savedAt)}</span>
    </a>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────
export default async function ProfilePage({
  searchParams,
}: {
  searchParams: Promise<QueryParams>;
}) {
  const profileData = await getProfileForPage();
  if (!profileData) redirect('/register');

  const params  = await searchParams;
  const message = getQueryValue(params, 'message');
  const error   = getQueryValue(params, 'error');

  const { latest, recent } = await getReadingsForProfile(profileData.id);

  return (
    <main className={styles.page}>
      <div className="container">

        {/* ── Dashboard ──────────────────────────────────────── */}
        {latest.length > 0 && (
          <section className={styles.dashSection}>
            <div className={styles.dashHeader}>
              <h2 className={styles.dashTitle}>Health Snapshot</h2>
              <p className={styles.dashSub}>Your latest saved reading from each calculator</p>
            </div>
            <div className={styles.snapshotGrid}>
              {latest.map(r => <SnapshotCard key={r.id} reading={r} />)}
            </div>
          </section>
        )}

        {recent.length > 0 && (
          <section className={styles.dashSection}>
            <div className={styles.dashHeader}>
              <h2 className={styles.dashTitle}>Recent Activity</h2>
              <p className={styles.dashSub}>Your last {recent.length} saved readings · ↑↓ shows change from previous save</p>
            </div>
            <div className={styles.activityList}>
              {recent.map(r => <ActivityRow key={r.id} reading={r} />)}
            </div>
          </section>
        )}

        {latest.length === 0 && (
          <section className={styles.emptyState}>
            <p className={styles.emptyTitle}>No readings saved yet</p>
            <p className={styles.emptySub}>
              Run any calculator and tap <strong>Save Reading</strong> — it will appear here.
            </p>
            <a href="/calculator/bmi" className={styles.emptyLink}>Start with BMI →</a>
          </section>
        )}

        {/* ── Profile edit ───────────────────────────────────── */}
        <section className={styles.card}>
          <h1 className={styles.title}>{profile.title}</h1>
          <p className={styles.subtitle}>{profile.subtitle}</p>

          {message ? <p className={`${styles.message} ${styles.messageInfo}`}>{message}</p> : null}
          {error   ? <p className={`${styles.message} ${styles.messageError}`}>{error}</p>   : null}

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
                <input id="firstName" name="firstName" defaultValue={profileData.firstName} className={styles.input} required />
              </div>
              <div className={styles.row}>
                <label htmlFor="middleName" className={styles.label}>{profile.fields.middleName.label}</label>
                <input id="middleName" name="middleName" defaultValue={profileData.middleName ?? ''} className={styles.input} />
              </div>
            </div>

            <div className={styles.row}>
              <label htmlFor="lastName" className={styles.label}>{profile.fields.lastName.label}</label>
              <input id="lastName" name="lastName" defaultValue={profileData.lastName} className={styles.input} required />
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
                <input id="mobile" name="mobile" defaultValue={profileData.mobile} className={styles.input} required />
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
