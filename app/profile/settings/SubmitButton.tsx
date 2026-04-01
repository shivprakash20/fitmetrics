'use client';

import { useFormStatus } from 'react-dom';
import styles from './page.module.scss';

export default function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();

  return (
    <button type="submit" className={styles.submitBtn} disabled={pending}>
      {pending ? 'Saving...' : label}
    </button>
  );
}
