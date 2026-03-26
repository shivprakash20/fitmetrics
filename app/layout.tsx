import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.scss';
import Navbar from '@/components/Navbar/Navbar';
import { ThemeProvider } from '@/components/ThemeProvider';

export const metadata: Metadata = {
  title: 'FitMetrics — Health Calculators',
  description: 'Calculate BMI, BMR, Ideal Body Weight, Body Fat %, and TDEE using clinically validated formulas.',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    // suppressHydrationWarning prevents React from warning about the
    // data-theme mismatch that occurs when the inline script overrides
    // the server-rendered default before hydration.
    <html lang="en" data-theme="dark" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body>
        {/* Runs before React hydrates — prevents flash of wrong theme */}
        <Script id="theme-init" strategy="beforeInteractive">{`
          (function () {
            try {
              var t = localStorage.getItem('fitmetrics-theme') || 'dark';
              document.documentElement.setAttribute('data-theme', t);
            } catch (e) {}
          })();
        `}</Script>
        <ThemeProvider>
          <Navbar />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
