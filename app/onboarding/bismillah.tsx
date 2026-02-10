/**
 * Bismillah Screen
 * Final onboarding screen before entering the app
 */

import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
} from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeIn, FadeInDown, FadeInUp } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { SafeAreaView } from '@/components/ui/safe-area-view';
import { Spacing, TextStyles, Radius } from '@/constants/theme';
import { useAppTheme } from '@/hooks/use-app-theme';
import { useTranslation } from '@/hooks/use-translation';
import { useRTL } from '@/hooks/use-rtl';
import { useUserStore } from '@/store/user-store';

export default function BismillahScreen() {
  const { colors } = useAppTheme();
  const { t } = useTranslation();
  const rtl = useRTL();
  const router = useRouter();
  const { language, completeOnboarding } = useUserStore();

  const handleBeginJourney = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    completeOnboarding();
    router.replace('/');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Decorative top */}
        <Animated.View
          entering={FadeIn.duration(800).delay(200)}
          style={styles.decorativeTop}
        >
          <Text style={[styles.decorativeStars, { color: colors.primary }]}>
            ✦ ✦ ✦
          </Text>
        </Animated.View>

        {/* Bismillah content based on language */}
        {language === 'ar' ? (
          <Animated.View
            entering={FadeIn.duration(1000).delay(600)}
            style={styles.bismillahContainer}
          >
            <Text style={[styles.bismillahArabic, { color: colors.primary }]}>
              {t('onboarding.bismillahAr')}
            </Text>
          </Animated.View>
        ) : (
          <Animated.View
            entering={FadeInDown.duration(600).delay(1200)}
            style={styles.translationContainer}
          >
            <Text style={[styles.translationText, { color: colors.text }]}>
              {t('onboarding.bismillahEn1')}
            </Text>
            <Text style={[styles.translationText, { color: colors.text }]}>
              {t('onboarding.bismillahEn2')}
            </Text>
            <Text style={[styles.translationText, { color: colors.text }]}>
              {t('onboarding.bismillahEn3')}
            </Text>
          </Animated.View>
        )}

        {/* Decorative bottom */}
        <Animated.View
          entering={FadeIn.duration(800).delay(1600)}
          style={styles.decorativeBottom}
        >
          <View style={[styles.decorativeLine, { backgroundColor: colors.border }]} />
          <Text style={[styles.moonIcon]}>🌙</Text>
          <View style={[styles.decorativeLine, { backgroundColor: colors.border }]} />
        </Animated.View>
      </View>

      {/* Begin Journey Button */}
      <Animated.View
        entering={FadeInUp.duration(600).delay(2000)}
        style={styles.buttonContainer}
      >
        <Pressable
          onPress={handleBeginJourney}
          style={({ pressed }) => [
            styles.button,
            { backgroundColor: colors.primary },
            pressed && styles.buttonPressed,
          ]}
          accessibilityRole="button"
          accessibilityLabel={t('onboarding.beginYourJourney')}
        >
          <Text style={[styles.buttonText, { color: colors.textInverse }]}>
            {t('onboarding.beginYourJourney')}
          </Text>
        </Pressable>

        {/* Progress Indicator (3 steps: preferences, notifications, bismillah) */}
        <View style={[styles.progressContainer, { flexDirection: rtl.row }]}>
          <View style={[styles.progressDot, { backgroundColor: colors.primary }]} />
          <View style={[styles.progressDot, { backgroundColor: colors.primary }]} />
          <View style={[styles.progressDot, styles.progressDotActive, { backgroundColor: colors.primary }]} />
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
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
  },
  decorativeTop: {
    marginBottom: Spacing.xxl,
  },
  decorativeStars: {
    fontSize: 16,
    letterSpacing: 8,
  },
  bismillahContainer: {
    marginBottom: Spacing.xl,
  },
  bismillahArabic: {
    fontSize: 36,
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 60,
  },
  translationContainer: {
    alignItems: 'center',
    marginBottom: Spacing.xxl,
  },
  translationText: {
    ...TextStyles.bodyLarge,
    textAlign: 'center',
    lineHeight: 32,
  },
  decorativeBottom: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  decorativeLine: {
    width: 60,
    height: 1,
  },
  moonIcon: {
    fontSize: 24,
    marginHorizontal: Spacing.md,
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
