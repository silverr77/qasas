/**
 * Ad Service
 * Centralized AdMob configuration, initialization, and ad unit management.
 *
 * Ad Strategy:
 * - Banner: Home, Chapter List, Progress screens (non-intrusive, high-traffic)
 * - Interstitial: After every 3rd reading reflection completion (natural pause)
 * - Rewarded: Unlock locked chapters (user opt-in for value exchange)
 *
 * All IDs below use Google-provided test IDs in __DEV__ mode.
 * Replace the production IDs with your real AdMob unit IDs before release.
 */

import { waitForTrackingPermissionRequest } from '@/utils/trackingPermission';
import {
  adsAvailable,
  mobileAds,
  MaxAdContentRating,
  TestIds,
} from '@/services/adSafeImports';

// ─── Ad Unit IDs ────────────────────────────────────────────────────────────

// TODO: Replace these with your real AdMob ad unit IDs for production
const PRODUCTION_IDS = {
  BANNER_HOME: 'ca-app-pub-xxxxxxxx/banner-home',
  BANNER_CHAPTERS: 'ca-app-pub-xxxxxxxx/banner-chapters',
  BANNER_PROGRESS: 'ca-app-pub-xxxxxxxx/banner-progress',
  INTERSTITIAL_REFLECTION: 'ca-app-pub-xxxxxxxx/interstitial-reflection',
  REWARDED_UNLOCK: 'ca-app-pub-xxxxxxxx/rewarded-unlock',
};

export const AdUnitIds = {
  BANNER_HOME: __DEV__ ? (TestIds?.ADAPTIVE_BANNER ?? '') : PRODUCTION_IDS.BANNER_HOME,
  BANNER_CHAPTERS: __DEV__ ? (TestIds?.ADAPTIVE_BANNER ?? '') : PRODUCTION_IDS.BANNER_CHAPTERS,
  BANNER_PROGRESS: __DEV__ ? (TestIds?.ADAPTIVE_BANNER ?? '') : PRODUCTION_IDS.BANNER_PROGRESS,
  INTERSTITIAL_REFLECTION: __DEV__ ? (TestIds?.INTERSTITIAL ?? '') : PRODUCTION_IDS.INTERSTITIAL_REFLECTION,
  REWARDED_UNLOCK: __DEV__ ? (TestIds?.REWARDED ?? '') : PRODUCTION_IDS.REWARDED_UNLOCK,
};

// ─── Interstitial frequency cap ─────────────────────────────────────────────

/** Show interstitial every N-th reading exit/finish */
export const INTERSTITIAL_FREQUENCY = 3;

/** Show interstitial every N-th significant navigation (e.g. open story, switch tab, return home) */
export const INTERSTITIAL_NAVIGATION_FREQUENCY = 4;

// ─── Initialization ─────────────────────────────────────────────────────────

let initialized = false;
let initPromise: Promise<void> | null = null;

/**
 * Initialize the Google Mobile Ads SDK.
 * Waits for ATT (App Tracking Transparency) to resolve first on iOS.
 * Safe to call multiple times — only runs once.
 */
export async function initializeAds(): Promise<void> {
  if (initialized) return;
  if (initPromise) return initPromise;

  // If native module isn't available, skip initialization gracefully
  if (!adsAvailable || !mobileAds) {
    console.warn('[AdService] Ads native module not available — skipping init');
    initialized = true;
    return;
  }

  initPromise = (async () => {
    try {
      // Wait for ATT prompt to be answered before initializing ads
      await waitForTrackingPermissionRequest();

      // Configure request settings (family-friendly content for an Islamic app)
      await mobileAds().setRequestConfiguration({
        maxAdContentRating: MaxAdContentRating?.G,
        tagForChildDirectedTreatment: false,
        tagForUnderAgeOfConsent: false,
        testDeviceIdentifiers: __DEV__ ? ['EMULATOR'] : [],
      });

      await mobileAds().initialize();
      initialized = true;
      console.log('[AdService] Mobile Ads SDK initialized');
    } catch (error) {
      console.error('[AdService] Failed to initialize ads:', error);
      // Don't block the app if ads fail to init
      initialized = true;
    }
  })();

  return initPromise;
}

/**
 * Check if the ads SDK has been initialized.
 */
export function isAdsInitialized(): boolean {
  return initialized;
}
