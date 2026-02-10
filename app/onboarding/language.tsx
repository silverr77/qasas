/**
 * Language Selection Screen
 * First step of onboarding; no language selected by default.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  I18nManager,
} from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { SafeAreaView } from '@/components/ui/safe-area-view';
import { LanguageSelector } from '@/components/settings/language-selector';
import { Spacing, TextStyles, Radius } from '@/constants/theme';
import { useAppTheme } from '@/hooks/use-app-theme';
import { useTranslation } from '@/hooks/use-translation';
import { useUserStore } from '@/store/user-store';
import type { Language } from '@/store/user-store';
import en from '@/i18n/en';
import ar from '@/i18n/ar';

export default function LanguageScreen() {
  const { colors } = useAppTheme();
  const { t } = useTranslation();
  const router = useRouter();
  const { setLanguage, setOnboardingSawLanguageScreen } = useUserStore();
  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(null);

  const handleLanguageChange = (newLanguage: Language) => {
    setSelectedLanguage(newLanguage);
  };

  const handleContinue = () => {
    if (selectedLanguage == null) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setLanguage(selectedLanguage);
    const newIsRTL = selectedLanguage === 'ar';
    if (I18nManager.isRTL !== newIsRTL) {
      I18nManager.forceRTL(newIsRTL);
      I18nManager.allowRTL(newIsRTL);
    }
    setOnboardingSawLanguageScreen(true);
    router.push('/onboarding');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* App name + spirit sentence in both languages */}
        <Animated.View
          entering={FadeInDown.duration(600).delay(100)}
          style={styles.header}
        >
          <Text style={[styles.appNameEn, { color: colors.text }]}>
            {en.aboutScreen.appName}
          </Text>
          <Text style={[styles.appNameAr, { color: colors.text }]}>
            {ar.aboutScreen.appName}
          </Text>
          <Text style={[styles.taglineEn, { color: colors.textSecondary }]}>
            {en.onboarding.tagline}
          </Text>
          <Text style={[styles.taglineAr, { color: colors.textSecondary }]}>
            {ar.onboarding.tagline}
          </Text>
        </Animated.View>

        {/* Language Options */}
        <Animated.View
          entering={FadeInDown.duration(600).delay(200)}
          style={styles.selectorContainer}
        >
          <LanguageSelector
            selected={selectedLanguage}
            onSelect={handleLanguageChange}
          />
        </Animated.View>
      </View>

      {/* Continue Button - fixed height area so layout doesn't shift when button appears */}
      <View style={styles.buttonContainer}>
        {selectedLanguage != null && (
          <Animated.View
            entering={FadeInDown.duration(600).delay(400)}
            style={styles.buttonWrap}
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
          </Animated.View>
        )}
      </View>
    </SafeAreaView>
  );
}

const BUTTON_AREA_MIN_HEIGHT = 72;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
    justifyContent: 'center',
    paddingBottom: Spacing.xxl,
  },
  header: {
    marginBottom: Spacing.xxl,
    alignItems: 'center',
  },
  appNameEn: {
    ...TextStyles.titleLarge,
    fontSize: 26,
    marginBottom: Spacing.xs,
  },
  appNameAr: {
    ...TextStyles.titleLarge,
    fontSize: 26,
    marginBottom: Spacing.sm,
    writingDirection: 'rtl',
  },
  taglineEn: {
    ...TextStyles.bodyMedium,
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  taglineAr: {
    ...TextStyles.bodyMedium,
    textAlign: 'center',
    writingDirection: 'rtl',
  },
  selectorContainer: {
    marginBottom: Spacing.xl,
  },
  buttonContainer: {
    minHeight: BUTTON_AREA_MIN_HEIGHT,
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonWrap: {
    width: '100%',
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
});
