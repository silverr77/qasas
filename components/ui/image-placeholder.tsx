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

// All story images; keys must match story id. Used for chapter header and placeholders.
const storyImages: Record<string, ImageSourcePropType> = {
  // Prophets
  'yusuf': require('@/assets/images/stories/prophets/yusuf.png'),
  'ibrahim': require('@/assets/images/stories/prophets/ibrahim.png'),
  'musa': require('@/assets/images/stories/prophets/musa.png'),
  'nuh': require('@/assets/images/stories/prophets/nuh.png'),
  'adam': require('@/assets/images/stories/prophets/adam.png'),
  'idris': require('@/assets/images/stories/prophets/idris.png'),
  'hud': require('@/assets/images/stories/prophets/hud.png'),
  'saleh': require('@/assets/images/stories/prophets/saleh.png'),
  'lut': require('@/assets/images/stories/prophets/lut.png'),
  'ismail': require('@/assets/images/stories/prophets/ismail.png'),
  'yunus': require('@/assets/images/stories/prophets/yunus.png'),
  'yahya': require('@/assets/images/stories/prophets/yahya.png'),
  'ayyub': require('@/assets/images/stories/prophets/ayyub.jpg'),
  'sulaiman': require('@/assets/images/stories/prophets/sulaiman.jpg'),
  'yaqub': require('@/assets/images/stories/prophets/yaqub.jpg'),
  'shuaib': require('@/assets/images/stories/prophets/shuaib.jpg'),
  'dawud': require('@/assets/images/stories/prophets/dawud.jpg'),
  'zakariya': require('@/assets/images/stories/prophets/zakariya.jpg'),
  'isa': require('@/assets/images/stories/prophets/isa.jpg'),
  // Sahabah
  'abu-bakr': require('@/assets/images/stories/sahabah/abu-bakr.png'),
  'umar': require('@/assets/images/stories/sahabah/umar.png'),
  'uthman': require('@/assets/images/stories/sahabah/uthman.png'),
  'ali': require('@/assets/images/stories/sahabah/ali.png'),
  // Mothers
  'aisha': require('@/assets/images/stories/mothers/aisha.png'),
  'hafsa': require('@/assets/images/stories/mothers/hafsa.png'),
  'juwayriya': require('@/assets/images/stories/mothers/juwayriya.png'),
  'sawda': require('@/assets/images/stories/mothers/sawda.png'),
  'umm-salama': require('@/assets/images/stories/mothers/umm-salama.png'),
  'zaynab': require('@/assets/images/stories/mothers/zaynab.png'),
  // Educational
  'the-three-men': require('@/assets/images/stories/educational/the-three-men.png'),
  'the-merchant': require('@/assets/images/stories/educational/the-merchant.png'),
  'the-boy-and-the-king': require('@/assets/images/stories/educational/the-boy-and-the-king.jpg'),
  'the-man-and-the-dog': require('@/assets/images/stories/educational/the-man-and-the-dog.jpg'),
  // Quran
  'ashab-al-kahf': require('@/assets/images/stories/quran/ashab-al-kahf.jpg'),
  'ashab-al-fil': require('@/assets/images/stories/quran/ashab-al-fil.png'),
  'ashab-al-ukhdud': require('@/assets/images/stories/quran/ashab-al-ukhdud.png'),
  'sahib-al-jannatayn': require('@/assets/images/stories/quran/sahib-al-jannatayn.jpg'),
  'qarun': require('@/assets/images/stories/quran/qarun.jpg'),
  'dhul-qarnayn': require('@/assets/images/stories/quran/dhul-qarnayn.png'),
  'talut-jalut': require('@/assets/images/stories/quran/talut-jalut.png'),
  'uzair': require('@/assets/images/stories/quran/uzair.png'),
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
  mothers: { icon: '🌹', color: '#B85C7A', lightColor: '#FDF0F3' },
  quran: { icon: '📖', color: '#5B7A9E', lightColor: '#EEF2F8' },
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
