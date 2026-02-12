/**
 * HomeScreen
 * Redesigned home screen matching the DreamTales style
 */

import React, { useEffect, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import * as StoreReview from 'expo-store-review';
import { SafeAreaView } from '@/components/ui/safe-area-view';
import { HomeHeader } from '@/components/home/home-header';
import { CategoryButton } from '@/components/home/category-button';
import { StoryCard } from '@/components/stories/story-card';
import { Spacing, TextStyles } from '@/constants/theme';
import { useAppTheme } from '@/hooks/use-app-theme';
import { useTranslation } from '@/hooks/use-translation';
import { useRTL } from '@/hooks/use-rtl';
import { useUserStore } from '@/store/user-store';
import { useInterstitialAd } from '@/hooks/use-interstitial-ad';
import { getChaptersByStoryId } from '@/data/chapters';
import { getStoriesByCategory } from '@/data/stories';
import { StoryCategory } from '@/types';
import { AdBanner } from '@/components/ads/AdBanner';
import { AdUnitIds } from '@/services/adService';

const INTERSTITIAL_NAV_DELAY_MS = 800;

const RATING_PROMPT_INTERVAL_DAYS = 7;
const RATING_PROMPT_DELAY_MS = 2000;

export default function HomeScreen() {
  const { colors } = useAppTheme();
  const { t } = useTranslation();
  const rtl = useRTL();
  const router = useRouter();
  const lastRatingRequestDate = useUserStore((s) => s.lastRatingRequestDate);
  const setLastRatingRequestDate = useUserStore((s) => s.setLastRatingRequestDate);
  const { showIfNavigationReady } = useInterstitialAd();

  useFocusEffect(
    useCallback(() => {
      const t = setTimeout(() => showIfNavigationReady(), INTERSTITIAL_NAV_DELAY_MS);
      return () => clearTimeout(t);
    }, [showIfNavigationReady])
  );

  // If user hasn’t been prompted in 7 days, show native rating after a short delay
  useEffect(() => {
    const shouldPrompt =
      lastRatingRequestDate === null ||
      (Date.now() - new Date(lastRatingRequestDate).getTime() >
        RATING_PROMPT_INTERVAL_DAYS * 24 * 60 * 60 * 1000);
    if (!shouldPrompt) return;

    const timeoutId = setTimeout(async () => {
      try {
        const available = await StoreReview.isAvailableAsync();
        if (available) {
          await StoreReview.requestReview();
          setLastRatingRequestDate(new Date().toISOString());
        }
      } catch {
        // Ignore
      }
    }, RATING_PROMPT_DELAY_MS);
    return () => clearTimeout(timeoutId);
  }, [lastRatingRequestDate, setLastRatingRequestDate]);

  // Get stories by category (only those with chapters), ordered most important first
  const prophetStories = useMemo(
    () => getStoriesByCategory('prophets').filter((s) => getChaptersByStoryId(s.id).length > 0),
    []
  );
  const sahabahStories = useMemo(
    () => getStoriesByCategory('sahabah').filter((s) => getChaptersByStoryId(s.id).length > 0),
    []
  );
  const educationalStories = useMemo(
    () => getStoriesByCategory('educational').filter((s) => getChaptersByStoryId(s.id).length > 0),
    []
  );

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

  // Categories - matching the design
  const categories: (StoryCategory | 'all')[] = ['prophets', 'sahabah', 'educational', 'all'];

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

          {/* Story Categories */}
          <Animated.View 
            entering={FadeInDown.duration(400).delay(100)}
            style={styles.section}
          >
            <Text style={[
              styles.sectionTitle, 
              { color: colors.text, textAlign: rtl.textAlign }
            ]}>
              {t('home.storyCategories')}
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={[
                styles.categoriesContainer,
                { flexDirection: rtl.row }
              ]}
              style={rtl.isRTL && !rtl.isSystemRTL ? { transform: [{ scaleX: -1 }] } : {}}
            >
              {categories.map((category) => (
                <View 
                  key={category} 
                  style={rtl.isRTL && !rtl.isSystemRTL ? { transform: [{ scaleX: -1 }] } : {}}
                >
                  <CategoryButton
                    category={category}
                    onPress={() => handleCategoryPress(category)}
                  />
                </View>
              ))}
            </ScrollView>
          </Animated.View>

          {/* Prophets Section — most important first; RTL slider via scaleX */}
          {prophetStories.length > 0 && (
            <Animated.View
              entering={FadeInDown.duration(400).delay(200)}
              style={styles.section}
            >
              <Text style={[
                styles.sectionTitle,
                { color: colors.text, textAlign: rtl.textAlign }
              ]}>
                {t('categories.prophets')}
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={[
                  styles.storiesContainer,
                  { flexDirection: 'row' },
                ]}
                style={rtl.isRTL && !rtl.isSystemRTL ? { transform: [{ scaleX: -1 }] } : {}}
              >
                {prophetStories.map((story) => (
                  <View
                    key={story.id}
                    style={rtl.isRTL && !rtl.isSystemRTL ? { transform: [{ scaleX: -1 }] } : {}}
                  >
                    <StoryCard
                      story={story}
                      onPress={() => handleStoryPress(story.id)}
                    />
                  </View>
                ))}
              </ScrollView>
            </Animated.View>
          )}

          {/* Sahabah Stories Section — most important first; RTL slider via scaleX */}
          {sahabahStories.length > 0 && (
            <Animated.View
              entering={FadeInDown.duration(400).delay(300)}
              style={styles.section}
            >
              <Text style={[
                styles.sectionTitle,
                { color: colors.text, textAlign: rtl.textAlign }
              ]}>
                {t('categories.sahabah')}
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={[
                  styles.storiesContainer,
                  { flexDirection: 'row' },
                ]}
                style={rtl.isRTL && !rtl.isSystemRTL ? { transform: [{ scaleX: -1 }] } : {}}
              >
                {sahabahStories.map((story) => (
                  <View
                    key={story.id}
                    style={rtl.isRTL && !rtl.isSystemRTL ? { transform: [{ scaleX: -1 }] } : {}}
                  >
                    <StoryCard
                      story={story}
                      onPress={() => handleStoryPress(story.id)}
                    />
                  </View>
                ))}
              </ScrollView>
            </Animated.View>
          )}

          {/* Educational Stories Section — most important first; RTL slider via scaleX */}
          {educationalStories.length > 0 && (
            <Animated.View
              entering={FadeInDown.duration(400).delay(400)}
              style={styles.section}
            >
              <Text style={[
                styles.sectionTitle,
                { color: colors.text, textAlign: rtl.textAlign }
              ]}>
                {t('categories.educational')}
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={[
                  styles.storiesContainer,
                  { flexDirection: 'row' },
                ]}
                style={rtl.isRTL && !rtl.isSystemRTL ? { transform: [{ scaleX: -1 }] } : {}}
              >
                {educationalStories.map((story) => (
                  <View
                    key={story.id}
                    style={rtl.isRTL && !rtl.isSystemRTL ? { transform: [{ scaleX: -1 }] } : {}}
                  >
                    <StoryCard
                      story={story}
                      onPress={() => handleStoryPress(story.id)}
                    />
                  </View>
                ))}
              </ScrollView>
            </Animated.View>
          )}

          {/* Banner Ad */}
          <View style={styles.adContainer}>
            <AdBanner unitId={AdUnitIds.BANNER_HOME} />
          </View>
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
  section: {
    marginTop: Spacing.lg,
  },
  sectionTitle: {
    ...TextStyles.headingSmall,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: Spacing.md,
    paddingHorizontal: Spacing.lg,
  },
  categoriesContainer: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.sm,
  },
  storiesContainer: {
    paddingHorizontal: Spacing.lg,
  },
  adContainer: {
    marginTop: Spacing.xl,
    paddingHorizontal: Spacing.lg,
    alignItems: 'center',
  },
});
