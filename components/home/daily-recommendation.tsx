/**
 * Daily Recommendation Component
 * Suggests a story based on reading history and time
 */

import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
} from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Colors, Spacing, Radius, TextStyles, Shadows } from '@/constants/theme';
import { useAppTheme } from '@/hooks/use-app-theme';
import { useTranslation } from '@/hooks/use-translation';
import { useReadingStore } from '@/store/reading-store';
import { getAllStories } from '@/data/stories';
import { getChaptersByStoryId } from '@/data/chapters';
import { Story, StoryCategory } from '@/types';

export function DailyRecommendation() {
  const { colors } = useAppTheme();
  const { t } = useTranslation();
  const router = useRouter();
  const { chapterProgress } = useReadingStore();

  // Algorithm to suggest a story
  const recommendedStory = useMemo(() => {
    const allStories = getAllStories();
    
    // Get stories with unread chapters
    const storiesWithUnread = allStories.filter((story) => {
      const chapters = getChaptersByStoryId(story.id);
      return chapters.some((chapter) => {
        const progress = chapterProgress[chapter.id];
        return !progress || progress.completedSessions === 0;
      });
    });

    if (storiesWithUnread.length === 0) {
      // All stories read, suggest a random one
      return allStories[Math.floor(Math.random() * allStories.length)];
    }

    // Rotate between categories based on time of day
    const hour = new Date().getHours();
    const categoryIndex = Math.floor(hour / 8) % 3;
    const categories: StoryCategory[] = ['prophets', 'sahabah', 'educational'];
    const preferredCategory = categories[categoryIndex];

    // Try to find a story in preferred category
    const categoryStories = storiesWithUnread.filter(
      (s) => s.category === preferredCategory
    );

    if (categoryStories.length > 0) {
      return categoryStories[Math.floor(Math.random() * categoryStories.length)];
    }

    // Fallback to any unread story
    return storiesWithUnread[Math.floor(Math.random() * storiesWithUnread.length)];
  }, [chapterProgress]);

  if (!recommendedStory) return null;

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push(`/chapters/${recommendedStory.id}`);
  };

  const categoryLabels: Record<StoryCategory, { en: string; ar: string; icon: string }> = {
    prophets: { en: t('categories.prophets'), ar: t('categories.prophetsAr'), icon: '🌙' },
    sahabah: { en: t('categories.sahabah'), ar: t('categories.sahabahAr'), icon: '⭐' },
    educational: { en: t('categories.educational'), ar: t('categories.educationalAr'), icon: '📚' },
  };

  const categoryInfo = categoryLabels[recommendedStory.category];

  return (
    <Animated.View entering={FadeInDown.duration(400).delay(100)}>
      <Pressable
        onPress={handlePress}
        style={({ pressed }) => [
          styles.container,
          {
            backgroundColor: colors.backgroundCard,
            borderColor: colors.primary,
            opacity: pressed ? 0.8 : 1,
            transform: [{ scale: pressed ? 0.98 : 1 }],
          },
        ]}
      >
        <View style={styles.header}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>
            {t('home.dailyRecommendation')}
          </Text>
          <View style={[styles.categoryBadge, { backgroundColor: colors.accentLight }]}>
            <Text style={styles.categoryIcon}>{categoryInfo.icon}</Text>
            <Text style={[styles.categoryText, { color: colors.primary }]}>
              {categoryInfo.en}
            </Text>
          </View>
        </View>

        <Text style={[styles.storyNameAr, { color: colors.primary }]}>
          {recommendedStory.nameAr}
        </Text>
        <Text style={[styles.storyNameEn, { color: colors.text }]}>
          {recommendedStory.nameEn}
        </Text>
        <Text style={[styles.description, { color: colors.textSecondary }]} numberOfLines={2}>
          {recommendedStory.shortDescription}
        </Text>

        <View style={styles.footer}>
          <Text style={[styles.arrow, { color: colors.primary }]}>Start Reading →</Text>
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.lg,
    borderRadius: Radius.lg,
    borderWidth: 1.5,
    marginBottom: Spacing.lg,
    ...Shadows.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  label: {
    ...TextStyles.labelSmall,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.sm,
    gap: Spacing.xs,
  },
  categoryIcon: {
    fontSize: 12,
  },
  categoryText: {
    ...TextStyles.labelSmall,
    fontSize: 10,
    fontWeight: '600',
  },
  storyNameAr: {
    ...TextStyles.arabicLarge,
    marginBottom: Spacing.xs,
  },
  storyNameEn: {
    ...TextStyles.headingMedium,
    marginBottom: Spacing.sm,
  },
  description: {
    ...TextStyles.bodySmall,
    marginBottom: Spacing.md,
  },
  footer: {
    alignItems: 'flex-end',
  },
  arrow: {
    ...TextStyles.labelMedium,
  },
});
