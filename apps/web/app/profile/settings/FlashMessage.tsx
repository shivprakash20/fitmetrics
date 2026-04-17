'use client';

import { useState, useEffect } from 'react';
import styles from './page.module.scss';

type FlashMessageProps = {
  type: 'info' | 'error';
  children: React.ReactNode;
};

export default function FlashMessage({ type, children }: FlashMessageProps) {
  const [fading, setFading] = useState(false);

  useEffect(() => {
    // Clean up the URL so the message doesn't persist on page reload
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      if (url.searchParams.has('message') || url.searchParams.has('error')) {
        url.searchParams.delete('message');
        url.searchParams.delete('error');
        window.history.replaceState({}, '', url.toString());
      }
    }

    const timer = setTimeout(() => setFading(true), 9000);
    return () => clearTimeout(timer);
  }, []);

  const typeClass = type === 'error' ? styles.msgError : styles.msgInfo;

  return (
    <div className={`${styles.msgWrap} ${fading ? styles.msgWrapFading : ''}`}>
      <p className={`${styles.msg} ${typeClass}`}>
        {children}
      </p>
    </div>
  );
}
