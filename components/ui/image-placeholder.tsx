/**
 * Story Image Component
 * Displays the story illustration or a placeholder if not available
 */

import { Spacing, TextStyles } from '@/constants/theme';
import { useAppTheme } from '@/hooks/use-app-theme';
import { useTranslation } from '@/hooks/use-translation';
import { StoryCategory } from '@/types';
import React from 'react';
import {
  Image,
  ImageSourcePropType,
  StyleSheet,
  Text,
  View,
} from 'react-native';

// Import all story images
const storyImages: Record<string, ImageSourcePropType> = {
  // Prophets
  'yusuf': require('@/assets/images/stories/prophets/yusuf.png'),
  'ibrahim': require('@/assets/images/stories/prophets/ibrahim.png'),
  'musa': require('@/assets/images/stories/prophets/musa.png'),
  'nuh': require('@/assets/images/stories/prophets/nuh.png'),
  
  // Sahabah
  'abu-bakr': require('@/assets/images/stories/sahabah/abu-bakr.png'),
  'umar': require('@/assets/images/stories/sahabah/umar.png'),
  'uthman': require('@/assets/images/stories/sahabah/uthman.png'), // Pending generation
  'ali': require('@/assets/images/stories/sahabah/ali.png'), // Pending generation
  
  // Educational
  'the-three-men': require('@/assets/images/stories/educational/the-three-men.png'), // Pending generation
  'the-merchant': require('@/assets/images/stories/educational/the-merchant.png'), // Pending generation
};

interface StoryImageProps {
  storyId: string;
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

export function StoryImage({
  storyId,
  width,
  height,
  category,
  borderRadius = 12,
}: StoryImageProps) {
  const { colors, isDark } = useAppTheme();
  const { t } = useTranslation();
  
  const source = storyImages[storyId];

  if (source) {
    return (
      <Image
        source={source}
        style={{
          width,
          height,
          borderRadius,
        }}
        resizeMode="cover"
      />
    );
  }

  // Fallback to placeholder
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
