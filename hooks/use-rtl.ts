/**
 * RTL Hook
 * Provides RTL-aware styles that work immediately without app restart
 */

import { useMemo } from 'react';
import { StyleSheet, ViewStyle, TextStyle, StyleProp, I18nManager } from 'react-native';
import { useUserStore } from '@/store/user-store';

// Type that works for both View and Text
type MarginStyle = { marginRight: number } | { marginLeft: number };
type PaddingStyle = { paddingRight: number } | { paddingLeft: number };

export function useRTL() {
  const language = useUserStore((state) => state.language);
  const isArabic = language === 'ar';
  const isSystemRTL = I18nManager.isRTL;

  return useMemo(() => {
    // We want RTL if language is Arabic
    const shouldBeRTL = isArabic;
    
    // If system is already RTL, we don't need to force row-reverse
    // because 'row' will already be RTL.
    const needsManualReverse = shouldBeRTL && !isSystemRTL;

    return {
      isRTL: shouldBeRTL,
      isSystemRTL,
      
      // Flex direction
      row: needsManualReverse ? 'row-reverse' as const : 'row' as const,
      rowReverse: needsManualReverse ? 'row' as const : 'row-reverse' as const,
      
      // Text alignment
      textAlign: shouldBeRTL ? 'right' as const : 'left' as const,
      textAlignOpposite: shouldBeRTL ? 'left' as const : 'right' as const,
      
      // Alignment
      alignStart: shouldBeRTL ? 'flex-end' as const : 'flex-start' as const,
      alignEnd: shouldBeRTL ? 'flex-start' as const : 'flex-end' as const,
      
      // Writing direction for text
      writingDirection: shouldBeRTL ? 'rtl' as const : 'ltr' as const,
      
      // Margins (swap left/right)
      marginStart: (value: number) => 
        shouldBeRTL ? { marginRight: value } : { marginLeft: value },
      marginEnd: (value: number) => 
        shouldBeRTL ? { marginLeft: value } : { marginRight: value },
      
      // Paddings (swap left/right)
      paddingStart: (value: number) => 
        shouldBeRTL ? { paddingRight: value } : { paddingLeft: value },
      paddingEnd: (value: number) => 
        shouldBeRTL ? { paddingLeft: value } : { paddingRight: value },
      
      // Transform for icons like arrows
      scaleX: shouldBeRTL ? -1 : 1,
      
      // Common RTL style object
      containerStyle: {
        flexDirection: needsManualReverse ? 'row-reverse' : 'row',
      } as ViewStyle,
      
      textStyle: {
        textAlign: shouldBeRTL ? 'right' : 'left',
        writingDirection: shouldBeRTL ? 'rtl' : 'ltr',
      } as TextStyle,
    };
  }, [isArabic, isSystemRTL]);
}

// Helper to create RTL-aware styles
export function createRTLStyles<T extends StyleSheet.NamedStyles<T>>(
  stylesCreator: (isRTL: boolean) => T
) {
  return (isRTL: boolean) => StyleSheet.create(stylesCreator(isRTL));
}
