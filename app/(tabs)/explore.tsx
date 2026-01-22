/**
 * ProgressScreen (Explore tab)
 * Shows reading progress and stats
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from '@/components/ui/safe-area-view';
import { ScreenHeader } from '@/components/ui/screen-header';
import { Spacing, TextStyles, Radius, Shadows } from '@/constants/theme';
import { useAppTheme } from '@/hooks/use-app-theme';
import { useReadingStore } from '@/store/reading-store';
import { chapters } from '@/data/chapters';
import { prophets } from '@/data/prophets';

export default function ProgressScreen() {
  const { colors } = useAppTheme();

  const { chapterProgress, preferences } = useReadingStore();

  // Calculate stats
  const totalChapters = chapters.length;
  const completedChapters = Object.values(chapterProgress).filter(
    (p) => p.completedSessions > 0
  ).length;
  const totalSessions = Object.values(chapterProgress).reduce(
    (acc, p) => acc + p.completedSessions,
    0
  );

  // Get prophets started
  const prophetsStarted = new Set(
    Object.keys(chapterProgress)
      .map((chapterId) => {
        const chapter = chapters.find((c) => c.id === chapterId);
        return chapter?.prophetId;
      })
      .filter(Boolean)
  ).size;

  return (
    <SafeAreaView>
      <ScreenHeader
        title="Your Progress"
        titleAr="تقدمك"
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Encouragement message */}
        <View style={styles.messageContainer}>
          <Text style={styles.messageEmoji}>🌱</Text>
          <Text style={[styles.messageText, { color: colors.textSecondary }]}>
            {totalSessions === 0
              ? 'Begin your journey through the stories of the prophets'
              : 'Every reading session plants seeds of wisdom in your heart'}
          </Text>
        </View>

        {/* Stats grid */}
        <View style={styles.statsGrid}>
          <View
            style={[
              styles.statCard,
              {
                backgroundColor: colors.backgroundCard,
                borderColor: colors.border,
              },
            ]}
          >
            <Text style={[styles.statNumber, { color: colors.primary }]}>
              {totalSessions}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              Reading Sessions
            </Text>
          </View>

          <View
            style={[
              styles.statCard,
              {
                backgroundColor: colors.backgroundCard,
                borderColor: colors.border,
              },
            ]}
          >
            <Text style={[styles.statNumber, { color: colors.primary }]}>
              {completedChapters}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              Chapters Read
            </Text>
          </View>

          <View
            style={[
              styles.statCard,
              {
                backgroundColor: colors.backgroundCard,
                borderColor: colors.border,
              },
            ]}
          >
            <Text style={[styles.statNumber, { color: colors.primary }]}>
              {prophetsStarted}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              Prophets Explored
            </Text>
          </View>

          <View
            style={[
              styles.statCard,
              {
                backgroundColor: colors.backgroundCard,
                borderColor: colors.border,
              },
            ]}
          >
            <Text style={[styles.statNumber, { color: colors.primary }]}>
              {prophets.length}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              Total Prophets
            </Text>
          </View>
        </View>

        {/* Progress overview */}
        <View
          style={[
            styles.overviewCard,
            {
              backgroundColor: colors.backgroundCard,
              borderColor: colors.border,
            },
          ]}
        >
          <Text style={[styles.overviewTitle, { color: colors.text }]}>
            Reading Journey
          </Text>
          <View style={styles.progressBarContainer}>
            <View
              style={[
                styles.progressBarBackground,
                { backgroundColor: colors.borderLight },
              ]}
            >
              <View
                style={[
                  styles.progressBarFill,
                  {
                    backgroundColor: colors.primary,
                    width: `${(completedChapters / totalChapters) * 100}%`,
                  },
                ]}
              />
            </View>
            <Text style={[styles.progressText, { color: colors.textSecondary }]}>
              {completedChapters} of {totalChapters} chapters
            </Text>
          </View>
        </View>

        {/* Guidance section */}
        <View
          style={[
            styles.guidanceCard,
            { backgroundColor: colors.accentLight },
          ]}
        >
          <Text style={[styles.guidanceTitle, { color: colors.text }]}>
            The Way of Patience
          </Text>
          <Text style={[styles.guidanceText, { color: colors.textSecondary }]}>
            True learning comes not from rushing through pages, but from allowing each story to settle in your heart. Take your time — the prophets' wisdom has waited centuries for you.
          </Text>
        </View>

        {/* Quote */}
        <View style={styles.quoteContainer}>
          <Text style={[styles.quoteArabic, { color: colors.primary }]}>
            وَتَزَوَّدُوا فَإِنَّ خَيْرَ الزَّادِ التَّقْوَىٰ
          </Text>
          <Text style={[styles.quoteEnglish, { color: colors.textSecondary }]}>
            "And take provisions, but indeed, the best provision is Taqwa (consciousness of Allah)."
          </Text>
          <Text style={[styles.quoteSource, { color: colors.textTertiary }]}>
            — Surah Al-Baqarah, Verse 197
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xxxl,
  },
  messageContainer: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  messageEmoji: {
    fontSize: 40,
    marginBottom: Spacing.sm,
  },
  messageText: {
    ...TextStyles.bodyMedium,
    textAlign: 'center',
    paddingHorizontal: Spacing.lg,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  statCard: {
    width: '47%',
    padding: Spacing.lg,
    borderRadius: Radius.lg,
    borderWidth: 1,
    alignItems: 'center',
    ...Shadows.sm,
  },
  statNumber: {
    ...TextStyles.displayLarge,
    marginBottom: Spacing.xs,
  },
  statLabel: {
    ...TextStyles.labelSmall,
    textAlign: 'center',
  },
  overviewCard: {
    padding: Spacing.lg,
    borderRadius: Radius.lg,
    borderWidth: 1,
    marginBottom: Spacing.xl,
    ...Shadows.sm,
  },
  overviewTitle: {
    ...TextStyles.headingSmall,
    marginBottom: Spacing.md,
  },
  progressBarContainer: {
    gap: Spacing.sm,
  },
  progressBarBackground: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    ...TextStyles.labelSmall,
  },
  guidanceCard: {
    padding: Spacing.lg,
    borderRadius: Radius.lg,
    marginBottom: Spacing.xl,
  },
  guidanceTitle: {
    ...TextStyles.headingSmall,
    marginBottom: Spacing.sm,
  },
  guidanceText: {
    ...TextStyles.bodyMedium,
    lineHeight: 24,
  },
  quoteContainer: {
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
  },
  quoteArabic: {
    ...TextStyles.arabicMedium,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  quoteEnglish: {
    ...TextStyles.bodyMedium,
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  quoteSource: {
    ...TextStyles.labelSmall,
  },
});
