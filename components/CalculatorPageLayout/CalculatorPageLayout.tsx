'use client';

import { useState } from 'react';
import Image from 'next/image';
import CalculatorWidget from '@/components/CalculatorWidget/CalculatorWidget';
import type { CalculatorType } from '@/types';
import styles from './CalculatorPageLayout.module.scss';

type Range = { label: string; value: string; color: string };
type FAQ = { q: string; a: string };
type HealthRiskItem = { condition: string; desc: string };
type LimitationItem = { title: string; desc: string };
type ActivityItem = { level: string; multiplier: string; desc: string; examples: string[] };

type Props = {
  id: CalculatorType;
  icon: string;
  iconSrc: string;
  title: string;
  tagline: string;
  description: string;
  formula: string;
  ranges: Range[];
  note: string;
  source: string;
  faq: FAQ[];
  activityGuide?: {
    title: string;
    intro: string;
    items: ActivityItem[];
  };
  healthRisks?: {
    title: string;
    intro: string;
    overweightItems: HealthRiskItem[];
    underweightNote: string;
  };
  limitations?: {
    title: string;
    intro: string;
    items: LimitationItem[];
  };
};

function FAQItem({ q, a }: FAQ) {
  const [open, setOpen] = useState(false);
  return (
    <div className={styles.faqItem}>
      <button className={styles.faqQuestion} onClick={() => setOpen(o => !o)}>
        <span>{q}</span>
        <svg
          className={`${styles.faqChevron} ${open ? styles.faqChevronOpen : ''}`}
          width="16" height="16" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
      {open && <p className={styles.faqAnswer}>{a}</p>}
    </div>
  );
}

export default function CalculatorPageLayout({
  id, iconSrc, title, tagline, description, formula, ranges, note, source, faq,
  activityGuide, healthRisks, limitations,
}: Props) {
  return (
    <main className={styles.main}>
      <div className="container">

        {/* Page header */}
        <div className={styles.pageHeader}>
          <Image src={iconSrc} alt={title} width={56} height={56} className={styles.icon} />
          <h1 className={styles.pageTitle}>{title}</h1>
          <p className={styles.pageTagline}>{tagline}</p>
        </div>

        {/* Interactive calculator */}
        <CalculatorWidget type={id} />

        {/* About section */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>About {title}</h2>

          <p className={styles.description}>{description}</p>

          <div className={styles.formulaBox}>
            <span className={styles.formulaLabel}>Formula</span>
            <pre className={styles.formula}>{formula}</pre>
          </div>

          {ranges.length > 0 && (
            <div className={styles.rangesGrid}>
              {ranges.map(r => (
                <div key={r.label} className={styles.rangeItem}>
                  <span className={styles.rangeDot} style={{ background: r.color }} />
                  <span className={styles.rangeLabel}>{r.label}</span>
                  <span className={styles.rangeValue}>{r.value}</span>
                </div>
              ))}
            </div>
          )}

          <div className={styles.note} style={{ marginTop: ranges.length > 0 ? '16px' : 0 }}>
            <span className={styles.noteIcon}>ℹ</span>
            <span>{note}</span>
          </div>

          <p className={styles.source}>Source: {source}</p>
        </section>

        {/* Activity Guide section — optional, currently used by BMR */}
        {activityGuide && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>{activityGuide.title}</h2>
            <p className={styles.description}>{activityGuide.intro}</p>
            <div className={styles.activityList}>
              {activityGuide.items.map(item => (
                <div key={item.level} className={styles.activityItem}>
                  <div className={styles.activityMultiplier}>{item.multiplier}</div>
                  <div className={styles.activityContent}>
                    <p className={styles.activityLevel}>{item.level}</p>
                    <p className={styles.activityDesc}>{item.desc}</p>
                    <div className={styles.activityExamples}>
                      {item.examples.map(ex => (
                        <span key={ex} className={styles.activityTag}>{ex}</span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Health Risks section — optional, currently used by BMI */}
        {healthRisks && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>{healthRisks.title}</h2>
            <p className={styles.description}>{healthRisks.intro}</p>

            <div className={styles.risksGrid}>
              {healthRisks.overweightItems.map((item, i) => (
                <div key={item.condition} className={styles.riskCard}>
                  <span className={styles.riskNum}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <p className={styles.riskCondition}>{item.condition}</p>
                  <p className={styles.riskDesc}>{item.desc}</p>
                </div>
              ))}
            </div>

            <div className={styles.note} style={{ marginTop: '20px' }}>
              <span className={styles.noteIcon}>ℹ</span>
              <span>{healthRisks.underweightNote}</span>
            </div>
          </section>
        )}

        {/* Limitations section — optional, currently used by BMI */}
        {limitations && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>{limitations.title}</h2>
            <p className={styles.description}>{limitations.intro}</p>

            <div className={styles.limitationsList}>
              {limitations.items.map((item, i) => (
                <div key={item.title} className={styles.limitationItem}>
                  <div className={styles.limitationHeader}>
                    <span className={styles.limitationNum}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <p className={styles.limitationTitle}>{item.title}</p>
                  </div>
                  <p className={styles.limitationDesc}>{item.desc}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* FAQ section */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Frequently Asked Questions</h2>
          <div className={styles.faqList}>
            {faq.map((item, i) => <FAQItem key={i} {...item} />)}
          </div>
        </section>

      </div>
    </main>
  );
}
