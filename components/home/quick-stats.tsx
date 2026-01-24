/**
 * Quick Stats Widget
 * Mini progress indicator for home screen
 */

import React from 'react';
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
import { getAllStories, getStoriesByCategory } from '@/data/stories';
import { getChaptersByStoryId } from '@/data/chapters';

export function QuickStats() {
  const { colors } = useAppTheme();
  const { t } = useTranslation();
  const router = useRouter();
  const { chapterProgress } = useReadingStore();

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/(tabs)/explore');
  };

  // Calculate stats
  const completedChapters = Object.values(chapterProgress).filter(
    (progress) => progress.completedSessions > 0
  ).length;

  const allStories = getAllStories();
  const prophetsStories = getStoriesByCategory('prophets');
  const sahabahStories = getStoriesByCategory('sahabah');

  // Count chapters read by category
  let prophetsChapters = 0;
  let sahabahChapters = 0;

  Object.keys(chapterProgress).forEach((chapterId) => {
    const progress = chapterProgress[chapterId];
    if (progress.completedSessions > 0) {
      // Find which story this chapter belongs to
      const story = allStories.find((s) => {
        const chapters = getChaptersByStoryId(s.id);
        return chapters.some((c) => c.id === chapterId);
      });
      if (story) {
        if (story.category === 'prophets') prophetsChapters++;
        if (story.category === 'sahabah') sahabahChapters++;
      }
    }
  });

  return (
    <Animated.View entering={FadeInDown.duration(400).delay(200)}>
      <Pressable
        onPress={handlePress}
        style={({ pressed }) => [
          styles.container,
          {
            backgroundColor: colors.backgroundCard,
            opacity: pressed ? 0.8 : 1,
            transform: [{ scale: pressed ? 0.98 : 1 }],
          },
        ]}
      >
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>
            {t('home.quickStats')}
          </Text>
          <Text style={[styles.arrow, { color: colors.textTertiary }]}>›</Text>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: colors.primary }]}>
              {completedChapters}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              {completedChapters === 1
                ? t('home.chaptersReadOne')
                : t('home.chaptersRead', { count: completedChapters })}
            </Text>
          </View>

          {(prophetsChapters > 0 || sahabahChapters > 0) && (
            <View style={styles.categoryBreakdown}>
              <Text style={[styles.breakdownText, { color: colors.textTertiary }]}>
                {t('home.byCategory', {
                  prophets: prophetsChapters,
                  sahabah: sahabahChapters,
                })}
              </Text>
            </View>
          )}
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.lg,
    borderRadius: Radius.lg,
    marginBottom: Spacing.lg,
    ...Shadows.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  title: {
    ...TextStyles.headingSmall,
  },
  arrow: {
    fontSize: 20,
    fontWeight: '300',
  },
  statsRow: {
    gap: Spacing.sm,
  },
  statItem: {
    alignItems: 'flex-start',
  },
  statNumber: {
    ...TextStyles.headingLarge,
    marginBottom: Spacing.xs,
  },
  statLabel: {
    ...TextStyles.bodySmall,
  },
  categoryBreakdown: {
    marginTop: Spacing.xs,
  },
  breakdownText: {
    ...TextStyles.bodySmall,
    fontSize: 12,
  },
});
