/**
 * Image Placeholder Component
 * Placeholder for story illustrations until real images are generated
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { Colors, Spacing, Radius, TextStyles } from '@/constants/theme';
import { useAppTheme } from '@/hooks/use-app-theme';
import { useTranslation } from '@/hooks/use-translation';
import { StoryCategory } from '@/types';

interface ImagePlaceholderProps {
  width: number;
  height: number;
  category: StoryCategory;
  borderRadius?: number;
}

const categoryConfig: Record<StoryCategory, { icon: string; color: string; lightColor: string }> = {
  prophets: { icon: '🌙', color: '#739A7B', lightColor: '#E8F0EA' },
  sahabah: { icon: '⭐', color: '#E8B130', lightColor: '#FDF8E8' },
  educational: { icon: '📚', color: '#4A7C7E', lightColor: '#E8F0F2' },
};

export function ImagePlaceholder({
  width,
  height,
  category,
  borderRadius = 12,
}: ImagePlaceholderProps) {
  const { colors, isDark } = useAppTheme();
  const { t } = useTranslation();
  const config = categoryConfig[category] || categoryConfig.prophets;

  const bgColor = isDark 
    ? colors.categoryProphetsLight 
    : config.lightColor;

  return (
    <View
      style={[
        styles.container,
        {
          width,
          height,
          backgroundColor: bgColor,
          borderRadius,
          borderColor: colors.border,
        },
      ]}
    >
      <Text style={styles.icon}>{config.icon}</Text>
      <Text style={[styles.label, { color: colors.textTertiary }]}>
        {t('common.illustrationPlaceholder')}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderStyle: 'dashed',
  },
  icon: {
    fontSize: 48,
    marginBottom: Spacing.xs,
  },
  label: {
    ...TextStyles.labelSmall,
    fontSize: 10,
    textAlign: 'center',
    paddingHorizontal: Spacing.sm,
  },
});
