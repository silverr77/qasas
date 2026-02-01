/**
 * ReadingPreferencesScreen
 * Grouped reading settings (font size, colors, spacing)
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from '@/components/ui/safe-area-view';
import { ScreenHeader } from '@/components/ui/screen-header';
import { FontSizeSelector } from '@/components/font-size-selector';
import { Spacing, TextStyles, Radius, Shadows } from '@/constants/theme';
import { useAppTheme } from '@/hooks/use-app-theme';
import { useTranslation } from '@/hooks/use-translation';
import { useUserStore } from '@/store/user-store';
import { useRTL } from '@/hooks/use-rtl';

export default function ReadingPreferencesScreen() {
  const { colors } = useAppTheme();
  const { t } = useTranslation();
  const rtl = useRTL();
  const router = useRouter();

  const {
    fontSize,
    textColor,
    backgroundColor,
    lineSpacing,
    setFontSize,
    setTextColor,
    setBackgroundColor,
    setLineSpacing,
  } = useUserStore();

  const textColors: Array<{ value: typeof textColor; label: string; color: string }> = [
    { value: 'black', label: t('readingSettings.colors.black'), color: '#252521' },
    { value: 'darkGray', label: t('readingSettings.colors.darkGray'), color: '#5C5C52' },
    { value: 'brown', label: t('readingSettings.colors.brown'), color: '#7D5533' },
    { value: 'blue', label: t('readingSettings.colors.blue'), color: '#4A7C7E' },
  ];

  const backgroundColors: Array<{ value: typeof backgroundColor; label: string; color: string }> = [
    { value: 'white', label: t('readingSettings.backgrounds.white'), color: '#FFFFFF' },
    { value: 'beige', label: t('readingSettings.backgrounds.beige'), color: '#FDF9F3' },
    { value: 'cream', label: t('readingSettings.backgrounds.cream'), color: '#FAF3E8' },
    { value: 'dark', label: t('readingSettings.backgrounds.dark'), color: '#1F1E1B' },
  ];

  const lineSpacings: Array<{ value: typeof lineSpacing; label: string }> = [
    { value: 'tight', label: t('readingSettings.spacing.tight') },
    { value: 'normal', label: t('readingSettings.spacing.normal') },
    { value: 'wide', label: t('readingSettings.spacing.wide') },
  ];

  return (
    <SafeAreaView edges={['top']} style={{ backgroundColor: colors.creamBackground }}>
      <ScreenHeader
        title={t('readingSettings.title')}
        showBack
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Font Size */}
        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { color: colors.textSecondary }, rtl.textStyle]}>
            {t('readingSettings.fontSize')}
          </Text>
          <View style={[styles.card, { backgroundColor: colors.backgroundCard, borderColor: colors.border }]}>
            <FontSizeSelector
              selected={fontSize}
              onSelect={setFontSize}
            />
          </View>
        </View>

        {/* Text Color */}
        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { color: colors.textSecondary }, rtl.textStyle]}>
            {t('readingSettings.textColor')}
          </Text>
          <View style={[styles.card, { backgroundColor: colors.backgroundCard, borderColor: colors.border, flexDirection: rtl.row, justifyContent: 'space-around' }]}>
            {textColors.map((option) => (
              <Pressable
                key={option.value}
                onPress={() => setTextColor(option.value)}
                style={({ pressed }) => [
                  styles.colorOption,
                  {
                    backgroundColor: option.color,
                    borderColor: textColor === option.value ? colors.primary : colors.border,
                    borderWidth: textColor === option.value ? 3 : 1,
                    opacity: pressed ? 0.7 : 1,
                  },
                ]}
              >
                {textColor === option.value && (
                  <Text style={styles.checkmark}>✓</Text>
                )}
              </Pressable>
            ))}
          </View>
        </View>

        {/* Background Color */}
        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { color: colors.textSecondary }, rtl.textStyle]}>
            {t('readingSettings.backgroundColor')}
          </Text>
          <View style={[styles.card, { backgroundColor: colors.backgroundCard, borderColor: colors.border, flexDirection: rtl.row, justifyContent: 'space-around' }]}>
            {backgroundColors.map((option) => (
              <Pressable
                key={option.value}
                onPress={() => setBackgroundColor(option.value)}
                style={({ pressed }) => [
                  styles.colorOption,
                  {
                    backgroundColor: option.color,
                    borderColor: backgroundColor === option.value ? colors.primary : colors.border,
                    borderWidth: backgroundColor === option.value ? 3 : 1,
                    opacity: pressed ? 0.7 : 1,
                  },
                ]}
              >
                {backgroundColor === option.value && (
                  <Text style={styles.checkmark}>✓</Text>
                )}
              </Pressable>
            ))}
          </View>
        </View>

        {/* Line Spacing */}
        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { color: colors.textSecondary }, rtl.textStyle]}>
            {t('readingSettings.lineSpacing')}
          </Text>
          <View style={[styles.card, { backgroundColor: colors.backgroundCard, borderColor: colors.border, flexDirection: rtl.row, gap: Spacing.sm }]}>
            {lineSpacings.map((option) => (
              <Pressable
                key={option.value}
                onPress={() => setLineSpacing(option.value)}
                style={({ pressed }) => [
                  styles.spacingOption,
                  {
                    backgroundColor: lineSpacing === option.value ? colors.primary : colors.backgroundSecondary,
                    borderColor: lineSpacing === option.value ? colors.primary : colors.border,
                    opacity: pressed ? 0.7 : 1,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.spacingOptionText,
                    {
                      color: lineSpacing === option.value ? colors.textInverse : colors.text,
                    },
                  ]}
                >
                  {option.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xxxl,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionLabel: {
    ...TextStyles.labelSmall,
    marginBottom: Spacing.sm,
    paddingHorizontal: Spacing.md, // Increased padding to prevent clipping
  },
  card: {
    padding: Spacing.md,
    borderRadius: Radius.lg,
    borderWidth: 1,
    ...Shadows.sm,
  },
  colorOption: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  spacingOption: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: Radius.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  spacingOptionText: {
    ...TextStyles.labelMedium,
  },
});
