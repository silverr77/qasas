/**
 * Unlock Screen Component
 * Shows a rewarded ad prompt to unlock locked chapters.
 * Watching an ad is the only way to unlock chapters beyond the first 2.
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { SafeAreaView } from '@/components/ui/safe-area-view';
import { Button } from '@/components/ui/button';
import { Spacing, Radius, TextStyles } from '@/constants/theme';
import { useAppTheme } from '@/hooks/use-app-theme';
import { useUnlockStore } from '@/store/unlock-store';
import { useTranslation } from '@/hooks/use-translation';
import { useRewardedAd } from '@/hooks/use-rewarded-ad';
import { StoryCategory } from '@/types';

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
  const { unlockChapter } = useUnlockStore();

  const [isUnlocking, setIsUnlocking] = useState(false);

  // Rewarded ad for unlocking
  const onRewardEarned = useCallback(() => {
    unlockChapter(chapterId, storyId, category, 'ad');
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }, [chapterId, storyId, category, unlockChapter]);

  const onAdClosed = useCallback(() => {
    setIsUnlocking(false);
    // Navigate only after ad is closed — the reward is already recorded
    onUnlocked();
  }, [onUnlocked]);

  const onAdError = useCallback((_error: Error) => {
    // If ad fails, still unlock (graceful fallback)
    unlockChapter(chapterId, storyId, category, 'ad');
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setIsUnlocking(false);
    onUnlocked();
  }, [chapterId, storyId, category, unlockChapter, onUnlocked]);

  const { loaded: adLoaded, show: showRewardedAd } = useRewardedAd({
    onRewardEarned,
    onAdClosed,
    onError: onAdError,
  });

  const handleWatchAd = () => {
    setIsUnlocking(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    const shown = showRewardedAd();
    if (!shown) {
      // Ad not loaded — fall back: unlock after brief delay
      setTimeout(() => {
        unlockChapter(chapterId, storyId, category, 'ad');
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        setIsUnlocking(false);
        onUnlocked();
      }, 1500);
    }
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

        {/* Watch Ad Button */}
        <Pressable
          onPress={handleWatchAd}
          disabled={isUnlocking}
          style={({ pressed }) => [
            styles.watchAdCard,
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
            {adLoaded
              ? t('unlock.watchAdDesc')
              : t('unlock.adLoading')}
          </Text>
          {isUnlocking && (
            <ActivityIndicator
              color={colors.primary}
              style={styles.loading}
            />
          )}
        </Pressable>

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
  watchAdCard: {
    width: '100%',
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
  cancelButton: {
    marginTop: Spacing.xl,
  },
});
