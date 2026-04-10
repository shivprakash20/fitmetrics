'use client';

import { useState } from 'react';
import styles from './auth.module.scss';

interface Flash {
  type: 'error' | 'info';
  message: string;
}

function readAndClearFlash(): Flash | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(/(?:^|;\s*)oauth_flash=([^;]+)/);
  if (!match) return null;
  document.cookie = 'oauth_flash=; max-age=0; path=/';
  try {
    return JSON.parse(decodeURIComponent(match[1])) as Flash;
  } catch {
    return null;
  }
}

export default function OAuthFlash() {
  const [flash] = useState<Flash | null>(readAndClearFlash);

  // suppressHydrationWarning: server always renders empty (no document),
  // client may render the flash message — React skips the mismatch check.
  return (
    <div suppressHydrationWarning>
      {flash && (
        <p className={`${styles.message} ${flash.type === 'error' ? styles.messageError : styles.messageInfo}`}>
          {flash.message}
        </p>
      )}
    </div>
  );
}
