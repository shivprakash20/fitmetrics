import Link from 'next/link';
import Image from 'next/image';
import calculators from '@/data/calculators.json';
import styles from './page.module.scss';

export const metadata = {
  title: 'About Health Calculators — Why They Matter | FitMetrics',
  description: 'Learn why BMI, BMR, IBW, Body Fat, and TDEE calculators are essential for your health. Understand what each metric means and how it helps you.',
};

export default function AboutPage() {
  return (
    <main className={styles.main}>
      <div className="container">

        {/* Banner */}
        <div className={styles.banner}>
          <p className={styles.bannerEyebrow}>Why It Matters</p>
          <h1 className={styles.bannerTitle}>Your Health,<br />Measured & Understood</h1>
          <p className={styles.bannerSubtitle}>
            Numbers alone do not tell the whole story. Understanding what each health metric
            means — and how it applies to your daily life — is the first step toward lasting
            well-being. Here is why these five calculators matter.
          </p>
        </div>

        {/* Calculator importance cards */}
        <div className={styles.cards}>
          {calculators.items.map((calc, i) => (
            <article key={calc.id} className={`${styles.card} ${i % 2 !== 0 ? styles.cardReverse : ''}`}>

              <div className={styles.cardVisual}>
                <Image
                  src={calc.iconSrc}
                  alt={calc.title}
                  width={56}
                  height={56}
                  className={styles.cardIcon}
                />
                <span className={styles.cardBadge}>{calc.title}</span>
              </div>

              <div className={styles.cardContent}>
                <h2 className={styles.cardTitle}>{calc.fullTitle}</h2>
                <p className={styles.cardTagline}>{calc.tagline}</p>
                <p className={styles.cardImportance}>{calc.importance}</p>
                <Link href={`/${calc.slug}`} className={styles.cardCta}>
                  Open {calc.title} →
                </Link>
              </div>

            </article>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className={styles.bottomCta}>
          <h2 className={styles.bottomCtaTitle}>Ready to measure what matters?</h2>
          <p className={styles.bottomCtaSubtitle}>All five calculators are free — no sign-up required.</p>
          <Link href="/" className={styles.bottomCtaBtn}>View All Calculators</Link>
        </div>

      </div>
    </main>
  );
}
