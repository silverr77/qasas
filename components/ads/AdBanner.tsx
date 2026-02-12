/**
 * AdBanner Component
 * Reusable adaptive banner ad that gracefully handles loading/errors.
 * Uses ANCHORED_ADAPTIVE_BANNER for optimal sizing across devices.
 * Returns null if the native ads module isn't available.
 */

import React, { useRef, useState, useEffect } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import {
  adsAvailable,
  BannerAd as BannerAdComponent,
  BannerAdSize,
  useForeground,
} from '@/services/adSafeImports';
import { isAdsInitialized } from '@/services/adService';

interface AdBannerProps {
  /** The AdMob ad unit ID (use AdUnitIds from adService) */
  unitId: string;
  /** Optional style overrides for the container */
  style?: object;
}

export function AdBanner({ unitId, style }: AdBannerProps) {
  const bannerRef = useRef<any>(null);
  const [hasError, setHasError] = useState(false);

  // (iOS) WKWebView can terminate if app is in a "suspended state",
  // resulting in an empty banner when app returns to foreground.
  // Manually request a new ad when the app is foregrounded.
  // Only call the hook if the native module is available.
  if (adsAvailable && useForeground) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useForeground(() => {
      Platform.OS === 'ios' && bannerRef.current?.load();
    });
  }

  // Don't render anything if native module isn't available, ads SDK isn't initialized, or ad failed
  if (!adsAvailable || !BannerAdComponent || !isAdsInitialized() || hasError) {
    return null;
  }

  return (
    <View style={[styles.container, style]}>
      <BannerAdComponent
        ref={bannerRef}
        unitId={unitId}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        onAdFailedToLoad={(error: any) => {
          console.warn('[AdBanner] Failed to load:', error?.message);
          setHasError(true);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: '100%',
  },
});
