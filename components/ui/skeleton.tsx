/**
 * Skeleton Components
 * Loading placeholders with shimmer animation
 */

import React, { useEffect } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  interpolate,
} from 'react-native-reanimated';
import { Radius, Spacing } from '@/constants/theme';
import { useAppTheme } from '@/hooks/use-app-theme';

interface SkeletonBaseProps {
  style?: ViewStyle;
}

interface SkeletonLineProps extends SkeletonBaseProps {
  width?: number | string;
  height?: number;
}

interface SkeletonCircleProps extends SkeletonBaseProps {
  size?: number;
}

/**
 * Base Skeleton with shimmer animation
 */
function SkeletonBase({ style, children }: SkeletonBaseProps & { children?: React.ReactNode }) {
  const { colors } = useAppTheme();
  const shimmer = useSharedValue(0);

  useEffect(() => {
    shimmer.value = withRepeat(
      withTiming(1, { duration: 1500 }),
      -1, // Infinite repeat
      false // No reverse
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(shimmer.value, [0, 0.5, 1], [0.3, 0.6, 0.3]),
  }));

  return (
    <Animated.View
      style={[
        { backgroundColor: colors.border },
        style,
        animatedStyle,
      ]}
    >
      {children}
    </Animated.View>
  );
}

/**
 * Skeleton Line - for text placeholders
 */
export function SkeletonLine({ width = '100%', height = 16, style }: SkeletonLineProps) {
  return (
    <SkeletonBase
      style={{
        width: width as any,
        height,
        borderRadius: height / 2,
        ...style,
      }}
    />
  );
}

/**
 * Skeleton Circle - for avatar/icon placeholders
 */
export function SkeletonCircle({ size = 48, style }: SkeletonCircleProps) {
  return (
    <SkeletonBase
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        ...style,
      }}
    />
  );
}

/**
 * Skeleton Box - for card/image placeholders
 */
export function SkeletonBox({ style }: SkeletonBaseProps) {
  return (
    <SkeletonBase
      style={{
        borderRadius: Radius.md,
        ...style,
      }}
    />
  );
}

/**
 * Prophet Card Skeleton
 */
export function ProphetCardSkeleton() {
  const { colors } = useAppTheme();

  return (
    <View
      style={[
        styles.prophetCard,
        {
          backgroundColor: colors.backgroundCard,
          borderColor: colors.border,
        },
      ]}
    >
      <SkeletonCircle size={64} />
      <View style={styles.prophetContent}>
        <SkeletonLine width="40%" height={20} />
        <SkeletonLine width="60%" height={24} style={styles.marginTop} />
        <SkeletonLine width="80%" height={14} style={styles.marginTop} />
        <SkeletonLine width="30%" height={12} style={styles.marginTopSm} />
      </View>
    </View>
  );
}

/**
 * Chapter Item Skeleton
 */
export function ChapterItemSkeleton() {
  const { colors } = useAppTheme();

  return (
    <View
      style={[
        styles.chapterItem,
        {
          backgroundColor: colors.backgroundCard,
          borderColor: colors.border,
        },
      ]}
    >
      <SkeletonCircle size={40} />
      <View style={styles.chapterContent}>
        <SkeletonLine width="70%" height={18} />
        <SkeletonLine width="40%" height={14} style={styles.marginTopSm} />
      </View>
    </View>
  );
}

/**
 * Prophets List Skeleton
 */
export function ProphetsListSkeleton() {
  return (
    <View style={styles.listContainer}>
      <ProphetCardSkeleton />
      <ProphetCardSkeleton />
      <ProphetCardSkeleton />
      <ProphetCardSkeleton />
    </View>
  );
}

/**
 * Chapters List Skeleton
 */
export function ChaptersListSkeleton() {
  return (
    <View style={styles.listContainer}>
      <ChapterItemSkeleton />
      <ChapterItemSkeleton />
      <ChapterItemSkeleton />
    </View>
  );
}

const styles = StyleSheet.create({
  prophetCard: {
    flexDirection: 'row',
    padding: Spacing.lg,
    borderRadius: Radius.lg,
    borderWidth: 1,
    marginBottom: Spacing.md,
  },
  prophetContent: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  chapterItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: Radius.md,
    borderWidth: 1,
    marginBottom: Spacing.sm,
  },
  chapterContent: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  listContainer: {
    padding: Spacing.lg,
  },
  marginTop: {
    marginTop: Spacing.sm,
  },
  marginTopSm: {
    marginTop: Spacing.xs,
  },
});
