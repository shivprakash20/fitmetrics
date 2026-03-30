import Link from 'next/link';
import Image from 'next/image';
import calculators from '@/data/calculators.json';
import styles from './page.module.scss';

export const metadata = {
  title: 'FitMetrics — Free Health & Body Calculators',
  description: 'Calculate BMI, BMR, Ideal Body Weight, Body Fat %, and TDEE using established formulas. Free, accurate, and easy to use.',
};

const BENEFITS = [
  { icon: '🔬', title: 'Established Formulas',  desc: 'Every calculator uses well-known formulas widely applied in clinical and fitness practice.' },
  { icon: '⚡', title: 'Instant Results',        desc: 'Get your health metrics in seconds with no sign-up or download required.' },
  { icon: '📊', title: 'Track Progress',         desc: 'Save your results and monitor how your metrics change over time.' },
  { icon: '🔒', title: 'Private & Secure',       desc: 'Your data stays on your device. We never sell or share personal information.' },
];

export default function HomePage() {
  return (
    <>
      {/* ── Hero ── */}
      <section className={styles.hero}>
        <div className={`${styles.heroInner} container`}>
          <div className={styles.heroContent}>
            <span className={styles.heroEyebrow}>Free · Accurate · Instant</span>
            <h1 className={styles.heroTitle}>Know Your Body.<br />Track Your Health.</h1>
            <p className={styles.heroSubtitle}>
              FitMetrics gives you five essential health calculators built on
              established formulas used by doctors, dietitians, and fitness
              professionals worldwide.
            </p>
            <Link href="#calculators" className={styles.heroCta}>
              Get Started
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="m6 9 6 6 6-6" />
              </svg>
            </Link>

            <div className={styles.heroStats}>
              <div className={styles.heroStat}>
                <span className={styles.heroStatNum}>5</span>
                <span className={styles.heroStatLabel}>Calculators</span>
              </div>
              <div className={styles.heroStat}>
                <span className={styles.heroStatNum}>100%</span>
                <span className={styles.heroStatLabel}>Free</span>
              </div>
              <div className={styles.heroStat}>
                <span className={styles.heroStatNum}>0</span>
                <span className={styles.heroStatLabel}>Sign-up Required</span>
              </div>
            </div>
          </div>

          <div className={styles.heroVisual}>
            <Image
              src="/hero-illustration.svg"
              alt="Health metrics dashboard"
              width={480}
              height={400}
              priority
              className={styles.heroIllustration}
            />
          </div>
        </div>
      </section>

      {/* ── Calculators ── */}
      <section id="calculators" className={styles.section}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Choose a Calculator</h2>
            <p className={styles.sectionSubtitle}>Select any calculator to get your result instantly</p>
          </div>

          <div className={styles.cardsGrid}>
            {calculators.items.map(calc => (
              <Link key={calc.id} href={`/${calc.slug}`} className={styles.card}>
                <Image
                  src={calc.iconSrc}
                  alt={calc.title}
                  width={48}
                  height={48}
                  className={styles.cardIcon}
                />
                <span className={styles.cardTitle}>{calc.title}</span>
                <p className={styles.cardDesc}>{calc.shortDesc}</p>
                <span className={styles.cardLink}>Calculate now →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <hr className={styles.divider} />

      {/* ── Benefits ── */}
      <section className={styles.section}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Why Use FitMetrics?</h2>
            <p className={styles.sectionSubtitle}>Built for accuracy, simplicity, and your privacy</p>
          </div>

          <div className={styles.benefitsGrid}>
            {BENEFITS.map(b => (
              <div key={b.title} className={styles.benefit}>
                <span className={styles.benefitIcon}>{b.icon}</span>
                <p className={styles.benefitTitle}>{b.title}</p>
                <p className={styles.benefitDesc}>{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <hr className={styles.divider} />

      {/* ── Disclaimer ── */}
      <div className={styles.disclaimer}>
        <div className="container">
          <div className={styles.disclaimerBox}>
            <p className={styles.disclaimerTitle}>Medical Disclaimer</p>
            <p className={styles.disclaimerText}>
              The calculators on FitMetrics are for informational and educational purposes only.
              Results are estimates based on population averages and standard clinical formulas.
              They do not constitute medical advice and should not replace consultation with a
              qualified healthcare professional. Always consult a doctor, dietitian, or certified
              fitness professional before making changes to your diet, exercise routine, or health regimen.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
