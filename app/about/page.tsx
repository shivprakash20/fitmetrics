import styles from './page.module.scss';
import calculators from '@/data/calculators.json';

export default function AboutPage() {
  const { page, items } = calculators;

  return (
    <main className={styles.main}>
      <div className="container">

        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>{page.title}</h1>
          <p className={styles.pageSubtitle}>{page.subtitle}</p>
        </div>

        <div className={styles.cards}>
          {items.map(calc => (
            <article key={calc.id} className={styles.card}>

              <div className={styles.cardHeader}>
                <span className={styles.icon}>{calc.icon}</span>
                <div>
                  <h2 className={styles.cardTitle}>{calc.title}</h2>
                  <p className={styles.cardTagline}>{calc.tagline}</p>
                </div>
              </div>

              <p className={styles.description}>{calc.description}</p>

              <div className={styles.formulaBox}>
                <span className={styles.formulaLabel}>Formula</span>
                <pre className={styles.formula}>{calc.formula}</pre>
              </div>

              {calc.ranges.length > 0 && (
                <div className={styles.rangesSection}>
                  <span className={styles.rangesLabel}>Reference Ranges</span>
                  <div className={styles.ranges}>
                    {calc.ranges.map(r => (
                      <div key={r.label} className={styles.rangeItem}>
                        <span className={styles.rangeDot} style={{ background: r.color }} />
                        <span className={styles.rangeLabel}>{r.label}</span>
                        <span className={styles.rangeValue}>{r.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className={styles.note}>
                <span className={styles.noteIcon}>ℹ</span>
                <span>{calc.note}</span>
              </div>

              <div className={styles.source}>
                Source: {calc.source}
              </div>

            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
