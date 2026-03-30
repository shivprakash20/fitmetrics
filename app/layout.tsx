import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.scss';
import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';
import { ThemeProvider } from '@/components/ThemeProvider';
import { getCurrentUser } from '@/lib/server/auth/session';
import site from '@/data/site.json';

export const metadata: Metadata = {
  title: site.metadata.title,
  description: site.metadata.description,
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const user = await getCurrentUser();
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
          <Navbar user={user ? { firstName: user.firstName } : null} />
          {children}
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
