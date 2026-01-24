/**
 * Stories Screen
 * Lists all stories from all categories with new design
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from '@/components/ui/safe-area-view';
import { ScreenHeader } from '@/components/ui/screen-header';
import { StoryListItem } from '@/components/stories/story-list-item';
import { Spacing } from '@/constants/theme';
import { useAppTheme } from '@/hooks/use-app-theme';
import { useTranslation } from '@/hooks/use-translation';
import { getAllStories } from '@/data/stories';
import { Story } from '@/types';

export default function StoriesScreen() {
  const { colors } = useAppTheme();
  const { t } = useTranslation();
  const router = useRouter();

  const allStories = getAllStories();

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

  return (
    <SafeAreaView edges={['top']} style={{ backgroundColor: colors.creamBackground }}>
      <ScreenHeader
        title={t('categories.allStories')}
        showBack
      />

      <FlatList
        data={allStories}
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
  );
}

const styles = StyleSheet.create({
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
});
