/**
 * Reading Preferences Screen
 * Set font size during onboarding
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
import { FontSizeSelector, FONT_SIZES } from '@/components/font-size-selector';
import { Spacing, TextStyles, Radius } from '@/constants/theme';
import { useAppTheme } from '@/hooks/use-app-theme';
import { useTranslation } from '@/hooks/use-translation';
import { useRTL } from '@/hooks/use-rtl';
import { useUserStore } from '@/store/user-store';

const PREVIEW_TEXT = "In the land of Canaan, there lived a young boy named Yusuf. He was blessed with extraordinary beauty and wisdom, and his father Ya'qub loved him dearly...";

export default function PreferencesScreen() {
  const { colors } = useAppTheme();
  const { t } = useTranslation();
  const rtl = useRTL();
  const router = useRouter();
  const { fontSize, setFontSize } = useUserStore();

  const handleContinue = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push('/onboarding/notifications');
  };

  const previewFontSize = FONT_SIZES[fontSize];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <Animated.View
          entering={FadeIn.duration(600)}
          style={styles.header}
        >
          <Text style={[styles.titleEnglish, { color: colors.text, textAlign: 'center' }]}>
            {t('onboarding.readingPreferences')}
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary, textAlign: 'center' }]}>
            {t('onboarding.chooseComfortableSize')}
          </Text>
        </Animated.View>

        {/* Font Size Selector */}
        <Animated.View
          entering={FadeInDown.duration(600).delay(200)}
          style={styles.selectorContainer}
        >
          <FontSizeSelector
            selected={fontSize}
            onSelect={setFontSize}
          />
        </Animated.View>

        {/* Preview Card */}
        <Animated.View
          entering={FadeInDown.duration(600).delay(400)}
          style={[styles.previewSection, { alignItems: rtl.alignStart }]}
        >
          <Text style={[
            styles.previewLabel, 
            { color: colors.textSecondary, textAlign: rtl.textAlign },
            rtl.isRTL ? { marginRight: Spacing.xs } : { marginLeft: Spacing.xs }
          ]}>
            {t('onboarding.preview')}
          </Text>
          <View
            style={[
              styles.previewCard,
              {
                backgroundColor: colors.readingBackground,
                borderColor: colors.border,
              },
            ]}
          >
            <Text
              style={[
                styles.previewText,
                {
                  color: colors.text,
                  fontSize: previewFontSize,
                  lineHeight: previewFontSize * 1.7,
                  textAlign: rtl.textAlign,
                },
              ]}
            >
              {PREVIEW_TEXT}
            </Text>
          </View>
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
        <View style={[styles.progressContainer, { flexDirection: rtl.row }]}>
          <View style={[styles.progressDot, { backgroundColor: colors.primary }]} />
          <View style={[styles.progressDot, { backgroundColor: colors.primary }]} />
          <View style={[styles.progressDot, styles.progressDotActive, { backgroundColor: colors.primary }]} />
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
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  subtitle: {
    ...TextStyles.bodyMedium,
  },
  selectorContainer: {
    marginBottom: Spacing.xl,
  },
  previewSection: {
    flex: 1,
  },
  previewLabel: {
    ...TextStyles.labelSmall,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: Spacing.sm,
    marginLeft: Spacing.xs,
  },
  previewCard: {
    flex: 1,
    padding: Spacing.lg,
    borderRadius: Radius.lg,
    borderWidth: 1,
  },
  previewText: {
    fontFamily: 'System',
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
