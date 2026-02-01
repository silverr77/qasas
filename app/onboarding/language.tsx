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
  I18nManager,
} from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { SafeAreaView } from '@/components/ui/safe-area-view';
import { LanguageSelector } from '@/components/settings/language-selector';
import { Spacing, TextStyles, Radius } from '@/constants/theme';
import { useAppTheme } from '@/hooks/use-app-theme';
import { useTranslation } from '@/hooks/use-translation';
import { useUserStore } from '@/store/user-store';

export default function LanguageScreen() {
  const { colors } = useAppTheme();
  const { t } = useTranslation();
  const router = useRouter();
  const { language, setLanguage } = useUserStore();

  const handleLanguageChange = (newLanguage: 'en' | 'ar') => {
    setLanguage(newLanguage);
    // Set RTL immediately for onboarding
    const newIsRTL = newLanguage === 'ar';
    if (I18nManager.isRTL !== newIsRTL) {
      I18nManager.forceRTL(newIsRTL);
      I18nManager.allowRTL(newIsRTL);
    }
  };

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
            {t('onboarding.chooseLanguage')}
          </Text>
        </Animated.View>

        {/* Language Options */}
        <Animated.View
          entering={FadeInDown.duration(600).delay(200)}
          style={styles.selectorContainer}
        >
          <LanguageSelector
            selected={language}
            onSelect={handleLanguageChange}
          />
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
          accessibilityLabel={t('common.continue')}
        >
          <Text style={[styles.buttonText, { color: colors.textInverse }]}>
            {t('common.continue')}
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
    justifyContent: 'center', // Center content vertically
    paddingBottom: Spacing.xxl,
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  titleEnglish: {
    ...TextStyles.displayMedium,
    marginBottom: Spacing.xs,
  },
  selectorContainer: {
    marginBottom: Spacing.xl,
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
