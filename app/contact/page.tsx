import { contactAction } from './actions';
import styles from '@/app/(auth)/auth.module.scss';

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
          <h1 className={styles.title}>Contact Us</h1>
          <p className={styles.subtitle}>
            Have a question or feedback? Fill in the form and we will get back to you.
          </p>

          {success && (
            <p className={`${styles.message} ${styles.messageInfo}`}>
              Thanks for reaching out! We have received your message.
            </p>
          )}
          {error && (
            <p className={`${styles.message} ${styles.messageError}`}>{error}</p>
          )}

          {!success && (
            <form action={contactAction} className={styles.form}>
              <div className={styles.row}>
                <label htmlFor="name" className={styles.label}>Name</label>
                <input
                  id="name"
                  name="name"
                  className={styles.input}
                  defaultValue={name}
                  required
                />
              </div>

              <div className={styles.row}>
                <label htmlFor="email" className={styles.label}>Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className={styles.input}
                  defaultValue={email}
                  required
                />
              </div>

              <div className={styles.row}>
                <label htmlFor="message" className={styles.label}>Message</label>
                <textarea
                  id="message"
                  name="message"
                  className={styles.input}
                  rows={5}
                  defaultValue={message}
                  required
                />
              </div>

              <button type="submit" className={styles.submitBtn}>Send Message</button>
            </form>
          )}
        </section>
      </div>
    </main>
  );
}
