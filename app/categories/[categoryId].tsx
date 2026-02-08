/**
 * Category Screen
 * Shows all stories in a specific category with new design
 */

import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from '@/components/ui/safe-area-view';
import { CategoryHeader } from '@/components/categories/category-header';
import { CategoryInfo } from '@/components/categories/category-info';
import { StoryListItem } from '@/components/stories/story-list-item';
import { Spacing, Radius } from '@/constants/theme';
import { useAppTheme } from '@/hooks/use-app-theme';
import { useTranslation } from '@/hooks/use-translation';
import { useRTL } from '@/hooks/use-rtl';
import { useUserStore } from '@/store/user-store';
import { getStoriesByCategory } from '@/data/stories';
import { StoryCategory, Story } from '@/types';

function filterStoriesByQuery(stories: Story[], query: string, language: 'en' | 'ar'): Story[] {
  const q = query.trim().toLowerCase();
  if (!q) return stories;
  return stories.filter((s) => {
    const name = language === 'ar' ? s.nameAr : s.nameEn;
    const desc = language === 'ar' ? s.shortDescriptionAr : s.shortDescriptionEn;
    return name.toLowerCase().includes(q) || desc.toLowerCase().includes(q);
  });
}

export default function CategoryScreen() {
  const { colors } = useAppTheme();
  const { t } = useTranslation();
  const rtl = useRTL();
  const language = useUserStore((state) => state.language);
  const router = useRouter();
  const params = useLocalSearchParams<{ categoryId: string | string[] }>();
  const categoryId = typeof params.categoryId === 'string' ? params.categoryId : params.categoryId?.[0];
  const [searchQuery, setSearchQuery] = useState('');

  const category = categoryId as StoryCategory;
  const allStories = useMemo(() => getStoriesByCategory(category), [category]);
  const stories = useMemo(
    () => filterStoriesByQuery(allStories, searchQuery, language),
    [allStories, searchQuery, language]
  );

  const handleStoryPress = (story: Story) => {
    router.push(`/chapters/${story.id}`);
  };

  const renderStory = ({ item }: { item: Story }) => {
    return (
      <StoryListItem
        story={item}
        onPress={() => handleStoryPress(item)}
      />
    );
  };

  if (!['prophets', 'sahabah', 'educational'].includes(category)) {
    return (
      <SafeAreaView edges={['top']}>
        <CategoryHeader category="prophets" />
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: colors.textSecondary }]}>
            {t('emptyStates.noChaptersTitle')}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.creamBackground }]}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <CategoryHeader category={category} />
        <CategoryInfo category={category} />

        <View style={[styles.searchRow, { flexDirection: rtl.row }]}>
          <TextInput
            style={[
              styles.searchInput,
              {
                backgroundColor: colors.backgroundCard,
                color: colors.text,
                borderColor: colors.border,
                textAlign: rtl.textAlign,
                flex: 1,
              },
            ]}
            placeholder={t('home.searchPlaceholder')}
            placeholderTextColor={colors.textTertiary}
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
          />
        </View>

        <FlatList
          data={stories}
          keyExtractor={(item) => item.id}
          renderItem={renderStory}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                {searchQuery.trim()
                  ? t('emptyStates.noChaptersMessage')
                  : t('emptyStates.noChaptersMessage')}
              </Text>
            </View>
          }
        />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  searchRow: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    alignSelf: 'stretch',
  },
  searchInput: {
    height: 44,
    borderRadius: Radius.md,
    borderWidth: 1,
    paddingHorizontal: Spacing.md,
    fontSize: 16,
    minWidth: 0,
  },
  listContent: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xxxl,
  },
  emptyContainer: {
    alignItems: 'center',
    padding: Spacing.xl,
  },
  emptyText: {
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
  },
  errorText: {
    fontSize: 16,
  },
});
