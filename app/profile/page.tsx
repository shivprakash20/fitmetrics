import { redirect } from 'next/navigation';
import { getProfileForPage } from '@/app/(auth)/actions';
import { getReadingsForProfile, type ReadingWithTrend, type TrendDirection } from '@/lib/server/dal/readings';
import styles from '@/app/profile/page.module.scss';

const CALC_META: Record<string, { label: string; unit: string; href: string }> = {
  bmi:            { label: 'BMI Score',       unit: '',         href: '/calculator/bmi' },
  bmr:            { label: 'BMR',             unit: 'kcal',     href: '/calculator/bmr' },
  ibw:            { label: 'Ideal Weight',    unit: '',         href: '/calculator/ibw' },
  bodyfat:        { label: 'Body Fat',        unit: '%',        href: '/calculator/body-fat' },
  tdee:           { label: 'TDEE',            unit: 'kcal/day', href: '/calculator/tdee' },
  calorie:        { label: 'Daily Calories',  unit: 'kcal/day', href: '/calculator/calorie-intake' },
  carbohydrate:   { label: 'Daily Carbs',     unit: 'g/day',    href: '/calculator/carbohydrate' },
  caloriesburned: { label: 'Calories Burned', unit: 'kcal',     href: '/calculator/calories-burned' },
  bodytype:       { label: 'WHR',             unit: '',         href: '/calculator/body-type' },
  protein:        { label: 'Daily Protein',   unit: 'g/day',    href: '/calculator/protein' },
  water:          { label: 'Daily Water',     unit: 'L/day',    href: '/calculator/water' },
  'weight-loss':  { label: 'Target Calories', unit: 'kcal/day', href: '/calculator/weight-loss' },
  'weight-gain':  { label: 'Target Calories', unit: 'kcal/day', href: '/calculator/weight-gain' },
  weightloss:     { label: 'Target Calories', unit: 'kcal/day', href: '/calculator/weight-loss' },
  weightgain:     { label: 'Target Calories', unit: 'kcal/day', href: '/calculator/weight-gain' },
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

function SnapshotCard({ reading }: { reading: ReadingWithTrend }) {
  const meta = CALC_META[reading.calculatorType] ?? { label: reading.calculatorType, unit: '', href: '#' };
  const icon = trendIcon(reading.trend);
  return (
    <a href={meta.href} className={styles.snapshotCard}>
      <span className={styles.snapshotLabel}>{meta.label}</span>
      <div className={styles.snapshotValueRow}>
        <span className={styles.snapshotValue}>
          {reading.currentValue !== null ? reading.currentValue : '—'}
        </span>
        {icon && (
          <span className={`${styles.trendBadge} ${styles[`trend_${reading.trend}`]}`}>{icon}</span>
        )}
      </div>
      {meta.unit && <span className={styles.snapshotUnit}>{meta.unit}</span>}
      <span className={styles.snapshotDate}>{formatDate(reading.savedAt)}</span>
    </a>
  );
}

function ActivityRow({ reading }: { reading: ReadingWithTrend }) {
  const meta = CALC_META[reading.calculatorType] ?? { label: reading.calculatorType, unit: '', href: '#' };
  const icon = trendIcon(reading.trend);
  return (
    <a href={meta.href} className={styles.activityRow}>
      <div className={styles.activityLeft}>
        <span className={styles.activityCalc}>{meta.label}</span>
        <span className={styles.activityDate}>{formatDate(reading.savedAt)}</span>
      </div>
      <div className={styles.activityRight}>
        <span className={styles.activityValue}>
          {reading.currentValue !== null ? reading.currentValue : '—'}
          {meta.unit ? ` ${meta.unit}` : ''}
        </span>
        {icon && (
          <span className={`${styles.trendBadge} ${styles[`trend_${reading.trend}`]}`}>{icon}</span>
        )}
      </div>
    </a>
  );
}

export default async function ProfilePage() {
  const profileData = await getProfileForPage();
  if (!profileData) redirect('/login');

  const { latest, recent } = await getReadingsForProfile(profileData.id);
  const initials = `${profileData.firstName[0]}${profileData.lastName[0]}`.toUpperCase();
  const fullName = [profileData.firstName, profileData.middleName, profileData.lastName].filter(Boolean).join(' ');

  return (
    <main className={styles.page}>

      {/* ── Hero ───────────────────────────────────────────────── */}
      <div className={styles.hero}>
        <div className={`${styles.heroInner} container`}>
          <div className={styles.avatar}>{initials}</div>
          <div className={styles.heroText}>
            <h1 className={styles.heroName}>{fullName}</h1>
            <p className={styles.heroMeta}>
              {profileData.email}
              <span className={styles.heroDivider}>·</span>
              Member since {profileData.createdAt.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}
              <span className={styles.heroDivider}>·</span>
              <span className={profileData.emailVerifiedAt ? styles.verified : styles.unverified}>
                {profileData.emailVerifiedAt ? '✓ Verified' : 'Unverified'}
              </span>
            </p>
          </div>
          <a href="/profile/settings" className={styles.settingsBtn}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            Settings
          </a>
        </div>
      </div>

      <div className={`${styles.body} container`}>

        {/* ── Health Snapshot ───────────────────────────────────── */}
        <section className={styles.section}>
          <div className={styles.sectionHead}>
            <div>
              <h2 className={styles.sectionTitle}>Health Snapshot</h2>
              <p className={styles.sectionSub}>Latest saved reading from each calculator</p>
            </div>
            <a href="/calculator/bmi" className={styles.sectionLink}>Run a calculator →</a>
          </div>

          {latest.length > 0 ? (
            <div className={styles.snapshotGrid}>
              {latest.map(r => <SnapshotCard key={r.id} reading={r} />)}
            </div>
          ) : (
            <div className={styles.emptyBox}>
              <div className={styles.emptyIcon}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                </svg>
              </div>
              <p className={styles.emptyTitle}>No readings saved yet</p>
              <p className={styles.emptySub}>Run any calculator and tap <strong>Save Reading</strong> to track your health data here.</p>
              <a href="/calculator/bmi" className={styles.emptyLink}>Start with BMI →</a>
            </div>
          )}
        </section>

        {/* ── Recent Activity ───────────────────────────────────── */}
        {recent.length > 0 && (
          <section className={styles.section}>
            <div className={styles.sectionHead}>
              <div>
                <h2 className={styles.sectionTitle}>Recent Activity</h2>
                <p className={styles.sectionSub}>Last {recent.length} saves · ↑↓ shows change from previous reading</p>
              </div>
            </div>
            <div className={styles.activityList}>
              {recent.map(r => <ActivityRow key={r.id} reading={r} />)}
            </div>
          </section>
        )}

      </div>
    </main>
  );
}
