/**
 * Recent Activity Component
 * Shows last 3 stories read
 */

import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Colors, Spacing, Radius, TextStyles } from '@/constants/theme';
import { useAppTheme } from '@/hooks/use-app-theme';
import { useTranslation } from '@/hooks/use-translation';
import { useReadingStore } from '@/store/reading-store';
import { getAllStories } from '@/data/stories';
import { getChaptersByStoryId, getChapterById } from '@/data/chapters';
import { StoryCategory } from '@/types';

export function RecentActivity() {
  const { colors } = useAppTheme();
  const { t } = useTranslation();
  const router = useRouter();
  const { chapterProgress, preferences } = useReadingStore();

  // Get recent chapters (last 3 with progress)
  const recentChapters = useMemo(() => {
    const chaptersWithProgress = Object.entries(chapterProgress)
      .filter(([_, progress]) => progress.completedSessions > 0)
      .map(([chapterId, progress]) => ({
        chapterId,
        progress,
        chapter: getChapterById(chapterId),
      }))
      .filter((item) => item.chapter)
      .sort((a, b) => {
        // Sort by most recent (simplified - would use actual timestamp in real app)
        return b.progress.completedSessions - a.progress.completedSessions;
      })
      .slice(0, 3);

    return chaptersWithProgress.map((item) => {
      const allStories = getAllStories();
      const story = allStories.find((s) => {
        const chapters = getChaptersByStoryId(s.id);
        return chapters.some((c) => c.id === item.chapterId);
      });

      return {
        ...item,
        story,
      };
    });
  }, [chapterProgress]);

  if (recentChapters.length === 0) return null;

  const categoryLabels: Record<StoryCategory, { icon: string }> = {
    prophets: { icon: '🌙' },
    sahabah: { icon: '⭐' },
    educational: { icon: '📚' },
  };

  return (
    <Animated.View entering={FadeInDown.duration(400).delay(300)}>
      <View style={styles.container}>
        <Text style={[styles.title, { color: colors.text }]}>
          {t('home.recentActivity')}
        </Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {recentChapters.map((item, index) => {
            if (!item.chapter || !item.story) return null;

            const story = item.story;
            const categoryInfo = categoryLabels[story.category];

            return (
              <Pressable
                key={item.chapterId}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  router.push(`/chapters/${story.id}`);
                }}
                style={({ pressed }) => [
                  styles.card,
                  {
                    backgroundColor: colors.backgroundCard,
                    opacity: pressed ? 0.8 : 1,
                    transform: [{ scale: pressed ? 0.98 : 1 }],
                  },
                ]}
              >
                <View style={styles.cardHeader}>
                  <Text style={styles.categoryIcon}>{categoryInfo.icon}</Text>
                  <Text style={[styles.categoryLabel, { color: colors.textTertiary }]}>
                    {item.story.category}
                  </Text>
                </View>
                <Text style={[styles.chapterTitle, { color: colors.text }]} numberOfLines={2}>
                  {item.chapter.title}
                </Text>
                <Text style={[styles.storyName, { color: colors.textSecondary }]} numberOfLines={1}>
                  {story.nameEn}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.lg,
  },
  title: {
    ...TextStyles.headingSmall,
    marginBottom: Spacing.md,
    paddingHorizontal: Spacing.lg,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.md,
  },
  card: {
    width: 200,
    padding: Spacing.md,
    borderRadius: Radius.md,
    marginRight: Spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
    gap: Spacing.xs,
  },
  categoryIcon: {
    fontSize: 16,
  },
  categoryLabel: {
    ...TextStyles.labelSmall,
    fontSize: 10,
    textTransform: 'capitalize',
  },
  chapterTitle: {
    ...TextStyles.labelMedium,
    marginBottom: Spacing.xs,
  },
  storyName: {
    ...TextStyles.bodySmall,
  },
});
