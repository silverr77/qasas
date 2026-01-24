/**
 * Story Card Component (Home Screen Version)
 * Large story card for recommended stories section
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useAppTheme } from '@/hooks/use-app-theme';
import { useTranslation } from '@/hooks/use-translation';
import { Spacing, Radius, Shadows, TextStyles } from '@/constants/theme';
import { ImagePlaceholder } from '@/components/ui/image-placeholder';
import { Story, StoryCategory } from '@/types';
import { getChaptersByStoryId } from '@/data/chapters';

interface StoryCardProps {
  story: Story;
  onPress: () => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function StoryCard({ story, onPress }: StoryCardProps) {
  const { colors } = useAppTheme();
  const { t } = useTranslation();
  const scale = useSharedValue(1);

  const chapters = getChaptersByStoryId(story.id);
  const totalReadingTime = chapters.reduce(
    (sum, ch) => sum + ch.estimatedReadingTime,
    0
  );

  const handlePressIn = () => {
    scale.value = withSpring(0.98, { damping: 15, stiffness: 150 });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 150 });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[styles.container, animatedStyle]}
    >
      <View
        style={[
          styles.card,
          {
            backgroundColor: colors.backgroundCard,
          },
        ]}
      >
        {/* Illustration */}
        <View style={styles.illustrationContainer}>
          <ImagePlaceholder
            width={280}
            height={200}
            category={story.category}
            borderRadius={Radius.lg}
          />
          
          {/* Title Overlay */}
          <View style={styles.titleOverlay}>
            <Text
              style={[styles.titleOverlayText, { color: colors.textInverse }]}
              numberOfLines={2}
            >
              {story.nameEn}
            </Text>
          </View>

          {/* Duration Badge */}
          <View style={[styles.durationBadge, { backgroundColor: colors.backgroundCard }]}>
            <Text style={styles.clockIcon}>🕐</Text>
            <Text style={[styles.durationText, { color: colors.text }]}>
              {totalReadingTime} {t('durations.minutes', { count: totalReadingTime })}
            </Text>
          </View>
        </View>

        {/* Story Info */}
        <View style={styles.infoContainer}>
          <Text
            style={[styles.storyTitle, { color: colors.text }]}
            numberOfLines={1}
          >
            {story.nameEn}
          </Text>
          <Text
            style={[styles.storyDescription, { color: colors.textSecondary }]}
            numberOfLines={2}
          >
            {story.shortDescription}
          </Text>
        </View>

        {/* Play Button */}
        <Pressable
          style={[styles.playButton, { backgroundColor: colors.orangeAccent }]}
          onPress={onPress}
        >
          <Text style={styles.playIcon}>▶</Text>
        </Pressable>
      </View>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  container: {
    marginRight: Spacing.lg,
  },
  card: {
    width: 280,
    height: 360,
    borderRadius: Radius.lg,
    overflow: 'hidden',
    ...Shadows.md,
  },
  illustrationContainer: {
    width: 280,
    height: 200,
    position: 'relative',
  },
  titleOverlay: {
    position: 'absolute',
    top: Spacing.md,
    left: Spacing.md,
    right: Spacing.md,
  },
  titleOverlayText: {
    ...TextStyles.headingSmall,
    fontSize: 18,
    fontWeight: '700',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  durationBadge: {
    position: 'absolute',
    bottom: Spacing.md,
    left: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.xs,
    ...Shadows.sm,
  },
  clockIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  durationText: {
    ...TextStyles.labelSmall,
    fontSize: 12,
  },
  infoContainer: {
    padding: Spacing.md,
    flex: 1,
  },
  storyTitle: {
    ...TextStyles.headingSmall,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: Spacing.xs,
  },
  storyDescription: {
    ...TextStyles.bodySmall,
    fontSize: 12,
    lineHeight: 16,
  },
  playButton: {
    position: 'absolute',
    bottom: -32,
    alignSelf: 'center',
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.lg,
  },
  playIcon: {
    fontSize: 24,
    color: '#FFFFFF',
    marginLeft: 2,
  },
});
