/**
 * Client-side Google Analytics 4 helpers.
 * Only call these from 'use client' components or useEffect hooks.
 */

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
    dataLayer: unknown[];
  }
}

function gtag(...args: unknown[]): void {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return;
  window.gtag(...args);
}

export function trackEvent(name: string, params?: Record<string, unknown>): void {
  gtag('event', name, params);
}

export function setUserId(userId: string): void {
  const id = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  if (!id) return;
  gtag('config', id, { user_id: userId });
}

export function setUserProperties(props: Record<string, string>): void {
  gtag('set', 'user_properties', props);
}

// ─── Typed event helpers ───────────────────────────────────────────────────────

export type AuthMethod = 'email' | 'google' | 'github';

export const Analytics = {
  /** Fired once when a new account is created */
  signUp: (method: AuthMethod) =>
    trackEvent('sign_up', { method }),

  /** Fired on every successful authentication */
  login: (method: AuthMethod) =>
    trackEvent('login', { method }),

  /** Fired when the user ends their session */
  logout: () =>
    trackEvent('logout'),

  /** Fired when a calculator produces a result */
  calculatorUsed: (calculatorType: string, unit: string) =>
    trackEvent('calculator_used', { calculator_type: calculatorType, unit }),

  /** Fired when a calculator result is saved to the user's profile */
  readingSaved: (calculatorType: string) =>
    trackEvent('reading_saved', { calculator_type: calculatorType }),

  /** Fired when the contact form is successfully submitted */
  contactFormSubmitted: (topic: string) =>
    trackEvent('contact_form_submitted', { topic }),

  /** Fired when the user saves profile changes */
  profileUpdated: () =>
    trackEvent('profile_updated'),

  /** Fired when a form submission fails validation (server-side) */
  formError: (formName: string, errorMessage: string) =>
    trackEvent('form_error', { form_name: formName, error_message: errorMessage }),
};
