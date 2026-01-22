/**
 * useHighContrast Hook
 * Detects if the user has high contrast mode enabled
 */

import { useState, useEffect } from 'react';
import { AccessibilityInfo } from 'react-native';

export function useHighContrast() {
  const [isHighContrast, setIsHighContrast] = useState(false);

  useEffect(() => {
    // Check initial state
    AccessibilityInfo.isReduceTransparencyEnabled().then(setIsHighContrast);

    // Listen for changes
    const subscription = AccessibilityInfo.addEventListener(
      'reduceTransparencyChanged',
      setIsHighContrast
    );

    return () => {
      subscription.remove();
    };
  }, []);

  return isHighContrast;
}

/**
 * useReduceMotion Hook
 * Detects if the user has reduce motion enabled
 */
export function useReduceMotion() {
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    // Check initial state
    AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotion);

    // Listen for changes
    const subscription = AccessibilityInfo.addEventListener(
      'reduceMotionChanged',
      setReduceMotion
    );

    return () => {
      subscription.remove();
    };
  }, []);

  return reduceMotion;
}
