/**
 * Category Cards Component
 * Quick access cards for each story category
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
} from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Colors, Spacing, Radius, TextStyles, Shadows } from '@/constants/theme';
import { useAppTheme } from '@/hooks/use-app-theme';
import { useTranslation } from '@/hooks/use-translation';
import { useUserStore } from '@/store/user-store';
import { StoryCategory } from '@/types';
import { getAllStories, getStoriesByCategory } from '@/data/stories';

interface CategoryCardProps {
  category: StoryCategory;
  icon: string;
  color: string;
  delay?: number;
}

const categoryConfig: Record<StoryCategory, { icon: string; color: string }> = {
  prophets: { icon: '🌙', color: '#739A7B' }, // Sage green
  sahabah: { icon: '⭐', color: '#E8B130' }, // Gold
  educational: { icon: '📚', color: '#4A7C7E' }, // Soft blue
};

export function CategoryCards() {
  const { colors } = useAppTheme();
  const { t } = useTranslation();
  const router = useRouter();

  const handleCategoryPress = (category: StoryCategory) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(`/categories/${category}`);
  };

  const categories: StoryCategory[] = ['prophets', 'sahabah', 'educational'];
  const allStories = getAllStories();

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.text }]}>
        {t('home.exploreCategories')}
      </Text>
      <View style={styles.cardsContainer}>
        {categories.map((category, index) => {
          const config = categoryConfig[category];
          const categoryStories = getStoriesByCategory(category);
          const count = categoryStories.length;

          return (
            <Animated.View
              key={category}
              entering={FadeInDown.duration(400).delay(index * 100)}
            >
              <CategoryCard
                category={category}
                icon={config.icon}
                color={config.color}
                count={count}
                onPress={() => handleCategoryPress(category)}
              />
            </Animated.View>
          );
        })}
      </View>
    </View>
  );
}

interface CategoryCardProps {
  category: StoryCategory;
  icon: string;
  color: string;
  count: number;
  onPress: () => void;
}

function CategoryCard({ category, icon, color, count, onPress }: CategoryCardProps) {
  const { colors } = useAppTheme();
  const { t } = useTranslation();
  const language = useUserStore((state) => state.language);

  const categoryLabels: Record<StoryCategory, { en: string; ar: string }> = {
    prophets: { en: t('categories.prophets'), ar: t('categories.prophetsAr') },
    sahabah: { en: t('categories.sahabah'), ar: t('categories.sahabahAr') },
    educational: { en: t('categories.educational'), ar: t('categories.educationalAr') },
  };

  const label = categoryLabels[category];
  const categoryName = language === 'ar' ? label.ar : label.en;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: colors.backgroundCard,
          borderColor: color,
          opacity: pressed ? 0.8 : 1,
          transform: [{ scale: pressed ? 0.98 : 1 }],
        },
      ]}
    >
      <View style={[styles.iconContainer, { backgroundColor: `${color}15` }]}>
        <Text style={styles.icon}>{icon}</Text>
      </View>
      <View style={styles.content}>
        <Text style={[styles.categoryName, { color: colors.text }]}>{categoryName}</Text>
        <Text style={[styles.count, { color: colors.textSecondary }]}>
          {count} {count === 1 ? t('prophets.chaptersOne') : t('prophets.chapters', { count })}
        </Text>
      </View>
      <Text style={[styles.arrow, { color: colors.textTertiary }]}>›</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.xl,
  },
  title: {
    ...TextStyles.headingSmall,
    marginBottom: Spacing.md,
    paddingHorizontal: Spacing.lg,
  },
  cardsContainer: {
    gap: Spacing.md,
    paddingHorizontal: Spacing.lg,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: Radius.lg,
    borderWidth: 2,
    ...Shadows.sm,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: Radius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  icon: {
    fontSize: 28,
  },
  content: {
    flex: 1,
  },
  categoryName: {
    ...TextStyles.labelLarge,
    marginBottom: Spacing.xs,
  },
  count: {
    ...TextStyles.bodySmall,
  },
  arrow: {
    fontSize: 24,
    fontWeight: '300',
  },
});
