import type { FirebaseOptions } from "firebase/app";
import type { Analytics } from "firebase/analytics";

type AnalyticsParams = Record<string, string | number | boolean>;

const firebaseConfig: FirebaseOptions = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

let analyticsInstance: Analytics | null = null;
let logEventImpl: typeof import("firebase/analytics").logEvent | null = null;
let analyticsInitAttempted = false;

function hasFirebaseConfig() {
  return Boolean(
    firebaseConfig.apiKey &&
      firebaseConfig.projectId &&
      firebaseConfig.appId &&
      firebaseConfig.measurementId,
  );
}

export async function initAnalytics() {
  if (analyticsInitAttempted) return analyticsInstance;
  analyticsInitAttempted = true;

  if (typeof window === "undefined" || !hasFirebaseConfig()) return null;

  const [{ initializeApp, getApps }, analyticsMod] = await Promise.all([
    import("firebase/app"),
    import("firebase/analytics"),
  ]);

  const { getAnalytics, isSupported, setAnalyticsCollectionEnabled, logEvent } = analyticsMod;
  logEventImpl = logEvent;

  const app = getApps()[0] ?? initializeApp(firebaseConfig);
  const supported = await isSupported();
  if (!supported) return null;

  analyticsInstance = getAnalytics(app);
  setAnalyticsCollectionEnabled(analyticsInstance, true);
  return analyticsInstance;
}

function withAnalytics(cb: (analytics: Analytics) => void) {
  if (!analyticsInstance || !logEventImpl) return;
  cb(analyticsInstance);
}

export function trackEvent(name: string, params: AnalyticsParams = {}) {
  withAnalytics((analytics) => {
    logEventImpl!(analytics, name, {
      ...params,
      page_path: window.location.pathname,
      page_location: window.location.href,
    });
  });
}

export function trackPageView(pathname: string, title = document.title) {
  withAnalytics((analytics) => {
    logEventImpl!(analytics, "page_view", {
      page_title: title,
      page_path: pathname,
      page_location: window.location.href,
    });
  });
}

export function trackSectionView(sectionId: string) {
  trackEvent("section_view", { section_id: sectionId });
}

export function trackNavigationClick(target: string, source: string) {
  trackEvent("navigation_click", {
    target,
    source,
  });
}

export function trackCtaClick(label: string, href: string, source: string) {
  trackEvent("cta_click", {
    cta_label: label,
    cta_href: href,
    source,
  });
}

export function trackExternalLinkClick(label: string, href: string, source: string) {
  trackEvent("external_link_click", {
    link_label: label,
    link_url: href,
    source,
  });
}
