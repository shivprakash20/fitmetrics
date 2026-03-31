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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const calcMenuRef  = useRef<HTMLDivElement>(null);
  const userMenuRef  = useRef<HTMLDivElement>(null);
  const themeMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (calcMenuRef.current  && !calcMenuRef.current.contains(e.target as Node))  setCalcMenuOpen(false);
      if (userMenuRef.current  && !userMenuRef.current.contains(e.target as Node))  setUserMenuOpen(false);
      if (themeMenuRef.current && !themeMenuRef.current.contains(e.target as Node)) setThemeMenuOpen(false);
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) setMobileMenuOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!mobileMenuOpen) return;

    const prevOverflow = document.body.style.overflow;
    const prevTouchAction = document.body.style.touchAction;
    document.body.style.overflow = 'hidden';
    document.body.style.touchAction = 'none';

    return () => {
      document.body.style.overflow = prevOverflow;
      document.body.style.touchAction = prevTouchAction;
    };
  }, [mobileMenuOpen]);

  const currentTheme = navigation.themes.find(t => t.id === theme);
  const calcSlugs = navigation.calculators.items.map(c => c.href);
  const calculatorGroups = [
    {
      title: 'Body Metrics',
      hrefs: ['/calculator/bmi', '/calculator/bmr', '/calculator/ibw', '/calculator/body-fat', '/calculator/body-type'],
    },
    {
      title: 'Energy Planning',
      hrefs: ['/calculator/tdee', '/calculator/calorie-intake', '/calculator/weight-loss', '/calculator/weight-gain', '/calculator/carbohydrate', '/calculator/protein'],
    },
    {
      title: 'Activity & Hydration',
      hrefs: ['/calculator/calories-burned', '/calculator/water'],
    },
  ].map(group => ({
    ...group,
    items: navigation.calculators.items.filter(item => group.hrefs.includes(item.href)),
  }));

  const logoSrc = theme === 'light' ? '/logo-light.svg'
    : theme === 'teal'  ? '/logo-teal.svg'
    : '/logo-dark.svg';
  const isCalcActive = calcSlugs.includes(pathname);

  return (
    <header className={styles.header} ref={headerRef}>
      <nav className={`${styles.nav} container`}>

        {/* Logo → home */}
        <Link href="/" className={styles.logo} onClick={() => setMobileMenuOpen(false)}>
          <Image
            src={logoSrc}
            alt="FitMetrics"
            width={300}
            height={60}
            className={styles.logoImage}
            priority
          />
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
                  <div className={styles.calcDropdownHeader}>
                    <p className={styles.calcDropdownTitle}>All Calculators</p>
                    <p className={styles.calcDropdownSub}>Choose a tool based on your health goal</p>
                  </div>
                  <div className={styles.calcDropdownGrid}>
                    {calculatorGroups.map(group => (
                      <section key={group.title} className={styles.calcDropdownCol}>
                        <p className={styles.calcDropdownColTitle}>{group.title}</p>
                        <div className={styles.calcDropdownList}>
                          {group.items.map(item => (
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
                      </section>
                    ))}
                  </div>
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
                onClick={() => {
                  setCalcMenuOpen(false);
                  setUserMenuOpen(false);
                  setThemeMenuOpen(false);
                  setMobileMenuOpen(false);
                }}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right — theme + user */}
        <div className={styles.right}>
          <button
            className={`${styles.mobileToggle} ${mobileMenuOpen ? styles.mobileToggleActive : ''}`}
            onClick={() => setMobileMenuOpen(p => !p)}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-nav-menu"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              {mobileMenuOpen ? (
                <path d="M18 6 6 18M6 6l12 12" />
              ) : (
                <path d="M3 6h18M3 12h18M3 18h18" />
              )}
            </svg>
          </button>

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

      {mobileMenuOpen && (
        <div id="mobile-nav-menu" className={styles.mobileMenu}>
          <div className={`${styles.mobileMenuInner} container`}>
            <p className={styles.mobileSectionTitle}>{navigation.calculators.label}</p>
            <div className={styles.mobileLinks}>
              {navigation.calculators.items.map(item => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`${styles.mobileLink} ${pathname === item.href ? styles.mobileLinkActive : ''}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className={styles.mobileLinkTitle}>{item.label}</span>
                  <span className={styles.mobileLinkDesc}>{item.desc}</span>
                </Link>
              ))}
            </div>

            <p className={styles.mobileSectionTitle}>Pages</p>
            <div className={styles.mobileLinks}>
              {navigation.links.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`${styles.mobileLink} ${pathname === link.href ? styles.mobileLinkActive : ''}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className={styles.mobileLinkTitle}>{link.label}</span>
                </Link>
              ))}

              {user ? (
                <>
                  <Link
                    href={navigation.userMenu.profile.href}
                    className={`${styles.mobileLink} ${pathname === navigation.userMenu.profile.href ? styles.mobileLinkActive : ''}`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span className={styles.mobileLinkTitle}>{navigation.userMenu.profile.label}</span>
                  </Link>
                  <form action={logoutAction}>
                    <button type="submit" className={styles.mobileAction}>{navigation.userMenu.signOut}</button>
                  </form>
                </>
              ) : (
                <Link
                  href="/login"
                  className={`${styles.mobileLink} ${pathname === '/login' ? styles.mobileLinkActive : ''}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className={styles.mobileLinkTitle}>Sign in</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
