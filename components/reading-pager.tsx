/**
 * ReadingPager Component
 * Page-by-page reading experience with swipe navigation
 */

import React, { useRef, useCallback, useEffect } from 'react';
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
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Colors, Spacing, Radius, TextStyles } from '@/constants/theme';
import { FONT_SIZES } from '@/types';
import { useColorScheme } from '@/hooks/use-color-scheme';
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
  const scrollRef = useRef<ScrollView>(null);

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
      onPageChange(currentPage + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 0) {
      onPageChange(currentPage - 1);
    }
  };

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

      {/* Tap zones for navigation */}
      <View style={styles.tapZones}>
        <Pressable
          style={styles.tapZoneLeft}
          onPress={goToPrevPage}
          accessibilityRole="button"
          accessibilityLabel="Previous page"
          accessibilityHint={currentPage > 0 ? 'Go to previous page' : 'Already on first page'}
        />
        <Pressable
          style={styles.tapZoneRight}
          onPress={goToNextPage}
          accessibilityRole="button"
          accessibilityLabel="Next page"
          accessibilityHint={
            currentPage < pages.length - 1
              ? 'Go to next page'
              : 'Already on last page'
          }
        />
      </View>
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
  tapZones: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
  },
  tapZoneLeft: {
    flex: 1,
    // Make only the edges tappable, not the center (for text selection)
    width: SCREEN_WIDTH * 0.2,
  },
  tapZoneRight: {
    flex: 1,
    width: SCREEN_WIDTH * 0.2,
    marginLeft: 'auto',
  },
});
