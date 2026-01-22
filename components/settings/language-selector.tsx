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

interface LanguageSelectorProps {
  selected: Language;
  onSelect: (language: Language) => void;
}

const LANGUAGES: { value: Language; label: string; native: string; flag: string }[] = [
  { value: 'en', label: 'English', native: 'English', flag: '🇬🇧' },
  { value: 'ar', label: 'Arabic', native: 'العربية', flag: '🇸🇦' },
];

export function LanguageSelector({ selected, onSelect }: LanguageSelectorProps) {
  const { colors } = useAppTheme();

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
              },
              isSelected && Shadows.sm,
            ]}
          >
            <Text style={styles.flag}>{lang.flag}</Text>
            <View style={styles.textContainer}>
              <Text
                style={[
                  styles.native,
                  { color: isSelected ? colors.primary : colors.text },
                ]}
              >
                {lang.native}
              </Text>
              <Text
                style={[
                  styles.label,
                  { color: colors.textSecondary },
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
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
    borderRadius: Radius.lg,
    borderWidth: 1.5,
  },
  flag: {
    fontSize: 32,
    marginRight: Spacing.md,
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
