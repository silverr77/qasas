/**
 * HomeScreen
 * Redesigned home screen with modern UI
 */

import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { SafeAreaView } from '@/components/ui/safe-area-view';
import { HomeHeader } from '@/components/home/home-header';
import { SearchBar } from '@/components/home/search-bar';
import { CategoryButton } from '@/components/home/category-button';
import { StoryCard } from '@/components/stories/story-card';
import { ImagePlaceholder } from '@/components/ui/image-placeholder';
import { Spacing, Radius, TextStyles, Shadows } from '@/constants/theme';
import { useAppTheme } from '@/hooks/use-app-theme';
import { useTranslation } from '@/hooks/use-translation';
import { useReadingStore } from '@/store/reading-store';
import { getAllStories, getStoriesByCategory } from '@/data/stories';
import { getChaptersByStoryId } from '@/data/chapters';
import { getChapterById } from '@/data/chapters';
import { getStoryById } from '@/data/stories';
import { StoryCategory } from '@/types';

export default function HomeScreen() {
  const { colors } = useAppTheme();
  const { t, language } = useTranslation();
  const router = useRouter();
  const { preferences, isChapterLocked, getUnlockTime } = useReadingStore();

  // Get last read chapter info
  const lastChapter = preferences.lastReadChapterId
    ? getChapterById(preferences.lastReadChapterId)
    : null;
  const lastStory = preferences.lastReadStoryId
    ? getStoryById(preferences.lastReadStoryId)
    : null;

  // Get recommended stories (all categories)
  const allStories = getAllStories();
  const recommendedStories = useMemo(() => {
    // Get 3-4 random stories from different categories
    const shuffled = [...allStories].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 4);
  }, [allStories]);

  const handleCategoryPress = (category: StoryCategory | 'all') => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (category === 'all') {
      router.push('/stories');
    } else {
      router.push(`/categories/${category}`);
    }
  };

  const handleStoryPress = (storyId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push(`/chapters/${storyId}`);
  };

  const handleContinueReading = () => {
    if (!lastChapter || !lastStory) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push(`/reading-setup/${lastChapter.id}`);
  };

  const handleSeeAll = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push('/stories');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.creamBackground }]}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <HomeHeader />

          {/* Search Bar */}
          <SearchBar />

          {/* Story Categories */}
          <Animated.View entering={FadeInDown.duration(400).delay(100)}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              {t('home.storyCategories')}
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoriesContainer}
            >
              <CategoryButton
                category="prophets"
                onPress={() => handleCategoryPress('prophets')}
              />
              <CategoryButton
                category="sahabah"
                onPress={() => handleCategoryPress('sahabah')}
              />
              <CategoryButton
                category="educational"
                onPress={() => handleCategoryPress('educational')}
              />
              <CategoryButton
                category="all"
                onPress={() => handleCategoryPress('all')}
              />
            </ScrollView>
          </Animated.View>

          {/* Recommended Stories */}
          <Animated.View
            entering={FadeInDown.duration(400).delay(200)}
            style={styles.recommendedSection}
          >
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                {t('home.recommended')}
              </Text>
              <Pressable onPress={handleSeeAll}>
                <Text style={[styles.seeAll, { color: colors.orangeAccent }]}>
                  {t('home.seeAll')}
                </Text>
              </Pressable>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.storiesContainer}
            >
              {recommendedStories.map((story) => (
                <StoryCard
                  key={story.id}
                  story={story}
                  onPress={() => handleStoryPress(story.id)}
                />
              ))}
            </ScrollView>
          </Animated.View>

          {/* Continue Reading Card */}
          {lastChapter && lastStory && (
            <Animated.View
              entering={FadeInDown.duration(400).delay(300)}
              style={styles.continueSection}
            >
              <Pressable
                onPress={handleContinueReading}
                style={({ pressed }) => [
                  styles.continueCard,
                  {
                    backgroundColor: colors.backgroundCard,
                    opacity: pressed ? 0.9 : 1,
                    transform: [{ scale: pressed ? 0.98 : 1 }],
                  },
                ]}
              >
                <ImagePlaceholder
                  width={80}
                  height={80}
                  category={lastStory.category}
                  borderRadius={Radius.sm}
                />
                <View style={styles.continueContent}>
                  <Text style={[styles.continueLabel, { color: colors.textSecondary }]}>
                    {t('home.continueReading')}
                  </Text>
                  <Text
                    style={[styles.continueTitle, { color: colors.text }]}
                    numberOfLines={1}
                  >
                    {lastChapter.title}
                  </Text>
                  <Text
                    style={[styles.continueStory, { color: colors.textSecondary }]}
                    numberOfLines={1}
                  >
                    {lastStory.nameEn}
                  </Text>
                </View>
              </Pressable>
            </Animated.View>
          )}
        </ScrollView>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: Spacing.xxxl,
  },
  sectionTitle: {
    ...TextStyles.headingSmall,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: Spacing.md,
    paddingHorizontal: Spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
    paddingHorizontal: Spacing.lg,
  },
  seeAll: {
    ...TextStyles.bodyMedium,
    fontSize: 14,
    fontWeight: '500',
  },
  categoriesContainer: {
    paddingHorizontal: Spacing.lg,
    paddingRight: Spacing.lg,
  },
  recommendedSection: {
    marginTop: Spacing.xl,
  },
  storiesContainer: {
    paddingHorizontal: Spacing.lg,
    paddingRight: Spacing.lg,
  },
  continueSection: {
    marginTop: Spacing.xl,
    paddingHorizontal: Spacing.lg,
  },
  continueCard: {
    flexDirection: 'row',
    height: 120,
    borderRadius: Radius.md,
    padding: Spacing.lg,
    ...Shadows.sm,
  },
  continueContent: {
    flex: 1,
    marginLeft: Spacing.md,
    justifyContent: 'center',
  },
  continueLabel: {
    ...TextStyles.labelSmall,
    fontSize: 12,
    marginBottom: Spacing.xs,
  },
  continueTitle: {
    ...TextStyles.headingSmall,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: Spacing.xs,
  },
  continueStory: {
    ...TextStyles.bodySmall,
    fontSize: 14,
  },
});
