/**
 * Notifications Permission Screen
 * Request notification permissions during onboarding
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
} from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { SafeAreaView } from '@/components/ui/safe-area-view';
import { Spacing, TextStyles, Radius } from '@/constants/theme';
import { useAppTheme } from '@/hooks/use-app-theme';
import { useTranslation } from '@/hooks/use-translation';
import { useUserStore } from '@/store/user-store';

export default function NotificationsScreen() {
  const { colors } = useAppTheme();
  const { t } = useTranslation();
  const router = useRouter();
  const { setNotificationsEnabled } = useUserStore();

  const handleEnableReminders = async () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setNotificationsEnabled(true);
    router.push('/onboarding/bismillah');
  };

  const handleSkip = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setNotificationsEnabled(false);
    router.push('/onboarding/bismillah');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Bell Icon */}
        <Animated.View
          entering={FadeIn.duration(600).delay(200)}
          style={styles.iconContainer}
        >
          <Text style={styles.bellIcon}>🔔</Text>
        </Animated.View>

        {/* Header */}
        <Animated.View
          entering={FadeInDown.duration(600).delay(400)}
          style={styles.header}
        >
          <Text style={[styles.title, { color: colors.text }]}>
            {t('onboarding.dailyReminder')}
          </Text>
        </Animated.View>

        {/* Description */}
        <Animated.View
          entering={FadeInDown.duration(600).delay(600)}
          style={styles.descriptionContainer}
        >
          <Text style={[styles.description, { color: colors.textSecondary }]}>
            {t('onboarding.reminderDescription')}
          </Text>
        </Animated.View>

        {/* Gentle Note */}
        <Animated.View
          entering={FadeInDown.duration(600).delay(800)}
          style={[
            styles.noteCard,
            { backgroundColor: colors.accentLight },
          ]}
        >
          <Text style={styles.noteIcon}>🕊️</Text>
          <Text style={[styles.noteText, { color: colors.text }]}>
            {t('onboarding.reminderNote')}
          </Text>
        </Animated.View>
      </View>

      {/* Buttons */}
      <Animated.View
        entering={FadeInDown.duration(600).delay(1000)}
        style={styles.buttonContainer}
      >
        <Pressable
          onPress={handleEnableReminders}
          style={({ pressed }) => [
            styles.button,
            { backgroundColor: colors.primary },
            pressed && styles.buttonPressed,
          ]}
          accessibilityRole="button"
          accessibilityLabel={t('onboarding.enableReminders')}
        >
          <Text style={[styles.buttonText, { color: colors.textInverse }]}>
            {t('onboarding.enableReminders')}
          </Text>
        </Pressable>

        <Pressable
          onPress={handleSkip}
          style={styles.skipButton}
          accessibilityRole="button"
          accessibilityLabel={t('onboarding.skipForNow')}
        >
          <Text style={[styles.skipText, { color: colors.textSecondary }]}>
            {t('onboarding.skipForNow')}
          </Text>
        </Pressable>

        {/* Progress Indicator */}
        <View style={styles.progressContainer}>
          <View style={[styles.progressDot, { backgroundColor: colors.primary }]} />
          <View style={[styles.progressDot, { backgroundColor: colors.primary }]} />
          <View style={[styles.progressDot, { backgroundColor: colors.primary }]} />
          <View style={[styles.progressDot, styles.progressDotActive, { backgroundColor: colors.primary }]} />
          <View style={[styles.progressDot, { backgroundColor: colors.border }]} />
        </View>
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
    paddingHorizontal: Spacing.xl,
    justifyContent: 'center', // Center content vertically
    alignItems: 'center',
    paddingBottom: Spacing.xxl,
  },
  iconContainer: {
    marginBottom: Spacing.xl,
  },
  bellIcon: {
    fontSize: 64,
  },
  header: {
    marginBottom: Spacing.lg,
  },
  title: {
    ...TextStyles.displayMedium,
    textAlign: 'center',
  },
  descriptionContainer: {
    marginBottom: Spacing.xl,
    paddingHorizontal: Spacing.lg,
  },
  description: {
    ...TextStyles.bodyLarge,
    textAlign: 'center',
    lineHeight: 28,
  },
  noteCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
    borderRadius: Radius.lg,
  },
  noteIcon: {
    fontSize: 32,
    marginRight: Spacing.md,
  },
  noteText: {
    ...TextStyles.bodyMedium,
    lineHeight: 24,
  },
  buttonContainer: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xl,
    alignItems: 'center',
  },
  button: {
    width: '100%',
    paddingVertical: Spacing.md + 4,
    borderRadius: Radius.lg,
    alignItems: 'center',
  },
  buttonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  buttonText: {
    ...TextStyles.labelLarge,
    fontSize: 18,
  },
  skipButton: {
    marginTop: Spacing.md,
    padding: Spacing.sm,
  },
  skipText: {
    ...TextStyles.labelMedium,
  },
  progressContainer: {
    flexDirection: 'row',
    marginTop: Spacing.lg,
    gap: Spacing.sm,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  progressDotActive: {
    width: 24,
  },
});
