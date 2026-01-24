/**
 * Category Header Component
 * Header for category screen with icon and title
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  I18nManager,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useAppTheme } from '@/hooks/use-app-theme';
import { useTranslation } from '@/hooks/use-translation';
import { Spacing, TextStyles } from '@/constants/theme';
import { StoryCategory } from '@/types';

interface CategoryHeaderProps {
  category: StoryCategory;
}

const categoryConfig: Record<StoryCategory, { icon: string }> = {
  prophets: { icon: '🌙' },
  sahabah: { icon: '⭐' },
  educational: { icon: '📚' },
};

export function CategoryHeader({ category }: CategoryHeaderProps) {
  const { colors } = useAppTheme();
  const { t } = useTranslation();
  const router = useRouter();
  const config = categoryConfig[category];

  const handleBack = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.back();
  };

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
        { backgroundColor: colors.creamBackground },
      ]}
    >
      <Pressable onPress={handleBack} style={styles.backButton}>
        <Text style={[styles.backIcon, { color: colors.text }]}>
          {I18nManager.isRTL ? '→' : '←'}
        </Text>
      </Pressable>

      <View style={styles.center}>
        <Text style={styles.icon}>{config.icon}</Text>
        <Text style={[styles.title, { color: colors.text }]}>
          {label.en}
        </Text>
      </View>

      <View style={styles.right}>
        <Text style={[styles.searchIcon, { color: colors.text }]}>🔍</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 56,
    paddingHorizontal: Spacing.lg,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  backIcon: {
    fontSize: 24,
    fontWeight: '600',
  },
  center: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
  },
  icon: {
    fontSize: 32,
  },
  title: {
    ...TextStyles.headingMedium,
    fontSize: 20,
    fontWeight: '700',
  },
  right: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  searchIcon: {
    fontSize: 24,
  },
});
