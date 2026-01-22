/**
 * Language Selection Screen
 * Choose primary language during onboarding
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
import { LanguageSelector } from '@/components/settings/language-selector';
import { Spacing, TextStyles, Radius } from '@/constants/theme';
import { useAppTheme } from '@/hooks/use-app-theme';
import { useUserStore } from '@/store/user-store';

export default function LanguageScreen() {
  const { colors } = useAppTheme();
  const router = useRouter();
  const { language, setLanguage } = useUserStore();

  const handleContinue = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push('/onboarding/preferences');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <Animated.View
          entering={FadeIn.duration(600)}
          style={styles.header}
        >
          <Text style={[styles.titleEnglish, { color: colors.text }]}>
            Choose Language
          </Text>
          <Text style={[styles.titleArabic, { color: colors.primary }]}>
            اختر اللغة
          </Text>
        </Animated.View>

        {/* Language Options */}
        <Animated.View
          entering={FadeInDown.duration(600).delay(200)}
          style={styles.selectorContainer}
        >
          <LanguageSelector
            selected={language}
            onSelect={setLanguage}
          />
        </Animated.View>

        {/* Info Note */}
        <Animated.View
          entering={FadeInDown.duration(600).delay(400)}
          style={[
            styles.infoCard,
            { backgroundColor: colors.accentLight },
          ]}
        >
          <Text style={styles.infoIcon}>ℹ️</Text>
          <Text style={[styles.infoText, { color: colors.text }]}>
            Arabic text will always appear alongside your chosen language to maintain the spiritual connection with the original texts.
          </Text>
        </Animated.View>
      </View>

      {/* Continue Button */}
      <Animated.View
        entering={FadeInDown.duration(600).delay(600)}
        style={styles.buttonContainer}
      >
        <Pressable
          onPress={handleContinue}
          style={({ pressed }) => [
            styles.button,
            { backgroundColor: colors.primary },
            pressed && styles.buttonPressed,
          ]}
          accessibilityRole="button"
          accessibilityLabel="Continue"
        >
          <Text style={[styles.buttonText, { color: colors.textInverse }]}>
            Continue
          </Text>
        </Pressable>

        {/* Progress Indicator */}
        <View style={styles.progressContainer}>
          <View style={[styles.progressDot, { backgroundColor: colors.primary }]} />
          <View style={[styles.progressDot, styles.progressDotActive, { backgroundColor: colors.primary }]} />
          <View style={[styles.progressDot, { backgroundColor: colors.border }]} />
          <View style={[styles.progressDot, { backgroundColor: colors.border }]} />
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
    paddingTop: Spacing.xxxl,
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  titleEnglish: {
    ...TextStyles.displayMedium,
    marginBottom: Spacing.xs,
  },
  titleArabic: {
    ...TextStyles.arabicLarge,
  },
  selectorContainer: {
    marginBottom: Spacing.xl,
  },
  infoCard: {
    flexDirection: 'row',
    padding: Spacing.md,
    borderRadius: Radius.md,
  },
  infoIcon: {
    fontSize: 18,
    marginRight: Spacing.sm,
  },
  infoText: {
    ...TextStyles.bodySmall,
    flex: 1,
    lineHeight: 20,
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
