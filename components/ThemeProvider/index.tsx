'use client';

import { createContext, useCallback, useContext, useSyncExternalStore, type ReactNode } from 'react';

export type Theme = 'dark' | 'light' | 'neon';

interface ThemeCtx {
  theme: Theme;
  setTheme: (t: Theme) => void;
}

const Ctx = createContext<ThemeCtx>({ theme: 'dark', setTheme: () => {} });

const STORAGE_KEY = 'fitmetrics-theme';
const EVENT = 'fitmetrics-theme-change';

function subscribe(cb: () => void) {
  window.addEventListener(EVENT, cb);
  return () => window.removeEventListener(EVENT, cb);
}

function getSnapshot(): Theme {
  return (localStorage.getItem(STORAGE_KEY) as Theme) || 'dark';
}

function getServerSnapshot(): Theme {
  return 'dark';
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setTheme = useCallback((t: Theme) => {
    localStorage.setItem(STORAGE_KEY, t);
    document.documentElement.setAttribute('data-theme', t);
    window.dispatchEvent(new Event(EVENT));
  }, []);

  return <Ctx.Provider value={{ theme, setTheme }}>{children}</Ctx.Provider>;
}

export const useTheme = () => useContext(Ctx);
