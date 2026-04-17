import type { Metadata } from 'next';
import Link from 'next/link';
import { contactAction } from './actions';
import contact from '@/data/contact.json';
import styles from './page.module.scss';

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function getValue(p: Record<string, string | string[] | undefined>, key: string): string {
  const v = p[key]; return typeof v === 'string' ? v : '';
}

export const metadata: Metadata = {
  title: contact.metadata.title,
  description: contact.metadata.description,
};

function InfoIcon({ type }: { type: string }) {
  if (type === 'email') return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
    </svg>
  );
  if (type === 'phone') return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.06 6.06l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
    </svg>
  );
  if (type === 'location') return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>
    </svg>
  );
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
  );
}

export default async function ContactPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const success = getValue(params, 'success') === 'true';
  const error   = getValue(params, 'error');
  const name    = getValue(params, 'name');
  const email   = getValue(params, 'email');
  const topic   = getValue(params, 'topic');
  const message = getValue(params, 'message');

  return (
    <main className={styles.page}>

      {/* ── Hero Banner ─────────────────────────────────────────────── */}
      <section className={styles.hero}>
        <div className="container">
          <span className={styles.eyebrow}>{contact.hero.eyebrow}</span>
          <h1 className={styles.heroTitle}>{contact.hero.title}</h1>
          <p className={styles.heroSubtitle}>{contact.hero.subtitle}</p>
        </div>
      </section>

      {/* ── Two-column main ────────────────────────────────────────── */}
      <div className="container">
        <div className={styles.twoCol}>

          {/* LEFT — Form */}
          <section className={styles.card}>
            <h2 className={styles.cardTitle}>{contact.form.title}</h2>
            <p className={styles.cardSubtitle}>{contact.form.subtitle}</p>

            {success && (
              <div className={styles.successBanner} role="status">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
                <span>{contact.form.successMessage}</span>
              </div>
            )}
            {error && (
              <div className={styles.errorBanner} role="alert">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/>
                </svg>
                <span>{error}</span>
              </div>
            )}

            {!success ? (
              <form action={contactAction} className={styles.form}>
                <div className={styles.formRow2}>
                  <div className={styles.fieldGroup}>
                    <label htmlFor="name" className={styles.label}>{contact.form.fields.name.label}</label>
                    <input id="name" name="name" className={styles.input} placeholder={contact.form.fields.name.placeholder} defaultValue={name} autoComplete="name" required />
                  </div>
                  <div className={styles.fieldGroup}>
                    <label htmlFor="email" className={styles.label}>{contact.form.fields.email.label}</label>
                    <input id="email" name="email" type="email" className={styles.input} placeholder={contact.form.fields.email.placeholder} defaultValue={email} autoComplete="email" required />
                  </div>
                </div>

                <div className={styles.fieldGroup}>
                  <label htmlFor="topic" className={styles.label}>{contact.form.fields.topic.label}</label>
                  <select id="topic" name="topic" className={styles.select} defaultValue={topic}>
                    <option value="">Select a topic…</option>
                    {contact.form.topics.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>

                <div className={styles.fieldGroup}>
                  <label htmlFor="message" className={styles.label}>{contact.form.fields.message.label}</label>
                  <textarea id="message" name="message" className={styles.textarea} placeholder={contact.form.fields.message.placeholder} defaultValue={message} required />
                </div>

                <button type="submit" className={styles.submitBtn}>
                  {contact.form.submitButton}
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="22" x2="11" y1="2" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                  </svg>
                </button>

                <p className={styles.formNote}>{contact.form.note}</p>
              </form>
            ) : (
              <div className={styles.successActions}>
                <Link href="/contact" className={styles.retryBtn}>Send another message</Link>
                <Link href="/" className={styles.homeBtn}>Back to home</Link>
              </div>
            )}
          </section>

          {/* RIGHT — Info + Map */}
          <aside className={styles.sidebar}>

            {/* Contact info card */}
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>{contact.info.title}</h2>
              <div className={styles.infoList}>
                {contact.info.items.map(item => (
                  <div key={item.type} className={styles.infoItem}>
                    <div className={styles.infoIcon}>
                      <InfoIcon type={item.type} />
                    </div>
                    <div className={styles.infoBody}>
                      <p className={styles.infoLabel}>{item.label}</p>
                      {item.href ? (
                        <a href={item.href} className={styles.infoValue} target={item.type === 'location' ? '_blank' : undefined} rel="noopener noreferrer">
                          {item.value}
                        </a>
                      ) : (
                        <p className={styles.infoValue}>{item.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Map card */}
            <div className={styles.mapCard}>
              <div className={styles.mapHeader}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>
                </svg>
                <span>Varanasi, India</span>
                <a href={contact.info.mapExternalUrl} target="_blank" rel="noopener noreferrer" className={styles.mapExtLink}>
                  Open in Maps
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" x2="21" y1="14" y2="3"/>
                  </svg>
                </a>
              </div>
              <div className={styles.mapFrame}>
                <iframe
                  src={contact.info.mapEmbedUrl}
                  loading="lazy"
                  title="FitMetrics — Varanasi, India"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>

          </aside>
        </div>

      </div>
    </main>
  );
}
