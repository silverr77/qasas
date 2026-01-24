/**
 * Unlock Screen Component
 * Shows unlock options for locked chapters (ad or wait)
 */

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { SafeAreaView } from '@/components/ui/safe-area-view';
import { Button } from '@/components/ui/button';
import { Colors, Spacing, Radius, TextStyles } from '@/constants/theme';
import { useAppTheme } from '@/hooks/use-app-theme';
import { useUnlockStore } from '@/store/unlock-store';
import { useTranslation } from '@/hooks/use-translation';
import { StoryCategory } from '@/types';
import { formatCountdown } from '@/utils/timer';
import dayjs from 'dayjs';

interface UnlockScreenProps {
  chapterId: string;
  storyId: string;
  category: StoryCategory;
  chapterNumber: number;
  onUnlocked: () => void;
  onCancel?: () => void;
}

export function UnlockScreen({
  chapterId,
  storyId,
  category,
  chapterNumber,
  onUnlocked,
  onCancel,
}: UnlockScreenProps) {
  const { colors } = useAppTheme();
  const { t } = useTranslation();
  const {
    unlockChapter,
    getTimeUntilUnlock,
    canWatchAd,
    shouldShowUnlockOption,
  } = useUnlockStore();

  const [isUnlocking, setIsUnlocking] = useState(false);
  const [unlockMethod, setUnlockMethod] = useState<'ad' | 'wait' | null>(null);
  const [countdown, setCountdown] = useState<string>('');

  const timeUntilUnlock = getTimeUntilUnlock(chapterId);
  const hoursRemaining = Math.floor(timeUntilUnlock / 3600);
  const minutesRemaining = Math.floor((timeUntilUnlock % 3600) / 60);

  // Update countdown
  useEffect(() => {
    if (unlockMethod === 'wait' && timeUntilUnlock > 0) {
      const updateCountdown = () => {
        const hours = Math.floor(timeUntilUnlock / 3600);
        const minutes = Math.floor((timeUntilUnlock % 3600) / 60);
        setCountdown(`${hours}h ${minutes}m`);
      };
      updateCountdown();
      const interval = setInterval(updateCountdown, 60000);
      return () => clearInterval(interval);
    }
  }, [unlockMethod, timeUntilUnlock]);

  const handleWatchAd = async () => {
    setIsUnlocking(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    try {
      // In a real implementation, this would show an ad
      // For now, simulate ad watching
      await new Promise((resolve) => setTimeout(resolve, 2000));

      unlockChapter(chapterId, storyId, category, 'ad');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      onUnlocked();
    } catch (error) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setIsUnlocking(false);
    }
  };

  const handleWaitForFree = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    unlockChapter(chapterId, storyId, category, 'wait');
    setUnlockMethod('wait');
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    
    // Show success message, then unlock after delay
    setTimeout(() => {
      onUnlocked();
    }, 1500);
  };

  const categoryLabels: Record<StoryCategory, { en: string; ar: string }> = {
    prophets: { en: 'Prophet', ar: 'نبي' },
    sahabah: { en: 'Sahabah', ar: 'صحابي' },
    educational: { en: 'Story', ar: 'قصة' },
  };

  const categoryLabel = categoryLabels[category];

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View
        entering={FadeIn.duration(300)}
        style={[styles.content, { backgroundColor: colors.background }]}
      >
        {/* Lock Icon */}
        <View style={styles.iconContainer}>
          <Text style={styles.lockIcon}>🔒</Text>
        </View>

        {/* Title */}
        <Text style={[styles.title, { color: colors.text }]}>
          {t('unlock.title')}
        </Text>

        {/* Category Badge */}
        <View
          style={[
            styles.categoryBadge,
            { backgroundColor: colors.accentLight },
          ]}
        >
          <Text style={[styles.categoryText, { color: colors.primary }]}>
            {categoryLabel.en} • {categoryLabel.ar}
          </Text>
        </View>

        {/* Chapter Info */}
        <Text style={[styles.chapterInfo, { color: colors.textSecondary }]}>
          Chapter {chapterNumber}
        </Text>

        {/* Info Message */}
        <Text style={[styles.infoText, { color: colors.textSecondary }]}>
          {t('unlock.firstTwoFree')}
        </Text>

        {/* Unlock Options */}
        {!unlockMethod && (
          <View style={styles.optionsContainer}>
            {/* Watch Ad Option */}
            <Pressable
              onPress={handleWatchAd}
              disabled={isUnlocking || !canWatchAd(chapterId)}
              style={({ pressed }) => [
                styles.optionCard,
                {
                  backgroundColor: colors.backgroundCard,
                  borderColor: colors.primary,
                  opacity: pressed ? 0.7 : 1,
                },
              ]}
            >
              <Text style={styles.optionIcon}>📺</Text>
              <Text style={[styles.optionTitle, { color: colors.text }]}>
                {t('unlock.watchAd')}
              </Text>
              <Text style={[styles.optionDesc, { color: colors.textSecondary }]}>
                {t('unlock.watchAdDesc')}
              </Text>
              {isUnlocking && (
                <ActivityIndicator
                  color={colors.primary}
                  style={styles.loading}
                />
              )}
            </Pressable>

            {/* Wait Option */}
            <Pressable
              onPress={handleWaitForFree}
              disabled={isUnlocking}
              style={({ pressed }) => [
                styles.optionCard,
                {
                  backgroundColor: colors.backgroundCard,
                  borderColor: colors.border,
                  opacity: pressed ? 0.7 : 1,
                },
              ]}
            >
              <Text style={styles.optionIcon}>⏰</Text>
              <Text style={[styles.optionTitle, { color: colors.text }]}>
                {t('unlock.waitForFree', { hours: 8 })}
              </Text>
              <Text style={[styles.optionDesc, { color: colors.textSecondary }]}>
                {t('unlock.waitForFreeDesc', { time: '8 hours' })}
              </Text>
            </Pressable>
          </View>
        )}

        {/* Wait Timer Display */}
        {unlockMethod === 'wait' && (
          <Animated.View
            entering={FadeIn}
            style={[styles.timerContainer, { backgroundColor: colors.accentLight }]}
          >
            <Text style={[styles.timerText, { color: colors.primary }]}>
              {t('unlock.waitStarted', { hours: 8 })}
            </Text>
            {countdown && (
              <Text style={[styles.countdownText, { color: colors.text }]}>
                {t('unlock.timeRemaining', { time: countdown })}
              </Text>
            )}
          </Animated.View>
        )}

        {/* Cancel Button */}
        {onCancel && (
          <Button
            title={t('common.cancel')}
            onPress={onCancel}
            variant="outline"
            style={styles.cancelButton}
          />
        )}
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
  },
  iconContainer: {
    marginBottom: Spacing.lg,
  },
  lockIcon: {
    fontSize: 64,
  },
  title: {
    ...TextStyles.headingLarge,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  categoryBadge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.md,
    marginBottom: Spacing.md,
  },
  categoryText: {
    ...TextStyles.labelSmall,
    fontWeight: '600',
  },
  chapterInfo: {
    ...TextStyles.bodyMedium,
    marginBottom: Spacing.lg,
  },
  infoText: {
    ...TextStyles.bodySmall,
    textAlign: 'center',
    marginBottom: Spacing.xl,
    paddingHorizontal: Spacing.lg,
  },
  optionsContainer: {
    width: '100%',
    gap: Spacing.md,
  },
  optionCard: {
    padding: Spacing.lg,
    borderRadius: Radius.lg,
    borderWidth: 2,
    alignItems: 'center',
    minHeight: 120,
    justifyContent: 'center',
  },
  optionIcon: {
    fontSize: 32,
    marginBottom: Spacing.sm,
  },
  optionTitle: {
    ...TextStyles.headingSmall,
    marginBottom: Spacing.xs,
    textAlign: 'center',
  },
  optionDesc: {
    ...TextStyles.bodySmall,
    textAlign: 'center',
  },
  loading: {
    marginTop: Spacing.sm,
  },
  timerContainer: {
    padding: Spacing.lg,
    borderRadius: Radius.lg,
    alignItems: 'center',
    marginTop: Spacing.lg,
    width: '100%',
  },
  timerText: {
    ...TextStyles.bodyMedium,
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  countdownText: {
    ...TextStyles.headingSmall,
    textAlign: 'center',
  },
  cancelButton: {
    marginTop: Spacing.xl,
  },
});
