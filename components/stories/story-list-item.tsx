/**
 * Story List Item Component
 * Story item for vertical list view
 */

import { StoryImage } from '@/components/ui/image-placeholder';
import { Radius, Shadows, Spacing, TextStyles } from '@/constants/theme';
import { getChaptersByStoryId } from '@/data/chapters';
import { useAppTheme } from '@/hooks/use-app-theme';
import { useRTL } from '@/hooks/use-rtl';
import { useTranslation } from '@/hooks/use-translation';
import { useUserStore } from '@/store/user-store';
import { Story } from '@/types';
import * as Haptics from 'expo-haptics';
import React from 'react';
import {
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from 'react-native-reanimated';

interface StoryListItemProps {
  story: Story;
  onPress: () => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function StoryListItem({ story, onPress }: StoryListItemProps) {
  const { colors } = useAppTheme();
  const { t } = useTranslation();
  const rtl = useRTL();
  const language = useUserStore((state) => state.language);
  const scale = useSharedValue(1);
  
  const storyName = language === 'ar' ? story.nameAr : story.nameEn;
  const storyDescription = language === 'ar' ? story.shortDescriptionAr : story.shortDescriptionEn;

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
            flexDirection: rtl.row,
          },
        ]}
      >
        {/* Illustration */}
        <StoryImage
          storyId={story.id}
          width={140}
          height={140}
          category={story.category}
          borderRadius={Radius.sm}
        />

        {/* Content */}
        <View style={[
          styles.content,
          rtl.isRTL ? { marginRight: Spacing.md } : { marginLeft: Spacing.md },
          { alignItems: rtl.alignStart }
        ]}>
          <View style={styles.header}>
            <Text
              style={[styles.title, { color: colors.text, textAlign: rtl.textAlign }]}
              numberOfLines={2}
            >
              {storyName}
            </Text>
          </View>

          <Text
            style={[styles.description, { color: colors.textSecondary, textAlign: rtl.textAlign }]}
            numberOfLines={2}
          >
            {storyDescription}
          </Text>

          <View style={[styles.footer, { flexDirection: rtl.row }]}>
            <View style={[styles.durationContainer, { flexDirection: rtl.row }]}>
              <Text style={[
                styles.clockIcon,
                rtl.isRTL ? { marginLeft: 4 } : { marginRight: 4 }
              ]}>📖</Text>
              <Text style={[styles.durationText, { color: colors.textSecondary }]}>
                {t('durations.minutes', { count: totalReadingTime })}
              </Text>
            </View>

            {/* Arrow indicator */}
            <Text style={[styles.arrow, { color: colors.primary }]}>
              {rtl.isRTL ? '‹' : '›'}
            </Text>
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
    // flexDirection applied dynamically via rtl.row
    height: 180,
    borderRadius: Radius.md,
    padding: Spacing.lg,
    ...Shadows.sm,
  },
  content: {
    flex: 1,
    // marginLeft/Right applied dynamically based on RTL
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
    // flexDirection applied dynamically via rtl.row
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  durationContainer: {
    // flexDirection applied dynamically via rtl.row
    alignItems: 'center',
  },
  clockIcon: {
    fontSize: 12,
    // margin applied dynamically based on RTL
  },
  durationText: {
    ...TextStyles.labelSmall,
    fontSize: 12,
  },
  arrow: {
    fontSize: 28,
    fontWeight: '300',
  },
});
