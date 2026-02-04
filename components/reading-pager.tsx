/**
 * ReadingPager Component
 * Page-by-page reading experience with swipe navigation
 */

import React, { useRef, useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  Pressable,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { Colors, Spacing, TextStyles } from '@/constants/theme';
import { FONT_SIZES } from '@/types';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useTranslation } from '@/hooks/use-translation';
import { ReadingPreferences } from '@/types';

import { useRTL } from '@/hooks/use-rtl';

interface ReadingPagerProps {
  pages: string[];
  currentPage: number;
  onPageChange: (page: number) => void;
  fontSize: ReadingPreferences['fontSize'];
  readingBackgroundColor?: string;
  readingTextColor?: string;
  lineSpacingMultiplier?: number;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export function ReadingPager({
  pages,
  currentPage,
  onPageChange,
  fontSize,
  readingBackgroundColor,
  readingTextColor,
  lineSpacingMultiplier = 1.7,
}: ReadingPagerProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { t } = useTranslation();
  const rtl = useRTL();
  const scrollRef = useRef<ScrollView>(null);

  const actualFontSize = FONT_SIZES[fontSize];
  const lineHeight = actualFontSize * lineSpacingMultiplier;
  const bgColor = readingBackgroundColor ?? colors.readingBackground;
  const textColor = readingTextColor ?? colors.readingText;

  // Scroll to current page
  useEffect(() => {
    // In RTL mode with scaleX trick, the scroll position is inverted
    const scrollX = rtl.isRTL && !rtl.isSystemRTL
      ? (pages.length - 1 - currentPage) * SCREEN_WIDTH
      : currentPage * SCREEN_WIDTH;

    scrollRef.current?.scrollTo({
      x: scrollX,
      animated: true,
    });
  }, [currentPage, pages.length, rtl.isRTL, rtl.isSystemRTL]);

  const handleScroll = useCallback(
    (event: { nativeEvent: { contentOffset: { x: number } } }) => {
      const offsetX = event.nativeEvent.contentOffset.x;
      let newPage = Math.round(offsetX / SCREEN_WIDTH);
      
      // Invert page index if using scaleX trick
      if (rtl.isRTL && !rtl.isSystemRTL) {
        newPage = pages.length - 1 - newPage;
      }

      if (newPage !== currentPage && newPage >= 0 && newPage < pages.length) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPageChange(newPage);
      }
    },
    [currentPage, pages.length, onPageChange, rtl.isRTL, rtl.isSystemRTL]
  );

  const goToNextPage = () => {
    if (currentPage < pages.length - 1) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onPageChange(currentPage + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 0) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onPageChange(currentPage - 1);
    }
  };

  // ... (rest of the component)

  return (
    <View style={styles.container}>
      {/* Page content with horizontal paging */}
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        scrollEventThrottle={16}
        decelerationRate="fast"
        contentContainerStyle={[
          styles.scrollContent,
          { flexDirection: rtl.row }
        ]}
        style={rtl.isRTL && !rtl.isSystemRTL ? { transform: [{ scaleX: -1 }] } : {}}
      >
        {pages.map((pageContent, index) => (
          <View
            key={index}
            style={[
              styles.page,
              { backgroundColor: bgColor },
              rtl.isRTL && !rtl.isSystemRTL ? { transform: [{ scaleX: -1 }] } : {}
            ]}
          >
            <ScrollView
              style={styles.pageScroll}
              contentContainerStyle={styles.pageScrollContent}
              showsVerticalScrollIndicator={false}
            >
              <Text
                style={[
                  styles.pageText,
                  {
                    color: textColor,
                    fontSize: actualFontSize,
                    lineHeight,
                    textAlign: rtl.textAlign,
                  },
                ]}
                accessibilityLabel={`Page ${index + 1}: ${pageContent}`}
              >
                {pageContent}
              </Text>
            </ScrollView>
          </View>
        ))}
      </ScrollView>

      {/* Tap zones: tap left/right edge to go prev/next (swipe also works via ScrollView) */}
      <Pressable
        style={[styles.tapZone, rtl.isRTL ? { right: 0 } : { left: 0 }]}
        onPress={goToPrevPage}
        accessibilityRole="button"
        accessibilityLabel={t('navigation.previousPage')}
      />
      <Pressable
        style={[styles.tapZone, rtl.isRTL ? { left: 0 } : { right: 0 }]}
        onPress={goToNextPage}
        accessibilityRole="button"
        accessibilityLabel={t('navigation.nextPage')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  page: {
    width: SCREEN_WIDTH,
    flex: 1,
  },
  pageScroll: {
    flex: 1,
  },
  pageScrollContent: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.xxl,
    maxWidth: 480,
    alignSelf: 'center',
  },
  pageText: {
    ...TextStyles.bodyLarge,
  },
  tapZone: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: SCREEN_WIDTH * 0.2,
    zIndex: 1,
  },
});
