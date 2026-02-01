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
import { SettingSection } from '@/components/settings/setting-section';
import { FontSizeSelector } from '@/components/font-size-selector';
import { Spacing, TextStyles, Radius } from '@/constants/theme';
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
    <SafeAreaView edges={['top']}>
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
        <SettingSection title={t('readingSettings.fontSize')}>
          <View style={styles.sectionContent}>
            <FontSizeSelector
              selected={fontSize}
              onSelect={setFontSize}
            />
          </View>
        </SettingSection>

        {/* Text Color */}
        <SettingSection title={t('readingSettings.textColor')}>
          <View style={[styles.sectionContent, styles.colorGrid, { flexDirection: rtl.row }]}>
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
                  rtl.marginEnd(Spacing.md),
                ]}
              >
                {textColor === option.value && (
                  <Text style={styles.checkmark}>✓</Text>
                )}
              </Pressable>
            ))}
          </View>
        </SettingSection>

        {/* Background Color */}
        <SettingSection title={t('readingSettings.backgroundColor')}>
          <View style={[styles.sectionContent, styles.colorGrid, { flexDirection: rtl.row }]}>
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
                  rtl.marginEnd(Spacing.md),
                ]}
              >
                {backgroundColor === option.value && (
                  <Text style={styles.checkmark}>✓</Text>
                )}
              </Pressable>
            ))}
          </View>
        </SettingSection>

        {/* Line Spacing */}
        <SettingSection title={t('readingSettings.lineSpacing')}>
          <View style={[styles.sectionContent, styles.spacingGrid, { flexDirection: rtl.row }]}>
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
                  rtl.marginEnd(Spacing.sm),
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
        </SettingSection>
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
  sectionContent: {
    paddingVertical: Spacing.sm,
  },
  colorGrid: {
    flexWrap: 'wrap',
  },
  colorOption: {
    width: 50,
    height: 50,
    borderRadius: Radius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  spacingGrid: {
    // gap is handled by rtl.marginEnd
  },
  spacingOption: {
    flex: 1,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.md,
    borderWidth: 1,
    alignItems: 'center',
  },
  spacingOptionText: {
    ...TextStyles.labelMedium,
  },
});
