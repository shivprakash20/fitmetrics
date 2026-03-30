import Link from 'next/link';
import Image from 'next/image';
import calculators from '@/data/calculators/index.json';
import navigation from '@/data/navigation.json';
import about from '@/data/about.json';
import styles from './page.module.scss';

export const metadata = {
  title: about.metadata.title,
  description: about.metadata.description,
};

export default function AboutPage() {
  const calcHrefMap = Object.fromEntries(
    navigation.calculators.items.map(item => [
      item.href.split('/').pop()!,
      item.href,
    ])
  );

  return (
    <main className={styles.main}>
      <div className="container">

        {/* Banner */}
        <div className={styles.banner}>
          <p className={styles.bannerEyebrow}>{about.banner.eyebrow}</p>
          <h1 className={styles.bannerTitle}>{about.banner.title}<br />{about.banner.titleAccent}</h1>
          <p className={styles.bannerSubtitle}>{about.banner.subtitle}</p>
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
                <Link href={calcHrefMap[calc.slug] ?? `/calculator/${calc.slug}`} className={styles.cardCta}>
                  {about.cardCta.prefix} {calc.title} {about.cardCta.suffix}
                </Link>
              </div>

            </article>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className={styles.bottomCta}>
          <h2 className={styles.bottomCtaTitle}>{about.bottomCta.title}</h2>
          <p className={styles.bottomCtaSubtitle}>{about.bottomCta.subtitle}</p>
          <Link href={about.bottomCta.href} className={styles.bottomCtaBtn}>{about.bottomCta.button}</Link>
        </div>

      </div>
    </main>
  );
}
