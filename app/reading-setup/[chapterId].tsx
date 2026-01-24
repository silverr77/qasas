/**
 * ReadingSetupScreen
 * Configure reading session before starting
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from '@/components/ui/safe-area-view';
import { ScreenHeader } from '@/components/ui/screen-header';
import { Button } from '@/components/ui/button';
import { DurationSelector } from '@/components/duration-selector';
import { IntentionSelector } from '@/components/intention-selector';
import { Spacing, TextStyles, Radius } from '@/constants/theme';
import { useAppTheme } from '@/hooks/use-app-theme';
import { useTranslation } from '@/hooks/use-translation';
import { useReadingStore } from '@/store/reading-store';
import { useUserStore } from '@/store/user-store';
import { getChapterById } from '@/data/chapters';
import { getProphetById } from '@/data/prophets';
import { paginateTextSimple } from '@/utils/paginate-text';
import { ReadingDuration, ReadingIntention } from '@/types';

export default function ReadingSetupScreen() {
  const { colors } = useAppTheme();
  const { t } = useTranslation();
  const router = useRouter();
  const { chapterId } = useLocalSearchParams<{ chapterId: string }>();

  const { startSession, setLastRead, isChapterLocked } = useReadingStore();
  const { fontSize } = useUserStore();

  const chapter = chapterId ? getChapterById(chapterId) : null;
  const story = chapter ? getProphetById(chapter.storyId) : null; // Using getProphetById for backward compatibility

  const [duration, setDuration] = useState<ReadingDuration>(5);
  const [intention, setIntention] = useState<ReadingIntention | undefined>();

  // Check if chapter is locked
  if (chapter && isChapterLocked(chapter.id)) {
    router.back();
    return null;
  }

  if (!chapter || !story) {
    return (
      <SafeAreaView>
        <ScreenHeader title="Not Found" showBack />
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: colors.textSecondary }]}>
            Chapter not found
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const handleStartReading = () => {
    // Calculate pages
    const { totalPages } = paginateTextSimple(chapter.content, fontSize);

    // Start the session
    startSession(chapter.id, duration, totalPages, intention);

    // Track last read
    setLastRead(story.id, chapter.id);

    // Navigate to reading screen
    router.replace(`/reading/${chapter.id}`);
  };

  return (
    <SafeAreaView edges={['top']}>
      <ScreenHeader
        title={t('readingSetup.title')}
        showBack
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Chapter info */}
        <View
          style={[
            styles.chapterCard,
            {
              backgroundColor: colors.backgroundCard,
              borderColor: colors.border,
            },
          ]}
        >
          <Text style={[styles.chapterTitle, { color: colors.text }]}>
            {chapter.title}
          </Text>
          <Text style={[styles.prophetName, { color: colors.textSecondary }]}>
            {story.nameEn}
          </Text>
          <Text style={[styles.readingTime, { color: colors.textTertiary }]}>
            📖 {t('chapters.estimatedTime', { time: chapter.estimatedReadingTime })}
          </Text>
        </View>

        {/* Intention */}
        <IntentionSelector
          selected={intention}
          onSelect={setIntention}
        />

        {/* Duration */}
        <DurationSelector
          selected={duration}
          onSelect={setDuration}
        />

        {/* Mindfulness note */}
        <View
          style={[
            styles.mindfulnessCard,
            { backgroundColor: colors.accentLight },
          ]}
        >
          <Text style={styles.mindfulnessEmoji}>🕊️</Text>
          <Text style={[styles.mindfulnessText, { color: colors.text }]}>
            Take a moment to clear your mind. Reading with intention helps the wisdom settle deeper in your heart.
          </Text>
        </View>

        {/* Start button */}
        <Button
          title="Begin Reading"
          onPress={handleStartReading}
          size="large"
          fullWidth
          style={styles.startButton}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xxxl,
  },
  chapterCard: {
    padding: Spacing.lg,
    borderRadius: Radius.lg,
    borderWidth: 1,
    marginBottom: Spacing.xl,
    alignItems: 'center',
  },
  chapterTitle: {
    ...TextStyles.headingMedium,
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  prophetName: {
    ...TextStyles.bodyMedium,
    marginBottom: Spacing.sm,
  },
  readingTime: {
    ...TextStyles.labelSmall,
  },
  mindfulnessCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: Radius.md,
    marginBottom: Spacing.xl,
  },
  mindfulnessEmoji: {
    fontSize: 24,
    marginRight: Spacing.md,
  },
  mindfulnessText: {
    ...TextStyles.bodySmall,
    flex: 1,
  },
  startButton: {
    marginTop: Spacing.md,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    ...TextStyles.bodyMedium,
  },
});
