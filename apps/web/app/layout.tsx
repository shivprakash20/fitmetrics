import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.scss';
import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';
import { ThemeProvider } from '@/components/ThemeProvider';
import AnalyticsProvider from '@/components/Analytics/AnalyticsProvider';
import EventFlusher from '@/components/Analytics/EventFlusher';
import { getCurrentUser } from '@/lib/server/auth/session';
import site from '@/data/site.json';

export const metadata: Metadata = {
  title: site.metadata.title,
  description: site.metadata.description,
};

const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const user = await getCurrentUser();

  return (
    <html lang="en" data-theme="dark" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body>
        {/* Theme — runs before React hydrates to prevent flash */}
        <Script id="theme-init" strategy="beforeInteractive">{`
          (function () {
            try {
              var t = localStorage.getItem('fitmetrics-theme') || 'dark';
              document.documentElement.setAttribute('data-theme', t);
            } catch (e) {}
          })();
        `}</Script>

        {/* Google Analytics 4 — only loads when measurement ID is configured */}
        {gaId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script id="ga4-init" strategy="afterInteractive">{`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${gaId}');
            `}</Script>
          </>
        )}

        <ThemeProvider>
          <Navbar user={user ? { firstName: user.firstName } : null} />
          {children}
          <Footer />
        </ThemeProvider>

        {/* Analytics — outside ThemeProvider so they always mount */}
        <AnalyticsProvider userId={user?.id ?? null} />
        <EventFlusher />
      </body>
    </html>
  );
}
