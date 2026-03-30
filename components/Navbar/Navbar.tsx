'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import styles from './Navbar.module.scss';
import { useTheme, type Theme } from '@/components/ThemeProvider';
import { logoutAction } from '@/app/(auth)/actions';
import navigation from '@/data/navigation.json';

type NavbarProps = {
  user: { firstName: string } | null;
};

export default function Navbar({ user }: NavbarProps) {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [calcMenuOpen, setCalcMenuOpen]  = useState(false);
  const [userMenuOpen, setUserMenuOpen]  = useState(false);
  const [themeMenuOpen, setThemeMenuOpen] = useState(false);
  const calcMenuRef  = useRef<HTMLDivElement>(null);
  const userMenuRef  = useRef<HTMLDivElement>(null);
  const themeMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (calcMenuRef.current  && !calcMenuRef.current.contains(e.target as Node))  setCalcMenuOpen(false);
      if (userMenuRef.current  && !userMenuRef.current.contains(e.target as Node))  setUserMenuOpen(false);
      if (themeMenuRef.current && !themeMenuRef.current.contains(e.target as Node)) setThemeMenuOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentTheme = navigation.themes.find(t => t.id === theme);
  const calcSlugs = navigation.calculators.items.map(c => c.href);
  const isCalcActive = calcSlugs.includes(pathname);

  return (
    <header className={styles.header}>
      <nav className={`${styles.nav} container`}>

        {/* Logo → home */}
        <Link href="/" className={styles.logo}>
          <Image src="/logo.png" alt="FitMetrics" width={180} height={60} style={{ objectFit: 'contain' }} priority />
        </Link>

        {/* Middle — nav links */}
        <ul className={styles.links}>

          {/* Calculators dropdown */}
          <li>
            <div className={styles.calcMenu} ref={calcMenuRef}>
              <button
                className={`${styles.link} ${isCalcActive ? styles.active : ''} ${styles.calcBtn}`}
                onClick={() => setCalcMenuOpen(p => !p)}
              >
                {navigation.calculators.label}
                <svg
                  className={`${styles.chevron} ${calcMenuOpen ? styles.chevronOpen : ''}`}
                  width="12" height="12" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>

              {calcMenuOpen && (
                <div className={styles.calcDropdown}>
                  {navigation.calculators.items.map(item => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`${styles.calcDropdownItem} ${pathname === item.href ? styles.calcDropdownItemActive : ''}`}
                      onClick={() => setCalcMenuOpen(false)}
                    >
                      <span className={styles.calcDropdownLabel}>{item.label}</span>
                      <span className={styles.calcDropdownDesc}>{item.desc}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </li>

          {/* Regular links */}
          {navigation.links.map(link => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`${styles.link} ${pathname === link.href ? styles.active : ''}`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right — theme + user */}
        <div className={styles.right}>

          {/* Theme dropdown */}
          <div className={styles.userMenu} ref={themeMenuRef}>
            <button
              className={`${styles.userBtn} ${themeMenuOpen ? styles.userBtnActive : ''}`}
              onClick={() => setThemeMenuOpen(p => !p)}
              aria-label="Select theme" title="Theme"
            >
              <span style={{ fontSize: '1.1rem' }}>{currentTheme?.icon}</span>
            </button>
            {themeMenuOpen && (
              <div className={styles.dropdown}>
                {navigation.themes.map(t => (
                  <button
                    key={t.id}
                    className={`${styles.dropdownItem} ${theme === t.id ? styles.dropdownItemActive : ''}`}
                    onClick={() => { setTheme(t.id as Theme); setThemeMenuOpen(false); }}
                  >
                    <span>{t.icon}</span> {t.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* User */}
          {user ? (
            <div className={styles.userMenu} ref={userMenuRef}>
              <button
                className={`${styles.userBtn} ${userMenuOpen ? styles.userBtnActive : ''}`}
                onClick={() => setUserMenuOpen(p => !p)}
                aria-expanded={userMenuOpen} aria-label="User menu"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                </svg>
                <span className={styles.userFirstName}>{user.firstName}</span>
              </button>
              {userMenuOpen && (
                <div className={styles.dropdown}>
                  <Link href={navigation.userMenu.profile.href} className={styles.dropdownItem} onClick={() => setUserMenuOpen(false)}>
                    {navigation.userMenu.profile.label}
                  </Link>
                  <div className={styles.dropdownDivider} />
                  <form action={logoutAction}>
                    <button type="submit" className={styles.dropdownItem}>{navigation.userMenu.signOut}</button>
                  </form>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login" className={styles.userBtn} aria-label="Sign in" title="Sign in">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
              </svg>
            </Link>
          )}
        </div>

      </nav>
    </header>
  );
}
