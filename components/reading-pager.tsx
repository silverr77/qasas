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
  AccessibilityInfo,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
  FadeIn,
  FadeOut,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Colors, Spacing, Radius, TextStyles, Shadows } from '@/constants/theme';
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
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export function ReadingPager({
  pages,
  currentPage,
  onPageChange,
  fontSize,
}: ReadingPagerProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { t } = useTranslation();
  const rtl = useRTL();
  const scrollRef = useRef<ScrollView>(null);
  const [showHints, setShowHints] = useState(true);
  const [showNavButtons, setShowNavButtons] = useState(true);

  const actualFontSize = FONT_SIZES[fontSize];
  const lineHeight = actualFontSize * 1.7;

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
      setShowHints(false);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 0) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onPageChange(currentPage - 1);
      setShowHints(false);
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
              { backgroundColor: colors.readingBackground },
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
                    color: colors.readingText,
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

      {/* Page Counter */}
      <View style={styles.pageCounterContainer}>
        <View style={[styles.pageCounter, { backgroundColor: colors.backgroundCard }]}>
          <Text style={[styles.pageCounterText, { color: colors.textSecondary, textAlign: rtl.textAlign }]}>
            {t('navigation.pageCounter', {
              current: currentPage + 1,
              total: pages.length,
            })}
          </Text>
          {pages.length - currentPage - 1 > 0 && (
            <Text style={[styles.pagesRemaining, { color: colors.textTertiary, textAlign: rtl.textAlign }]}>
              {t('navigation.pagesRemaining', {
                remaining: pages.length - currentPage - 1,
              })}
            </Text>
          )}
        </View>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressBarContainer}>
        <View style={[styles.progressBarBackground, { backgroundColor: colors.border }]}>
          <Animated.View
            style={[
              styles.progressBarFill,
              {
                backgroundColor: colors.primary,
                width: `${((currentPage + 1) / pages.length) * 100}%`,
                alignSelf: rtl.isRTL ? 'flex-end' : 'flex-start',
              },
            ]}
          />
        </View>
      </View>

      {/* Page Dots */}
      <View style={[styles.dotsContainer, { flexDirection: rtl.row }]}>
        {(rtl.isRTL ? [...pages].reverse() : pages).map((_, index) => {
          const actualIndex = rtl.isRTL ? pages.length - 1 - index : index;
          return (
            <View
              key={index}
              style={[
                styles.dot,
                {
                  backgroundColor:
                    actualIndex === currentPage ? colors.primary : colors.border,
                  opacity: actualIndex === currentPage ? 1 : 0.3,
                },
              ]}
            />
          );
        })}
      </View>

      {/* Navigation Buttons */}
      {showNavButtons && (
        <Animated.View
          entering={FadeIn}
          exiting={FadeOut}
          style={[styles.navButtonsContainer, { flexDirection: rtl.row }]}
        >
          {currentPage > 0 && (
            <Pressable
              onPress={goToPrevPage}
              style={({ pressed }) => [
                styles.navButton,
                {
                  backgroundColor: colors.backgroundCard,
                  opacity: pressed ? 0.7 : 1,
                },
              ]}
              accessibilityRole="button"
              accessibilityLabel={t('navigation.previousPage')}
            >
              <Text style={[styles.navButtonText, { color: colors.text }]}>
                {rtl.isRTL ? '→' : '←'}
              </Text>
            </Pressable>
          )}
          <View style={{ flex: 1 }} />
          {currentPage < pages.length - 1 && (
            <Pressable
              onPress={goToNextPage}
              style={({ pressed }) => [
                styles.navButton,
                {
                  backgroundColor: colors.backgroundCard,
                  opacity: pressed ? 0.7 : 1,
                },
              ]}
              accessibilityRole="button"
              accessibilityLabel={t('navigation.nextPage')}
            >
              <Text style={[styles.navButtonText, { color: colors.text }]}>
                {rtl.isRTL ? '←' : '→'}
              </Text>
            </Pressable>
          )}
        </Animated.View>
      )}

      {/* Swipe Hint */}
      {showHints && currentPage === 0 && (
        <Animated.View
          entering={FadeIn.delay(500)}
          exiting={FadeOut}
          style={styles.hintContainer}
        >
          <Text style={[styles.hintText, { color: colors.textSecondary, textAlign: rtl.textAlign }]}>
            {t('navigation.swipeHint')}
          </Text>
        </Animated.View>
      )}

      {/* Tap zones for navigation */}
      <Pressable
        style={[styles.tapZone, rtl.isRTL ? { right: 0 } : { left: 0 }]}
        onPress={() => {
          setShowNavButtons(true);
          goToPrevPage();
        }}
        accessibilityRole="button"
        accessibilityLabel={t('navigation.previousPage')}
      />
      <Pressable
        style={[styles.tapZone, rtl.isRTL ? { left: 0 } : { right: 0 }]}
        onPress={() => {
          setShowNavButtons(true);
          goToNextPage();
        }}
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
    padding: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xxl,
  },
  pageText: {
    ...TextStyles.bodyLarge,
  },
  pageCounterContainer: {
    position: 'absolute',
    top: Spacing.md,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 10,
  },
  pageCounter: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.md,
    ...Shadows.sm,
  },
  pageCounterText: {
    ...TextStyles.labelSmall,
  },
  pagesRemaining: {
    ...TextStyles.labelSmall,
    fontSize: 10,
    marginTop: 2,
  },
  progressBarContainer: {
    position: 'absolute',
    bottom: Spacing.xl + 20,
    left: Spacing.lg,
    right: Spacing.lg,
    zIndex: 10,
  },
  progressBarBackground: {
    height: 3,
    borderRadius: 1.5,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 1.5,
  },
  dotsContainer: {
    position: 'absolute',
    bottom: Spacing.lg,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.xs,
    zIndex: 10,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  navButtonsContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    pointerEvents: 'box-none',
    zIndex: 5,
  },
  navButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: Spacing.md,
    ...Shadows.sm,
  },
  navButtonText: {
    fontSize: 24,
    fontWeight: '300',
  },
  hintContainer: {
    position: 'absolute',
    bottom: Spacing.xxl + 20,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 10,
  },
  hintText: {
    ...TextStyles.labelSmall,
    fontStyle: 'italic',
  },
  tapZone: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: SCREEN_WIDTH * 0.2,
    zIndex: 1,
  },
});
