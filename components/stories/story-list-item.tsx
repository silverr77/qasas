/**
 * Story List Item Component
 * Story item for vertical list view
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
import { Story } from '@/types';
import { getChaptersByStoryId } from '@/data/chapters';

interface StoryListItemProps {
  story: Story;
  onPress: () => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function StoryListItem({ story, onPress }: StoryListItemProps) {
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
        <ImagePlaceholder
          width={140}
          height={140}
          category={story.category}
          borderRadius={Radius.sm}
        />

        {/* Content */}
        <View style={styles.content}>
          <View style={styles.header}>
            <Text
              style={[styles.title, { color: colors.text }]}
              numberOfLines={2}
            >
              {story.nameEn}
            </Text>
          </View>

          <Text
            style={[styles.description, { color: colors.textSecondary }]}
            numberOfLines={2}
          >
            {story.shortDescription}
          </Text>

          <View style={styles.footer}>
            <View style={styles.durationContainer}>
              <Text style={styles.clockIcon}>🕐</Text>
              <Text style={[styles.durationText, { color: colors.textSecondary }]}>
                {totalReadingTime} {t('durations.minutes', { count: totalReadingTime })}
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
        </View>
      </View>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.md,
  },
  card: {
    flexDirection: 'row',
    height: 180,
    borderRadius: Radius.md,
    padding: Spacing.lg,
    ...Shadows.sm,
  },
  content: {
    flex: 1,
    marginLeft: Spacing.md,
    justifyContent: 'space-between',
  },
  header: {
    flex: 1,
  },
  title: {
    ...TextStyles.headingSmall,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: Spacing.xs,
  },
  description: {
    ...TextStyles.bodySmall,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: Spacing.sm,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  durationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  clockIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  durationText: {
    ...TextStyles.labelSmall,
    fontSize: 12,
  },
  playButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.sm,
  },
  playIcon: {
    fontSize: 16,
    color: '#FFFFFF',
    marginLeft: 2,
  },
});
