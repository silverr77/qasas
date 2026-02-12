/**
 * ProgressScreen (Explore tab)
 * Shows reading progress and stats
 */

import React, { useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from '@/components/ui/safe-area-view';
import { ScreenHeader } from '@/components/ui/screen-header';
import { Spacing, TextStyles, Radius, Shadows } from '@/constants/theme';
import { useAppTheme } from '@/hooks/use-app-theme';
import { useTranslation } from '@/hooks/use-translation';
import { useRTL } from '@/hooks/use-rtl';
import { useReadingStore } from '@/store/reading-store';
import { useUserStore } from '@/store/user-store';
import { chapters } from '@/data/chapters';
import { prophets } from '@/data/prophets';
import { AdBanner } from '@/components/ads/AdBanner';
import { AdUnitIds } from '@/services/adService';
import { useInterstitialAd } from '@/hooks/use-interstitial-ad';

const INTERSTITIAL_NAV_DELAY_MS = 800;

export default function ProgressScreen() {
  const { colors } = useAppTheme();
  const { t } = useTranslation();
  const rtl = useRTL();
  const language = useUserStore((state) => state.language);

  const { chapterProgress, preferences } = useReadingStore();
  const { showIfNavigationReady } = useInterstitialAd();

  useFocusEffect(
    useCallback(() => {
      const timeoutId = setTimeout(() => showIfNavigationReady(), INTERSTITIAL_NAV_DELAY_MS);
      return () => clearTimeout(timeoutId);
    }, [showIfNavigationReady])
  );

  // Calculate stats
  const totalChapters = chapters.length;
  const completedChapters = Object.values(chapterProgress).filter(
    (p) => p.completedSessions > 0
  ).length;
  const totalSessions = Object.values(chapterProgress).reduce(
    (acc, p) => acc + p.completedSessions,
    0
  );

  // Get stories started
  const storiesStarted = new Set(
    Object.keys(chapterProgress)
      .map((chapterId) => {
        const chapter = chapters.find((c) => c.id === chapterId);
        return chapter?.storyId;
      })
      .filter(Boolean)
  ).size;

  return (
    <SafeAreaView>
      <ScreenHeader
        title={t('progress.title')}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Encouragement message */}
        <View style={styles.messageContainer}>
          <Text style={styles.messageEmoji}>🌱</Text>
          <Text style={[styles.messageText, { color: colors.textSecondary, textAlign: rtl.textAlign }]}>
            {totalSessions === 0
              ? t('progress.emptyState')
              : t('progress.emptyStateMessage')}
          </Text>
        </View>

        {/* Stats grid */}
        <View style={[styles.statsGrid, { flexDirection: rtl.row }]}>
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
            <Text style={[styles.statLabel, { color: colors.textSecondary, textAlign: rtl.textAlign }]}>
              {t('progress.readingSessions')}
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
            <Text style={[styles.statLabel, { color: colors.textSecondary, textAlign: rtl.textAlign }]}>
              {t('progress.chaptersRead')}
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
              {storiesStarted}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary, textAlign: rtl.textAlign }]}>
              {t('progress.prophetsExplored')}
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
            <Text style={[styles.statLabel, { color: colors.textSecondary, textAlign: rtl.textAlign }]}>
              {t('progress.totalProphets')}
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
              alignItems: rtl.alignStart,
            },
          ]}
        >
          <Text style={[styles.overviewTitle, { color: colors.text, textAlign: rtl.textAlign }]}>
            {t('progress.readingJourney')}
          </Text>
          <View style={[styles.progressBarContainer, { alignItems: rtl.alignStart }]}>
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
                    alignSelf: rtl.isRTL ? 'flex-end' : 'flex-start',
                  },
                ]}
              />
            </View>
            <Text style={[styles.progressText, { color: colors.textSecondary, textAlign: rtl.textAlign }]}>
              {t('progress.chaptersProgress', { completed: completedChapters, total: totalChapters })}
            </Text>
          </View>
        </View>

        {/* Guidance section */}
        <View
          style={[
            styles.guidanceCard,
            { backgroundColor: colors.accentLight, alignItems: rtl.alignStart },
          ]}
        >
          <Text style={[styles.guidanceTitle, { color: colors.text, textAlign: rtl.textAlign }]}>
            {t('progress.wayOfPatience')}
          </Text>
          <Text style={[styles.guidanceText, { color: colors.textSecondary, textAlign: rtl.textAlign }]}>
            {t('progress.patienceMessage')}
          </Text>
        </View>

        {/* Quote */}
        <View style={styles.quoteContainer}>
          <Text style={[styles.quoteArabic, { color: colors.primary, textAlign: 'center' }]}>
            وَتَزَوَّدُوا فَإِنَّ خَيْرَ الزَّادِ التَّقْوَىٰ
          </Text>
          {language === 'en' && (
            <Text style={[styles.quoteEnglish, { color: colors.textSecondary, textAlign: 'center' }]}>
              "And take provisions, but indeed, the best provision is Taqwa (consciousness of Allah)."
            </Text>
          )}
          <Text style={[styles.quoteSource, { color: colors.textTertiary, textAlign: 'center' }]}>
            {language === 'ar' ? '— سورة البقرة، الآية ١٩٧' : '— Surah Al-Baqarah, Verse 197'}
          </Text>
        </View>

        {/* Banner Ad */}
        <View style={styles.adContainer}>
          <AdBanner unitId={AdUnitIds.BANNER_PROGRESS} />
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
  adContainer: {
    marginTop: Spacing.xl,
    alignItems: 'center',
  },
});
