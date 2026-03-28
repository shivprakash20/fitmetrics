'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Navbar.module.scss';
import { useTheme, type Theme } from '@/components/ThemeProvider';

const THEMES: { id: Theme; icon: string; label: string }[] = [
  { id: 'dark',  icon: '☽', label: 'Dark'  },
  { id: 'light', icon: '☀', label: 'Light' },
  { id: 'neon',  icon: '⚡', label: 'Neon'  },
];

export default function Navbar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  return (
    <header className={styles.header}>
      <nav className={`${styles.nav} container`}>

        <Link href="/calculator" className={styles.logo}>
          <span className={styles.logoIcon}>⚖</span>
          <span>FitMetrics</span>
        </Link>

        <div className={styles.right}>
          <ul className={styles.links}>
            <li>
              <Link
                href="/calculator"
                className={`${styles.link} ${pathname === '/calculator' ? styles.active : ''}`}
              >
                Calculator
              </Link>
            </li>
            <li>
              <Link
                href="/about"
                className={`${styles.link} ${pathname === '/about' ? styles.active : ''}`}
              >
                About
              </Link>
            </li>
            <li>
              <Link
                href="/profile"
                className={`${styles.link} ${pathname === '/profile' ? styles.active : ''}`}
              >
                Profile
              </Link>
            </li>
            <li>
              <Link
                href="/login"
                className={`${styles.link} ${pathname === '/login' ? styles.active : ''}`}
              >
                Login
              </Link>
            </li>
            <li>
              <Link
                href="/register"
                className={`${styles.link} ${pathname === '/register' ? styles.active : ''}`}
              >
                Register
              </Link>
            </li>
          </ul>

          <div className={styles.themeToggle} role="group" aria-label="Select colour theme">
            {THEMES.map(t => (
              <button
                key={t.id}
                className={`${styles.themeBtn} ${theme === t.id ? styles.themeBtnActive : ''}`}
                onClick={() => setTheme(t.id)}
                aria-pressed={theme === t.id}
                title={`${t.label} theme`}
              >
                <span>{t.icon}</span>
                <span className={styles.themeBtnLabel}>{t.label}</span>
              </button>
            ))}
          </div>
        </div>

      </nav>
    </header>
  );
}
