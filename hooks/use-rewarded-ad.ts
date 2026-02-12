/**
 * useRewardedAd Hook
 * Manages loading and showing rewarded ads for chapter unlocking.
 * Preloads the ad and provides callbacks for reward earned / closed / error.
 * Gracefully degrades if the native ads module isn't available.
 */

import { useEffect, useState, useCallback, useRef } from 'react';
import {
  adsAvailable,
  RewardedAd,
  RewardedAdEventType,
  AdEventType,
} from '@/services/adSafeImports';
import { AdUnitIds } from '@/services/adService';

interface UseRewardedAdOptions {
  /** Called when user earns the reward (completed watching the ad) */
  onRewardEarned?: () => void;
  /** Called when user closes the ad (with or without earning reward) */
  onAdClosed?: () => void;
  /** Called if the ad fails to load or show */
  onError?: (error: Error) => void;
}

export function useRewardedAd(options: UseRewardedAdOptions = {}) {
  const [loaded, setLoaded] = useState(false);
  const [isShowing, setIsShowing] = useState(false);
  const rewardedRef = useRef<any>(null);
  const rewardEarnedRef = useRef(false);
  const optionsRef = useRef(options);
  optionsRef.current = options;

  useEffect(() => {
    // Skip if native module not available
    if (!adsAvailable || !RewardedAd || !RewardedAdEventType || !AdEventType) return;

    const rewarded = RewardedAd.createForAdRequest(AdUnitIds.REWARDED_UNLOCK);
    rewardedRef.current = rewarded;

    const unsubLoaded = rewarded.addAdEventListener(
      RewardedAdEventType.LOADED,
      () => {
        setLoaded(true);
      }
    );

    const unsubEarned = rewarded.addAdEventListener(
      RewardedAdEventType.EARNED_REWARD,
      (_reward: any) => {
        rewardEarnedRef.current = true;
        optionsRef.current.onRewardEarned?.();
      }
    );

    const unsubClosed = rewarded.addAdEventListener(
      AdEventType.CLOSED,
      () => {
        setIsShowing(false);
        optionsRef.current.onAdClosed?.();
        // Reload for next use
        setLoaded(false);
        rewardEarnedRef.current = false;
        rewarded.load();
      }
    );

    const unsubError = rewarded.addAdEventListener(
      AdEventType.ERROR,
      (error: any) => {
        console.warn('[RewardedAd] Error:', error?.message);
        setIsShowing(false);
        setLoaded(false);
        optionsRef.current.onError?.(new Error(error?.message));
        // Retry loading after a delay
        setTimeout(() => rewarded.load(), 5000);
      }
    );

    // Start preloading
    rewarded.load();

    return () => {
      unsubLoaded();
      unsubEarned();
      unsubClosed();
      unsubError();
    };
  }, []);

  /**
   * Show the rewarded ad. Returns true if ad was displayed, false if not loaded.
   */
  const show = useCallback((): boolean => {
    if (loaded && rewardedRef.current && !isShowing) {
      rewardEarnedRef.current = false;
      setIsShowing(true);
      rewardedRef.current.show();
      return true;
    }
    return false;
  }, [loaded, isShowing]);

  return {
    /** Whether a rewarded ad is loaded and ready to show */
    loaded,
    /** Whether the ad is currently being displayed */
    isShowing,
    /** Show the rewarded ad */
    show,
  };
}
