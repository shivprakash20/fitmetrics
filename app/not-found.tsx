import Link from 'next/link';
import { getCurrentUser } from '@/lib/server/auth/session';
import styles from '@/app/not-found.module.scss';

export default async function NotFoundPage() {
  const user = await getCurrentUser();

  return (
    <main className={styles.page}>
      <div className="container">
        <section className={styles.hero}>
          <div className={styles.badge}>Error 404</div>
          <h1 className={styles.title}>This page is not available.</h1>
          <p className={styles.subtitle}>
            The link may be outdated, moved, or typed incorrectly. You can continue with one of the verified pages below.
          </p>

          <div className={styles.banner}>
            <div className={styles.bannerAccent} />
            <div>
              <p className={styles.bannerTitle}>FitMetrics Navigation Recovery</p>
              <p className={styles.bannerText}>
                Use standard navigation routes to return to a valid page and continue your session securely.
              </p>
            </div>
          </div>

          <div className={styles.actions}>
            <Link href="/" className={styles.primaryBtn}>Go to Home</Link>
            <Link href={user ? '/profile' : '/contact'} className={styles.secondaryBtn}>
              {user ? 'Go to Profile' : 'Contact Us'}
            </Link>
          </div>

          <div className={styles.links}>
            <Link href="/calculator/bmi" className={styles.linkCard}>
              <span className={styles.linkTitle}>Calculators</span>
              <span className={styles.linkDesc}>Open health tools and continue planning.</span>
            </Link>
            <Link href="/about" className={styles.linkCard}>
              <span className={styles.linkTitle}>About</span>
              <span className={styles.linkDesc}>Read standards, methods, and data sources.</span>
            </Link>
            <Link href="/contact" className={styles.linkCard}>
              <span className={styles.linkTitle}>Support</span>
              <span className={styles.linkDesc}>Reach out for help with links or pages.</span>
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
