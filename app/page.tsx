import Link from 'next/link';
import Image from 'next/image';
import calculators from '@/data/calculators.json';
import navigation from '@/data/navigation.json';
import home from '@/data/home.json';
import styles from './page.module.scss';

export const metadata = {
  title: home.metadata.title,
  description: home.metadata.description,
};

export default function HomePage() {
  // Build a map of calc id → href from navigation so links stay in sync
  const calcHrefMap = Object.fromEntries(
    navigation.calculators.items.map(item => [
      item.href.split('/').pop()!, // e.g. "bmi"
      item.href,                   // e.g. "/calculator/bmi"
    ])
  );

  return (
    <>
      {/* ── Hero ── */}
      <section className={styles.hero}>
        <div className={`${styles.heroInner} container`}>
          <div className={styles.heroContent}>
            <span className={styles.heroEyebrow}>{home.hero.eyebrow}</span>
            <h1 className={styles.heroTitle}>
              {home.hero.title}<br />{home.hero.titleAccent}
            </h1>
            <p className={styles.heroSubtitle}>{home.hero.subtitle}</p>
            <Link href={home.hero.ctaHref} className={styles.heroCta}>
              {home.hero.cta}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="m6 9 6 6 6-6" />
              </svg>
            </Link>

            <div className={styles.heroStats}>
              {home.hero.stats.map(stat => (
                <div key={stat.label} className={styles.heroStat}>
                  <span className={styles.heroStatNum}>{stat.value}</span>
                  <span className={styles.heroStatLabel}>{stat.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.heroVisual}>
            <Image
              src={home.hero.illustration.src}
              alt={home.hero.illustration.alt}
              width={home.hero.illustration.width}
              height={home.hero.illustration.height}
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
            <h2 className={styles.sectionTitle}>{home.calculatorsSection.title}</h2>
            <p className={styles.sectionSubtitle}>{home.calculatorsSection.subtitle}</p>
          </div>

          <div className={styles.cardsGrid}>
            {calculators.items.map(calc => (
              <Link key={calc.id} href={calcHrefMap[calc.slug] ?? `/${calc.slug}`} className={styles.card}>
                <Image
                  src={calc.iconSrc}
                  alt={calc.title}
                  width={48}
                  height={48}
                  className={styles.cardIcon}
                />
                <span className={styles.cardTitle}>{calc.title}</span>
                <p className={styles.cardDesc}>{calc.shortDesc}</p>
                <span className={styles.cardLink}>{home.calculatorsSection.cardCta}</span>
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
            <h2 className={styles.sectionTitle}>{home.benefitsSection.title}</h2>
            <p className={styles.sectionSubtitle}>{home.benefitsSection.subtitle}</p>
          </div>

          <div className={styles.benefitsGrid}>
            {home.benefitsSection.items.map(b => (
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
            <p className={styles.disclaimerTitle}>{home.disclaimer.title}</p>
            <p className={styles.disclaimerText}>{home.disclaimer.text}</p>
          </div>
        </div>
      </div>
    </>
  );
}
