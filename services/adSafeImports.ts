/**
 * Safe Ad Imports
 * Wraps react-native-google-mobile-ads imports so the app doesn't crash
 * if the native module isn't available (e.g. Expo Go, missing native build).
 *
 * All ad-related code should import from here instead of directly from
 * 'react-native-google-mobile-ads'.
 */

import { NativeModules } from 'react-native';

// Check if the native module is registered BEFORE requiring the JS package.
// This prevents fatal errors on new-arch (TurboModules) where require()
// can throw an uncatchable invariant violation.
const nativeModuleExists = !!NativeModules.RNGoogleMobileAdsModule;

let _adsAvailable = false;
let _mobileAds: any = null;
let _BannerAd: any = null;
let _BannerAdSize: any = null;
let _useForeground: any = null;
let _InterstitialAd: any = null;
let _RewardedAd: any = null;
let _AdEventType: any = null;
let _RewardedAdEventType: any = null;
let _TestIds: any = null;
let _MaxAdContentRating: any = null;

if (nativeModuleExists) {
  try {
    const ads = require('react-native-google-mobile-ads');
    _mobileAds = ads.default;
    _BannerAd = ads.BannerAd;
    _BannerAdSize = ads.BannerAdSize;
    _useForeground = ads.useForeground;
    _InterstitialAd = ads.InterstitialAd;
    _RewardedAd = ads.RewardedAd;
    _AdEventType = ads.AdEventType;
    _RewardedAdEventType = ads.RewardedAdEventType;
    _TestIds = ads.TestIds;
    _MaxAdContentRating = ads.MaxAdContentRating;
    _adsAvailable = true;
  } catch (e) {
    console.warn('[AdSafeImports] Failed to load react-native-google-mobile-ads:', e);
  }
} else {
  console.warn(
    '[AdSafeImports] RNGoogleMobileAdsModule not found in native binary. ' +
    'Ads will be disabled. Rebuild the native app (npx expo run:ios) to enable ads.'
  );
}

export const adsAvailable = _adsAvailable;
export const mobileAds = _mobileAds;
export const BannerAd = _BannerAd;
export const BannerAdSize = _BannerAdSize;
export const useForeground = _useForeground;
export const InterstitialAd = _InterstitialAd;
export const RewardedAd = _RewardedAd;
export const AdEventType = _AdEventType;
export const RewardedAdEventType = _RewardedAdEventType;
export const TestIds = _TestIds;
export const MaxAdContentRating = _MaxAdContentRating;
