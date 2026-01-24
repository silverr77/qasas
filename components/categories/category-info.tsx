/**
 * Category Info Component
 * Category description section
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { useAppTheme } from '@/hooks/use-app-theme';
import { useTranslation } from '@/hooks/use-translation';
import { Spacing, TextStyles } from '@/constants/theme';
import { StoryCategory } from '@/types';
import { getStoriesByCategory } from '@/data/stories';

interface CategoryInfoProps {
  category: StoryCategory;
}

const categoryConfig: Record<StoryCategory, { lightColor: string; descriptionKey: string }> = {
  prophets: {
    lightColor: '#E8F0EA',
    descriptionKey: 'categories.prophetsDescription',
  },
  sahabah: {
    lightColor: '#FDF8E8',
    descriptionKey: 'categories.sahabahDescription',
  },
  educational: {
    lightColor: '#E8F0F2',
    descriptionKey: 'categories.educationalDescription',
  },
};

export function CategoryInfo({ category }: CategoryInfoProps) {
  const { colors, isDark } = useAppTheme();
  const { t } = useTranslation();
  const config = categoryConfig[category];
  const stories = getStoriesByCategory(category);
  const count = stories.length;

  const bgColor = isDark
    ? (category === 'prophets' ? colors.categoryProphetsLight :
       category === 'sahabah' ? colors.categorySahabahLight :
       colors.categoryEducationalLight)
    : config.lightColor;

  const categoryLabels: Record<StoryCategory, { en: string; ar: string }> = {
    prophets: { en: t('categories.prophets'), ar: t('categories.prophetsAr') },
    sahabah: { en: t('categories.sahabah'), ar: t('categories.sahabahAr') },
    educational: { en: t('categories.educational'), ar: t('categories.educationalAr') },
  };

  const label = categoryLabels[category];

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: bgColor },
      ]}
    >
      <Text style={[styles.title, { color: colors.text }]}>
        {label.en}
      </Text>
      <Text style={[styles.count, { color: colors.textSecondary }]}>
        {count} {count === 1 ? t('categories.storyAvailable') : t('categories.storiesAvailable')}
      </Text>
      <Text style={[styles.description, { color: colors.textSecondary }]}>
        {t(config.descriptionKey)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 100,
    padding: Spacing.xl,
    justifyContent: 'center',
  },
  title: {
    ...TextStyles.headingLarge,
    fontSize: 24,
    fontWeight: '700',
    marginBottom: Spacing.xs,
  },
  count: {
    ...TextStyles.bodySmall,
    fontSize: 14,
    marginBottom: Spacing.sm,
  },
  description: {
    ...TextStyles.bodySmall,
    fontSize: 12,
    lineHeight: 18,
  },
});
