/**
 * ProgressIndicator Component
 * Subtle progress display for reading sessions
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { Colors, Spacing, Radius, TextStyles } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface ProgressIndicatorProps {
  currentPage: number;
  totalPages: number;
  timeRemaining?: string;
  showTime?: boolean;
}

export function ProgressIndicator({
  currentPage,
  totalPages,
  timeRemaining,
  showTime = false,
}: ProgressIndicatorProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const progress = totalPages > 0 ? (currentPage + 1) / totalPages : 0;

  const animatedWidth = useAnimatedStyle(() => ({
    width: withSpring(`${progress * 100}%`, {
      damping: 20,
      stiffness: 100,
    }),
  }));

  return (
    <View style={styles.container}>
      {/* Page indicator dots for small page counts */}
      {totalPages <= 10 ? (
        <View style={styles.dotsContainer}>
          {Array.from({ length: totalPages }).map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                {
                  backgroundColor:
                    index <= currentPage
                      ? colors.primary
                      : colors.borderLight,
                },
              ]}
            />
          ))}
        </View>
      ) : (
        // Progress bar for longer content
        <View style={styles.barContainer}>
          <View
            style={[
              styles.barBackground,
              { backgroundColor: colors.borderLight },
            ]}
          >
            <Animated.View
              style={[
                styles.barFill,
                { backgroundColor: colors.primary },
                animatedWidth,
              ]}
            />
          </View>
          <Text
            style={[
              styles.pageCount,
              { color: colors.textSecondary },
            ]}
          >
            {currentPage + 1} / {totalPages}
          </Text>
        </View>
      )}

      {/* Optional time remaining display */}
      {showTime && timeRemaining && (
        <Text
          style={[
            styles.timeRemaining,
            { color: colors.textTertiary },
          ]}
        >
          {timeRemaining}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  barContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    width: '100%',
    paddingHorizontal: Spacing.lg,
  },
  barBackground: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 2,
  },
  pageCount: {
    ...TextStyles.labelSmall,
    minWidth: 50,
    textAlign: 'right',
  },
  timeRemaining: {
    ...TextStyles.labelSmall,
    marginTop: Spacing.xs,
  },
});
