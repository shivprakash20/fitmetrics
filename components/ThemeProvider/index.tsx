'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

export type Theme = 'dark' | 'light' | 'neon';

interface ThemeCtx {
  theme: Theme;
  setTheme: (t: Theme) => void;
}

const Ctx = createContext<ThemeCtx>({ theme: 'dark', setTheme: () => {} });

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('dark');

  // Sync state with whatever the inline script already set on <html>
  useEffect(() => {
    const stored = (localStorage.getItem('fitmetrics-theme') as Theme) || 'dark';
    setThemeState(stored);
  }, []);

  function setTheme(t: Theme) {
    setThemeState(t);
    localStorage.setItem('fitmetrics-theme', t);
    document.documentElement.setAttribute('data-theme', t);
  }

  return <Ctx.Provider value={{ theme, setTheme }}>{children}</Ctx.Provider>;
}

export const useTheme = () => useContext(Ctx);
