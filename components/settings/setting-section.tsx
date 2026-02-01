/**
 * SettingSection Component
 * Groups related settings with a header
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Spacing, Radius, TextStyles, Shadows } from '@/constants/theme';
import { useAppTheme } from '@/hooks/use-app-theme';
import { useRTL } from '@/hooks/use-rtl';

interface SettingSectionProps {
  title: string;
  children: React.ReactNode;
}

export function SettingSection({ title, children }: SettingSectionProps) {
  const { colors } = useAppTheme();
  const rtl = useRTL();

  return (
    <View style={styles.container}>
      <Text style={[
        styles.title, 
        { color: colors.textSecondary },
        rtl.textStyle,
      ]}>
        {title}
      </Text>
      <View
        style={[
          styles.content,
          {
            backgroundColor: colors.backgroundCard,
            borderColor: colors.border,
          },
        ]}
      >
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.lg,
  },
  title: {
    ...TextStyles.labelSmall,
    marginBottom: Spacing.sm,
    paddingHorizontal: Spacing.md, // Added padding to prevent clipping
  },
  content: {
    borderRadius: Radius.lg,
    borderWidth: 1,
    overflow: 'hidden',
    ...Shadows.sm,
  },
});
