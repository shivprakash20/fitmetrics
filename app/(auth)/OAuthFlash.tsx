'use client';

import { useEffect, useState } from 'react';
import styles from './auth.module.scss';

interface Flash {
  type: 'error' | 'info';
  message: string;
}

export default function OAuthFlash() {
  const [flash, setFlash] = useState<Flash | null>(null);

  useEffect(() => {
    const match = document.cookie.match(/(?:^|;\s*)oauth_flash=([^;]+)/);
    if (!match) return;

    try {
      const parsed: Flash = JSON.parse(decodeURIComponent(match[1]));
      setFlash(parsed);
    } catch {
      // malformed cookie — ignore
    }

    // Clear immediately so it never shows twice
    document.cookie = 'oauth_flash=; max-age=0; path=/';
  }, []);

  if (!flash) return null;

  return (
    <p className={`${styles.message} ${flash.type === 'error' ? styles.messageError : styles.messageInfo}`}>
      {flash.message}
    </p>
  );
}
