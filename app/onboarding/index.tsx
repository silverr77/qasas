/**
 * Welcome Screen
 * First screen of the onboarding flow
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { SafeAreaView } from '@/components/ui/safe-area-view';
import { Spacing, TextStyles, Radius, Palette } from '@/constants/theme';
import { useAppTheme } from '@/hooks/use-app-theme';
import { useTranslation } from '@/hooks/use-translation';

export default function WelcomeScreen() {
  const { colors, isDark } = useAppTheme();
  const { t } = useTranslation();
  const router = useRouter();

  const handleGetStarted = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push('/onboarding/language');
  };

  const gradientColors = isDark
    ? ['#1C1B18', '#242320', '#1C1B18'] as const
    : [Palette.sand[50], Palette.sand[100], Palette.sand[50]] as const;

  return (
    <LinearGradient colors={gradientColors} style={styles.gradient}>
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          {/* Moon Icon */}
          <Animated.View
            entering={FadeIn.duration(800).delay(200)}
            style={styles.iconContainer}
          >
            <Text style={styles.moonIcon}>🌙</Text>
          </Animated.View>

          {/* Title */}
          <Animated.Text
            entering={FadeInDown.duration(600).delay(400)}
            style={[styles.titleEnglish, { color: colors.text }]}
          >
            {t('onboarding.welcome')}
          </Animated.Text>

          {/* Tagline */}
          <Animated.Text
            entering={FadeInDown.duration(600).delay(800)}
            style={[styles.tagline, { color: colors.textSecondary }]}
          >
            {t('onboarding.tagline')}
          </Animated.Text>

          {/* Decorative elements */}
          <Animated.View
            entering={FadeIn.duration(600).delay(1000)}
            style={styles.decorativeContainer}
          >
            <View style={[styles.decorativeLine, { backgroundColor: colors.border }]} />
            <Text style={styles.decorativeStars}>✦ ✦ ✦</Text>
            <View style={[styles.decorativeLine, { backgroundColor: colors.border }]} />
          </Animated.View>
        </View>

        {/* Get Started Button */}
        <Animated.View
          entering={FadeInDown.duration(600).delay(1200)}
          style={styles.buttonContainer}
        >
          <Pressable
            onPress={handleGetStarted}
            style={({ pressed }) => [
              styles.button,
              { backgroundColor: colors.primary },
              pressed && styles.buttonPressed,
            ]}
            accessibilityRole="button"
            accessibilityLabel={t('onboarding.getStarted')}
          >
            <Text style={[styles.buttonText, { color: colors.textInverse }]}>
              {t('onboarding.getStarted')}
            </Text>
          </Pressable>

          <Text style={[styles.footerText, { color: colors.textTertiary }]}>
            {t('onboarding.beginJourney')}
          </Text>
        </Animated.View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
  },
  iconContainer: {
    marginBottom: Spacing.xl,
  },
  moonIcon: {
    fontSize: 80,
  },
  /* Removed titleArabic style */
  _unusedTitleArabic: {
    ...TextStyles.arabicDisplay,
    marginBottom: Spacing.sm,
  },
  titleEnglish: {
    ...TextStyles.displayLarge,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  tagline: {
    ...TextStyles.bodyLarge,
    textAlign: 'center',
    lineHeight: 28,
  },
  decorativeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.xl,
  },
  decorativeLine: {
    width: 40,
    height: 1,
  },
  decorativeStars: {
    fontSize: 12,
    marginHorizontal: Spacing.md,
    color: '#C4A86B',
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
  footerText: {
    ...TextStyles.bodySmall,
    marginTop: Spacing.md,
  },
});
