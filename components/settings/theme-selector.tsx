/**
 * ThemeSelector Component
 * Select between light, dark, and auto theme modes
 */

import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import * as Haptics from 'expo-haptics';
import { ThemeMode } from '@/store/user-store';
import { Colors, Spacing, Radius, TextStyles } from '@/constants/theme';
import { useAppTheme } from '@/hooks/use-app-theme';
import { useTranslation } from '@/hooks/use-translation';
import { useRTL } from '@/hooks/use-rtl';

interface ThemeSelectorProps {
  selected: ThemeMode;
  onSelect: (theme: ThemeMode) => void;
}

export function ThemeSelector({ selected, onSelect }: ThemeSelectorProps) {
  const { colors } = useAppTheme();
  const { t } = useTranslation();
  const rtl = useRTL();

  const THEMES: { value: ThemeMode; label: string; icon: string }[] = [
    { value: 'light', label: t('settings.themeLight'), icon: '☀️' },
    { value: 'dark', label: t('settings.themeDark'), icon: '🌙' },
    { value: 'auto', label: t('settings.themeAuto'), icon: '⚙️' },
  ];

  const handleSelect = (theme: ThemeMode) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onSelect(theme);
  };

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.options,
          {
            backgroundColor: colors.backgroundSecondary,
            borderColor: colors.border,
            flexDirection: rtl.row,
          },
        ]}
      >
        {THEMES.map((theme) => {
          const isSelected = selected === theme.value;
          return (
            <Pressable
              key={theme.value}
              onPress={() => handleSelect(theme.value)}
              accessibilityRole="radio"
              accessibilityState={{ selected: isSelected }}
              accessibilityLabel={`${theme.label} theme`}
              style={[
                styles.option,
                {
                  backgroundColor: isSelected
                    ? colors.backgroundCard
                    : 'transparent',
                  borderColor: isSelected
                    ? colors.border
                    : 'transparent',
                  flexDirection: rtl.row,
                },
              ]}
            >
              <Text style={styles.icon}>{theme.icon}</Text>
              <Text
                style={[
                  styles.optionLabel,
                  { color: isSelected ? colors.text : colors.textSecondary, textAlign: rtl.textAlign },
                ]}
              >
                {theme.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  options: {
    borderRadius: Radius.md,
    borderWidth: 1,
    padding: 4,
  },
  option: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.sm,
    borderRadius: Radius.sm,
    borderWidth: 1,
    gap: Spacing.xs,
  },
  icon: {
    fontSize: 16,
  },
  optionLabel: {
    ...TextStyles.labelMedium,
  },
});
