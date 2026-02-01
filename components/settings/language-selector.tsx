/**
 * LanguageSelector Component
 * Select primary language with visual feedback
 */

import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Language } from '@/store/user-store';
import { Colors, Spacing, Radius, TextStyles, Shadows } from '@/constants/theme';
import { useAppTheme } from '@/hooks/use-app-theme';
import { useTranslation } from '@/hooks/use-translation';
import { useRTL } from '@/hooks/use-rtl';

interface LanguageSelectorProps {
  selected: Language;
  onSelect: (language: Language) => void;
}

export function LanguageSelector({ selected, onSelect }: LanguageSelectorProps) {
  const { colors } = useAppTheme();
  const { t } = useTranslation();
  const rtl = useRTL();

  const LANGUAGES: { value: Language; label: string; native: string; flag: string }[] = [
    { value: 'en', label: t('languageSettings.english'), native: 'English', flag: '🇬🇧' },
    { value: 'ar', label: t('languageSettings.arabic'), native: 'العربية', flag: '🇸🇦' },
  ];

  const handleSelect = (language: Language) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onSelect(language);
  };

  return (
    <View style={styles.container}>
      {LANGUAGES.map((lang) => {
        const isSelected = selected === lang.value;
        return (
          <Pressable
            key={lang.value}
            onPress={() => handleSelect(lang.value)}
            accessibilityRole="radio"
            accessibilityState={{ selected: isSelected }}
            accessibilityLabel={`${lang.label} language`}
            style={[
              styles.option,
              {
                backgroundColor: isSelected
                  ? colors.primaryLight
                  : colors.backgroundCard,
                borderColor: isSelected
                  ? colors.primary
                  : colors.border,
                flexDirection: rtl.row,
              },
              isSelected && Shadows.sm,
            ]}
          >
            <Text style={[
              styles.flag, 
              rtl.isRTL ? { marginLeft: Spacing.md } : { marginRight: Spacing.md }
            ]}>
              {lang.flag}
            </Text>
            <View style={[styles.textContainer, { alignItems: rtl.alignStart }]}>
              <Text
                style={[
                  styles.native,
                  { color: isSelected ? colors.primary : colors.text, textAlign: rtl.textAlign },
                ]}
              >
                {lang.native}
              </Text>
              <Text
                style={[
                  styles.label,
                  { color: colors.textSecondary, textAlign: rtl.textAlign },
                ]}
              >
                {lang.label}
              </Text>
            </View>
            {isSelected && (
              <View
                style={[
                  styles.checkmark,
                  { backgroundColor: colors.primary },
                ]}
              >
                <Text style={styles.checkmarkText}>✓</Text>
              </View>
            )}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.md,
  },
  option: {
    alignItems: 'center',
    padding: Spacing.lg,
    borderRadius: Radius.lg,
    borderWidth: 1.5,
  },
  flag: {
    fontSize: 32,
  },
  textContainer: {
    flex: 1,
  },
  native: {
    ...TextStyles.headingSmall,
    marginBottom: 2,
  },
  label: {
    ...TextStyles.bodySmall,
  },
  checkmark: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmarkText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
