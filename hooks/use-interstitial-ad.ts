/**
 * useInterstitialAd Hook
 * Manages loading and showing interstitial ads with frequency capping.
 * The ad is preloaded so it's ready to show instantly when needed.
 * Gracefully degrades if the native ads module isn't available.
 */

import { useEffect, useState, useCallback, useRef } from 'react';
import { Platform, StatusBar } from 'react-native';
import {
  adsAvailable,
  InterstitialAd,
  AdEventType,
} from '@/services/adSafeImports';
import { AdUnitIds } from '@/services/adService';
import { useAdStore } from '@/store/ad-store';

export function useInterstitialAd() {
  const [loaded, setLoaded] = useState(false);
  const interstitialRef = useRef<any>(null);

  const recordSessionCompletion = useAdStore((s) => s.recordSessionCompletion);
  const recordNavigationFocus = useAdStore((s) => s.recordNavigationFocus);

  useEffect(() => {
    // Skip if native module not available
    if (!adsAvailable || !InterstitialAd || !AdEventType) return;

    const interstitial = InterstitialAd.createForAdRequest(
      AdUnitIds.INTERSTITIAL_REFLECTION
    );
    interstitialRef.current = interstitial;

    const unsubLoaded = interstitial.addAdEventListener(
      AdEventType.LOADED,
      () => setLoaded(true)
    );

    const unsubOpened = interstitial.addAdEventListener(
      AdEventType.OPENED,
      () => {
        if (Platform.OS === 'ios') {
          StatusBar.setHidden(true);
        }
      }
    );

    const unsubClosed = interstitial.addAdEventListener(
      AdEventType.CLOSED,
      () => {
        if (Platform.OS === 'ios') {
          StatusBar.setHidden(false);
        }
        setLoaded(false);
        interstitial.load();
      }
    );

    const unsubError = interstitial.addAdEventListener(
      AdEventType.ERROR,
      (error: any) => {
        console.warn('[Interstitial] Error:', error?.message);
        setLoaded(false);
      }
    );

    // Start preloading
    interstitial.load();

    return () => {
      unsubLoaded();
      unsubOpened();
      unsubClosed();
      unsubError();
    };
  }, []);

  /**
   * Call this when a session is completed (exit reading, finish chapter).
   * Increments the frequency counter and shows an interstitial if it's time.
   * Returns true if interstitial was shown, false otherwise.
   */
  const showIfReady = useCallback((): boolean => {
    const shouldShow = recordSessionCompletion();
    if (shouldShow && loaded && interstitialRef.current) {
      interstitialRef.current.show();
      return true;
    }
    return false;
  }, [loaded, recordSessionCompletion]);

  /**
   * Call this when the user navigates to a significant screen (home, chapter list, progress).
   * Skips the first focus (app open). Then every N navigations shows an interstitial.
   * Returns true if interstitial was shown, false otherwise.
   */
  const showIfNavigationReady = useCallback((): boolean => {
    const shouldShow = recordNavigationFocus();
    if (shouldShow && loaded && interstitialRef.current) {
      interstitialRef.current.show();
      return true;
    }
    return false;
  }, [loaded, recordNavigationFocus]);

  return { loaded, showIfReady, showIfNavigationReady };
}
