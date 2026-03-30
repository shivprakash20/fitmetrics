import { contactAction } from './actions';
import styles from '@/app/(auth)/auth.module.scss';
import contact from '@/data/contact.json';

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function getValue(params: Record<string, string | string[] | undefined>, key: string): string {
  const v = params[key];
  return typeof v === 'string' ? v : '';
}

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
        <section className={styles.card}>
          <h1 className={styles.title}>{contact.title}</h1>
          <p className={styles.subtitle}>{contact.subtitle}</p>

          {success && (
            <p className={`${styles.message} ${styles.messageInfo}`}>
              {contact.successMessage}
            </p>
          )}
          {error && (
            <p className={`${styles.message} ${styles.messageError}`}>{error}</p>
          )}

          {!success && (
            <form action={contactAction} className={styles.form}>
              <div className={styles.row}>
                <label htmlFor="name" className={styles.label}>{contact.fields.name.label}</label>
                <input id="name" name="name" className={styles.input} defaultValue={name} required />
              </div>

              <div className={styles.row}>
                <label htmlFor="email" className={styles.label}>{contact.fields.email.label}</label>
                <input id="email" name="email" type="email" className={styles.input} defaultValue={email} required />
              </div>

              <div className={styles.row}>
                <label htmlFor="message" className={styles.label}>{contact.fields.message.label}</label>
                <textarea id="message" name="message" className={styles.input} rows={5} defaultValue={message} required />
              </div>

              <button type="submit" className={styles.submitBtn}>{contact.submitButton}</button>
            </form>
          )}
        </section>
      </div>
    </main>
  );
}
