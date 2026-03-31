import type { Metadata } from 'next';
import Link from 'next/link';
import { contactAction } from './actions';
import contact from '@/data/contact.json';
import styles from './page.module.scss';

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function getValue(params: Record<string, string | string[] | undefined>, key: string): string {
  const v = params[key];
  return typeof v === 'string' ? v : '';
}

export const metadata: Metadata = {
  title: contact.metadata.title,
  description: contact.metadata.description,
};

export default async function ContactPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const success = getValue(params, 'success') === 'true';
  const error = getValue(params, 'error');
  const name = getValue(params, 'name');
  const email = getValue(params, 'email');
  const message = getValue(params, 'message');

  return (
    <main className={styles.page}>
      <div className="container">
        <section className={styles.heroPanel}>
          <p className={styles.heroEyebrow}>{contact.hero.eyebrow}</p>
          <h1 className={styles.heroTitle}>{contact.hero.title}</h1>
          <p className={styles.heroSubtitle}>{contact.hero.subtitle}</p>

          <div className={styles.statGrid}>
            {contact.highlights.map(item => (
              <article key={`${item.label}-${item.value}`} className={styles.statItem}>
                <span className={styles.statLabel}>{item.label}</span>
                <p className={styles.statValue}>{item.value}</p>
              </article>
            ))}
          </div>
        </section>

        <div className={styles.contentGrid}>
          <section className={styles.formShell}>
            <h2 className={styles.sectionTitle}>{contact.formCard.title}</h2>
            <p className={styles.sectionSubtitle}>{contact.formCard.subtitle}</p>

            {success && (
              <p className={`${styles.message} ${styles.messageInfo}`} role="status">
                {contact.successMessage}
              </p>
            )}
            {error && (
              <p className={`${styles.message} ${styles.messageError}`} role="alert">
                {error}
              </p>
            )}

            {!success ? (
              <form action={contactAction} className={styles.form}>
                <div className={styles.row}>
                  <label htmlFor="name" className={styles.label}>
                    {contact.fields.name.label}
                  </label>
                  <input
                    id="name"
                    name="name"
                    className={styles.input}
                    defaultValue={name}
                    autoComplete="name"
                    required
                  />
                </div>

                <div className={styles.row}>
                  <label htmlFor="email" className={styles.label}>
                    {contact.fields.email.label}
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    className={styles.input}
                    defaultValue={email}
                    autoComplete="email"
                    required
                  />
                </div>

                <div className={styles.row}>
                  <label htmlFor="message" className={styles.label}>
                    {contact.fields.message.label}
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    className={`${styles.input} ${styles.textarea}`}
                    defaultValue={message}
                    required
                  />
                </div>

                <button type="submit" className={styles.submitBtn}>
                  {contact.submitButton}
                </button>
              </form>
            ) : (
              <div className={styles.successCard}>
                <p>{contact.formCard.responseNote}</p>
                <Link href="/contact" className={styles.secondaryAction}>
                  Send another message
                </Link>
              </div>
            )}

            {!success && <p className={styles.formNote}>{contact.formCard.responseNote}</p>}
          </section>

          <aside className={styles.channelShell}>
            <h2 className={styles.sectionTitle}>{contact.channels.title}</h2>
            <p className={styles.sectionSubtitle}>{contact.channels.subtitle}</p>

            <div className={styles.channelList}>
              {contact.channels.items.map(item => (
                <article key={item.title} className={styles.channelItem}>
                  <h3 className={styles.channelTitle}>{item.title}</h3>
                  <p className={styles.channelDesc}>{item.description}</p>
                  <span className={styles.channelValue}>{item.value}</span>
                  <a href={item.ctaHref} className={styles.channelCta}>
                    {item.ctaLabel}
                  </a>
                </article>
              ))}
            </div>
          </aside>
        </div>

        <section className={styles.officeShell}>
          <div className={styles.officeGrid}>
            <div className={styles.officeMetaWrap}>
              <h2 className={styles.sectionTitle}>{contact.office.title}</h2>
              <p className={styles.sectionSubtitle}>{contact.office.subtitle}</p>
              <span className={styles.officeBadge}>
                {contact.office.locationLabel}: {contact.office.locationValue}
              </span>

              <ul className={styles.officeLines}>
                {contact.office.addressLines.map(line => (
                  <li key={line} className={styles.officeLine}>{line}</li>
                ))}
              </ul>

              <a
                href={contact.office.mapExternalUrl}
                className={styles.mapLink}
                target="_blank"
                rel="noreferrer noopener"
              >
                Open in Google Maps
              </a>
            </div>

            <div className={styles.mapFrame}>
              <iframe
                src={contact.office.mapEmbedUrl}
                loading="lazy"
                title="FitMetrics location map"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </section>

        <section className={styles.faqShell}>
          <h2 className={styles.sectionTitle}>{contact.faq.title}</h2>
          <div className={styles.faqList}>
            {contact.faq.items.map(item => (
              <article key={item.q} className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>{item.q}</h3>
                <p className={styles.faqAnswer}>{item.a}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
