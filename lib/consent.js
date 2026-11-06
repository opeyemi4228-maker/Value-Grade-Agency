// Cookie consent, stored per visitor in localStorage. Bump VERSION when the cookie
// categories change so everyone is asked again.
const KEY = "vga-consent";
const VERSION = 1;
export const CONSENT_EVENT = "vga:consent-change";
export const OPEN_SETTINGS_EVENT = "vga:open-cookie-settings";

export function readConsent() {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY));
    return saved?.v === VERSION ? saved : null;
  } catch {
    return null;
  }
}

export function saveConsent({ analytics, marketing }) {
  const consent = { v: VERSION, analytics: Boolean(analytics), marketing: Boolean(marketing), at: new Date().toISOString() };
  try {
    localStorage.setItem(KEY, JSON.stringify(consent));
  } catch {
    // Storage blocked (private mode): the choice still applies for this page view.
  }
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: consent }));
  return consent;
}

export function openCookieSettings() {
  window.dispatchEvent(new Event(OPEN_SETTINGS_EVENT));
}
