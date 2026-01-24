/**
 * Category Screen
 * Shows all stories in a specific category with new design
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from '@/components/ui/safe-area-view';
import { CategoryHeader } from '@/components/categories/category-header';
import { CategoryInfo } from '@/components/categories/category-info';
import { StoryListItem } from '@/components/stories/story-list-item';
import { Spacing } from '@/constants/theme';
import { useAppTheme } from '@/hooks/use-app-theme';
import { useTranslation } from '@/hooks/use-translation';
import { getStoriesByCategory } from '@/data/stories';
import { StoryCategory, Story } from '@/types';

export default function CategoryScreen() {
  const { colors } = useAppTheme();
  const { t } = useTranslation();
  const router = useRouter();
  const { categoryId } = useLocalSearchParams<{ categoryId: string }>();

  const category = categoryId as StoryCategory;
  const stories = getStoriesByCategory(category);

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

        <FlatList
          data={stories}
          keyExtractor={(item) => item.id}
          renderItem={renderStory}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                {t('emptyStates.noChaptersMessage')}
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
