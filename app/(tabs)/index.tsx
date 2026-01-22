/**
 * HomeScreen
 * Main landing screen with greeting and navigation
 */

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { SafeAreaView } from '@/components/ui/safe-area-view';
import { Button } from '@/components/ui/button';
import { Colors, Spacing, Radius, TextStyles, Palette } from '@/constants/theme';
import { useAppTheme } from '@/hooks/use-app-theme';
import { useReadingStore } from '@/store/reading-store';
import { getTimeBasedGreeting, formatCountdown } from '@/utils/timer';
import { getChapterById } from '@/data/chapters';
import { getProphetById } from '@/data/prophets';

export default function HomeScreen() {
  const { colors, isDark } = useAppTheme();
  const router = useRouter();

  const { preferences, isChapterLocked, getUnlockTime } = useReadingStore();

  const [greeting, setGreeting] = useState(getTimeBasedGreeting());
  const [countdown, setCountdown] = useState<string | null>(null);

  // Get last read chapter info
  const lastChapter = preferences.lastReadChapterId
    ? getChapterById(preferences.lastReadChapterId)
    : null;
  const lastProphet = preferences.lastReadProphetId
    ? getProphetById(preferences.lastReadProphetId)
    : null;

  const isLastChapterLocked = lastChapter
    ? isChapterLocked(lastChapter.id)
    : false;
  const unlockTime = lastChapter ? getUnlockTime(lastChapter.id) : null;

  // Update countdown timer
  useEffect(() => {
    if (!unlockTime) {
      setCountdown(null);
      return;
    }

    const updateCountdown = () => {
      setCountdown(formatCountdown(unlockTime));
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [unlockTime]);

  // Update greeting based on time
  useEffect(() => {
    const interval = setInterval(() => {
      setGreeting(getTimeBasedGreeting());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleContinueReading = () => {
    if (!lastChapter || !lastProphet) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push(`/reading-setup/${lastChapter.id}`);
  };

  const handleChooseProphet = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push('/prophets');
  };

  const gradientColors = isDark
    ? ['#1C1B18', '#242320', '#1C1B18'] as const
    : [Palette.sand[50], Palette.sand[100], Palette.sand[50]] as const;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <LinearGradient
        colors={gradientColors}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header greeting */}
          <View style={styles.header}>
            <Text style={[styles.greetingAr, { color: colors.primary }]}>
              السلام عليكم
            </Text>
            <Text style={[styles.greetingEn, { color: colors.text }]}>
              Assalamu Alaikum
            </Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              {greeting.greeting}
            </Text>
          </View>

          {/* Decorative element */}
          <View style={styles.decorativeContainer}>
            <Text style={styles.decorativeEmoji}>🌙</Text>
            <View style={[styles.decorativeLine, { backgroundColor: colors.divider }]} />
          </View>

          {/* App title and description */}
          <View style={styles.titleSection}>
            <Text style={[styles.appTitleAr, { color: colors.primary }]}>
              قصص الأنبياء
            </Text>
            <Text style={[styles.appTitle, { color: colors.text }]}>
              Stories of the Prophets
            </Text>
            <Text style={[styles.appDescription, { color: colors.textSecondary }]}>
              Take a moment each day to reflect on the wisdom and guidance in the stories of the prophets.
            </Text>
          </View>

          {/* Continue reading card (if applicable) */}
          {lastChapter && lastProphet && (
            <View
              style={[
                styles.continueCard,
                {
                  backgroundColor: colors.backgroundCard,
                  borderColor: isLastChapterLocked ? colors.border : colors.primary,
                },
              ]}
            >
              <View style={styles.continueHeader}>
                <Text style={[styles.continueLabel, { color: colors.textSecondary }]}>
                  {isLastChapterLocked ? 'Time for Reflection' : 'Continue Today\'s Story'}
                </Text>
                <Text style={styles.continueEmoji}>
                  {isLastChapterLocked ? '🤍' : '📖'}
                </Text>
              </View>

              <Text
                style={[styles.continueTitle, { color: colors.text }]}
                numberOfLines={1}
              >
                {lastChapter.title}
              </Text>
              <Text style={[styles.continueProphet, { color: colors.textSecondary }]}>
                {lastProphet.nameEn}
              </Text>

              {isLastChapterLocked && countdown ? (
                <View style={styles.lockedContainer}>
                  <Text style={[styles.lockedMessage, { color: colors.textTertiary }]}>
                    Continue tomorrow 🤍
                  </Text>
                  <Text style={[styles.countdownText, { color: colors.primary }]}>
                    Unlocks in {countdown}
                  </Text>
                </View>
              ) : (
                <Button
                  title="Continue Reading"
                  onPress={handleContinueReading}
                  variant="primary"
                  style={styles.continueButton}
                />
              )}
            </View>
          )}

          {/* Choose prophet button */}
          <View style={styles.actionsContainer}>
            <Button
              title="Choose a Prophet"
              onPress={handleChooseProphet}
              variant={lastChapter ? 'outline' : 'primary'}
              size="large"
              fullWidth
            />
          </View>

          {/* Inspirational quote */}
          <View style={styles.quoteContainer}>
            <Text style={[styles.quoteText, { color: colors.textSecondary }]}>
              "Indeed, in their stories, there is a lesson for those of understanding."
            </Text>
            <Text style={[styles.quoteSource, { color: colors.textTertiary }]}>
              — Surah Yusuf, Verse 111
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xxxl,
  },
  header: {
    alignItems: 'center',
    marginTop: Spacing.xl,
    marginBottom: Spacing.lg,
  },
  greetingAr: {
    ...TextStyles.arabicLarge,
    marginBottom: Spacing.xs,
  },
  greetingEn: {
    ...TextStyles.headingLarge,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    ...TextStyles.bodyMedium,
  },
  decorativeContainer: {
    alignItems: 'center',
    marginVertical: Spacing.lg,
  },
  decorativeEmoji: {
    fontSize: 32,
    marginBottom: Spacing.sm,
  },
  decorativeLine: {
    height: 1,
    width: 100,
  },
  titleSection: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  appTitleAr: {
    ...TextStyles.arabicLarge,
    marginBottom: Spacing.xs,
  },
  appTitle: {
    ...TextStyles.headingMedium,
    marginBottom: Spacing.sm,
  },
  appDescription: {
    ...TextStyles.bodyMedium,
    textAlign: 'center',
    paddingHorizontal: Spacing.lg,
  },
  continueCard: {
    padding: Spacing.lg,
    borderRadius: Radius.lg,
    borderWidth: 1.5,
    marginBottom: Spacing.lg,
  },
  continueHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  continueLabel: {
    ...TextStyles.labelSmall,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  continueEmoji: {
    fontSize: 20,
  },
  continueTitle: {
    ...TextStyles.headingMedium,
    marginBottom: Spacing.xs,
  },
  continueProphet: {
    ...TextStyles.bodySmall,
    marginBottom: Spacing.md,
  },
  lockedContainer: {
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  lockedMessage: {
    ...TextStyles.bodyMedium,
    marginBottom: Spacing.xs,
  },
  countdownText: {
    ...TextStyles.labelMedium,
  },
  continueButton: {
    marginTop: Spacing.sm,
  },
  actionsContainer: {
    marginBottom: Spacing.xl,
  },
  quoteContainer: {
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
  },
  quoteText: {
    ...TextStyles.bodyMedium,
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  quoteSource: {
    ...TextStyles.labelSmall,
  },
});
