/**
 * RTL Hook
 * Provides RTL-aware styles that work immediately without app restart
 */

import { useMemo } from 'react';
import { StyleSheet, ViewStyle, TextStyle, StyleProp } from 'react-native';
import { useUserStore } from '@/store/user-store';

// Type that works for both View and Text
type MarginStyle = { marginRight: number } | { marginLeft: number };
type PaddingStyle = { paddingRight: number } | { paddingLeft: number };

export function useRTL() {
  const language = useUserStore((state) => state.language);
  const isRTL = language === 'ar';

  return useMemo(() => ({
    isRTL,
    
    // Flex direction
    row: isRTL ? 'row-reverse' as const : 'row' as const,
    rowReverse: isRTL ? 'row' as const : 'row-reverse' as const,
    
    // Text alignment
    textAlign: isRTL ? 'right' as const : 'left' as const,
    textAlignOpposite: isRTL ? 'left' as const : 'right' as const,
    
    // Alignment
    alignStart: isRTL ? 'flex-end' as const : 'flex-start' as const,
    alignEnd: isRTL ? 'flex-start' as const : 'flex-end' as const,
    
    // Writing direction for text
    writingDirection: isRTL ? 'rtl' as const : 'ltr' as const,
    
    // Margins (swap left/right) - returns simple object that works with both View and Text
    marginStart: (value: number) => 
      isRTL ? { marginRight: value } : { marginLeft: value },
    marginEnd: (value: number) => 
      isRTL ? { marginLeft: value } : { marginRight: value },
    
    // Paddings (swap left/right)
    paddingStart: (value: number) => 
      isRTL ? { paddingRight: value } : { paddingLeft: value },
    paddingEnd: (value: number) => 
      isRTL ? { paddingLeft: value } : { paddingRight: value },
    
    // Transform for icons like arrows
    scaleX: isRTL ? -1 : 1,
    
    // Common RTL style object
    containerStyle: {
      flexDirection: isRTL ? 'row-reverse' : 'row',
    } as ViewStyle,
    
    textStyle: {
      textAlign: isRTL ? 'right' : 'left',
      writingDirection: isRTL ? 'rtl' : 'ltr',
    } as TextStyle,
  }), [isRTL]);
}

// Helper to create RTL-aware styles
export function createRTLStyles<T extends StyleSheet.NamedStyles<T>>(
  stylesCreator: (isRTL: boolean) => T
) {
  return (isRTL: boolean) => StyleSheet.create(stylesCreator(isRTL));
}
