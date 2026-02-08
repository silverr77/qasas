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
} from 'react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useAppTheme } from '@/hooks/use-app-theme';
import { useTranslation } from '@/hooks/use-translation';
import { useRTL } from '@/hooks/use-rtl';
import { useUserStore } from '@/store/user-store';
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
  const rtl = useRTL();
  const language = useUserStore((state) => state.language);
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
  const categoryName = language === 'ar' ? label.ar : label.en;

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.creamBackground, flexDirection: rtl.row },
      ]}
    >
      <Pressable onPress={handleBack} style={styles.backButton}>
        <Text style={[styles.backIcon, { color: colors.text }]}>
          {rtl.isRTL ? '→' : '←'}
        </Text>
      </Pressable>

      <View style={[styles.center, { flexDirection: rtl.row }]}>
        <Text style={[styles.icon, rtl.isRTL ? { marginLeft: Spacing.sm } : { marginRight: Spacing.sm }]}>{config.icon}</Text>
        <Text style={[styles.title, { color: colors.text }]}>
          {categoryName}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // flexDirection applied dynamically via rtl.row
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
    // flexDirection applied dynamically via rtl.row
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 32,
    // margin applied dynamically based on RTL
  },
  title: {
    ...TextStyles.headingMedium,
    fontSize: 20,
    fontWeight: '700',
  },
});
