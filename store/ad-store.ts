/**
 * Ad Store
 * Tracks ad-related state: interstitial frequency counter, ad-free status, etc.
 * Persisted so the counter survives app restarts.
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { INTERSTITIAL_FREQUENCY, INTERSTITIAL_NAVIGATION_FREQUENCY } from '@/services/adService';

interface AdState {
  /**
   * Number of reading sessions completed since the last interstitial was shown.
   * When this reaches INTERSTITIAL_FREQUENCY, we show an interstitial and reset.
   */
  sessionsUntilInterstitial: number;

  /**
   * Number of significant navigations since the last navigation interstitial.
   * When this reaches INTERSTITIAL_NAVIGATION_FREQUENCY, we show an interstitial and reset.
   */
  navigationsUntilInterstitial: number;

  /** True after the first focus (avoids showing ad on app open). */
  navigationTrackingStarted: boolean;

  /** Call when a navigation target is focused. Returns true if an interstitial should be shown. */
  recordNavigationFocus: () => boolean;

  /** Increment session count. Returns true if an interstitial should be shown now. */
  recordSessionCompletion: () => boolean;

  /** Increment navigation count. Returns true if an interstitial should be shown now. */
  recordNavigation: () => boolean;

  /** Reset the counter (call after successfully showing an interstitial). */
  resetInterstitialCounter: () => void;
}

export const useAdStore = create<AdState>()(
  persist(
    (set, get) => ({
      sessionsUntilInterstitial: 0,
      navigationsUntilInterstitial: 0,
      navigationTrackingStarted: false,

      recordNavigationFocus: () => {
        if (!get().navigationTrackingStarted) {
          set({ navigationTrackingStarted: true });
          return false;
        }
        return get().recordNavigation();
      },

      recordSessionCompletion: () => {
        const nextCount = get().sessionsUntilInterstitial + 1;
        const shouldShow = nextCount >= INTERSTITIAL_FREQUENCY;
        set({ sessionsUntilInterstitial: shouldShow ? 0 : nextCount });
        return shouldShow;
      },

      recordNavigation: () => {
        const nextCount = get().navigationsUntilInterstitial + 1;
        const shouldShow = nextCount >= INTERSTITIAL_NAVIGATION_FREQUENCY;
        set({ navigationsUntilInterstitial: shouldShow ? 0 : nextCount });
        return shouldShow;
      },

      resetInterstitialCounter: () => {
        set({ sessionsUntilInterstitial: 0 });
      },
    }),
    {
      name: 'qasas-ad-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
