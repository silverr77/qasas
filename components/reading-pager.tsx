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
  const scrollRef = useRef<ScrollView>(null);
  const [showHints, setShowHints] = useState(true);
  const [showNavButtons, setShowNavButtons] = useState(true);

  const actualFontSize = FONT_SIZES[fontSize];
  const lineHeight = actualFontSize * 1.7;

  // Scroll to current page
  useEffect(() => {
    scrollRef.current?.scrollTo({
      x: currentPage * SCREEN_WIDTH,
      animated: true,
    });
  }, [currentPage]);

  const handleScroll = useCallback(
    (event: { nativeEvent: { contentOffset: { x: number } } }) => {
      const offsetX = event.nativeEvent.contentOffset.x;
      const newPage = Math.round(offsetX / SCREEN_WIDTH);
      if (newPage !== currentPage && newPage >= 0 && newPage < pages.length) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPageChange(newPage);
      }
    },
    [currentPage, pages.length, onPageChange]
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

  // Hide hints after first interaction
  useEffect(() => {
    if (currentPage > 0 || currentPage < pages.length - 1) {
      const timer = setTimeout(() => setShowHints(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [currentPage, pages.length]);

  // Show nav buttons on tap, hide after 3 seconds
  useEffect(() => {
    if (showNavButtons) {
      const timer = setTimeout(() => setShowNavButtons(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showNavButtons, currentPage]);

  // Announce page changes for accessibility
  useEffect(() => {
    AccessibilityInfo.announceForAccessibility(
      `Page ${currentPage + 1} of ${pages.length}`
    );
  }, [currentPage, pages.length]);

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
        contentContainerStyle={styles.scrollContent}
      >
        {pages.map((pageContent, index) => (
          <View
            key={index}
            style={[
              styles.page,
              { backgroundColor: colors.readingBackground },
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
          <Text style={[styles.pageCounterText, { color: colors.textSecondary }]}>
            {t('navigation.pageCounter', {
              current: currentPage + 1,
              total: pages.length,
            })}
          </Text>
          {pages.length - currentPage - 1 > 0 && (
            <Text style={[styles.pagesRemaining, { color: colors.textTertiary }]}>
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
              },
            ]}
          />
        </View>
      </View>

      {/* Page Dots */}
      <View style={styles.dotsContainer}>
        {pages.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              {
                backgroundColor:
                  index === currentPage ? colors.primary : colors.border,
                opacity: index === currentPage ? 1 : 0.3,
              },
            ]}
          />
        ))}
      </View>

      {/* Navigation Buttons */}
      {showNavButtons && (
        <Animated.View
          entering={FadeIn}
          exiting={FadeOut}
          style={styles.navButtonsContainer}
        >
          {currentPage > 0 && (
            <Pressable
              onPress={goToPrevPage}
              style={({ pressed }) => [
                styles.navButton,
                styles.navButtonLeft,
                {
                  backgroundColor: colors.backgroundCard,
                  opacity: pressed ? 0.7 : 1,
                },
              ]}
              accessibilityRole="button"
              accessibilityLabel={t('navigation.previousPage')}
            >
              <Text style={[styles.navButtonText, { color: colors.text }]}>←</Text>
            </Pressable>
          )}
          {currentPage < pages.length - 1 && (
            <Pressable
              onPress={goToNextPage}
              style={({ pressed }) => [
                styles.navButton,
                styles.navButtonRight,
                {
                  backgroundColor: colors.backgroundCard,
                  opacity: pressed ? 0.7 : 1,
                },
              ]}
              accessibilityRole="button"
              accessibilityLabel={t('navigation.nextPage')}
            >
              <Text style={[styles.navButtonText, { color: colors.text }]}>→</Text>
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
          <Text style={[styles.hintText, { color: colors.textSecondary }]}>
            {t('navigation.swipeHint')}
          </Text>
        </Animated.View>
      )}

      {/* Tap zones for navigation */}
      <Pressable
        style={styles.tapZoneLeft}
        onPress={() => {
          setShowNavButtons(true);
          goToPrevPage();
        }}
        accessibilityRole="button"
        accessibilityLabel={t('navigation.previousPage')}
      />
      <Pressable
        style={styles.tapZoneRight}
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
    textAlign: 'justify',
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
    textAlign: 'center',
  },
  pagesRemaining: {
    ...TextStyles.labelSmall,
    fontSize: 10,
    textAlign: 'center',
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
    flexDirection: 'row',
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
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  navButtonLeft: {
    // Left side
  },
  navButtonRight: {
    // Right side
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
  tapZoneLeft: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: SCREEN_WIDTH * 0.2,
    zIndex: 1,
  },
  tapZoneRight: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: SCREEN_WIDTH * 0.2,
    zIndex: 1,
  },
});
