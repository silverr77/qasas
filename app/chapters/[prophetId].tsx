/**
 * ChaptersScreen
 * List chapters for a specific prophet
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Modal,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from '@/components/ui/safe-area-view';
import { ScreenHeader } from '@/components/ui/screen-header';
import { ChapterItem } from '@/components/chapter-item';
import { UnlockScreen } from '@/components/unlock/unlock-screen';
import { Spacing, TextStyles, Radius } from '@/constants/theme';
import { useAppTheme } from '@/hooks/use-app-theme';
import { useTranslation } from '@/hooks/use-translation';
import { useUserStore } from '@/store/user-store';
import { getProphetById } from '@/data/prophets';
import { getChaptersByProphetId } from '@/data/chapters';
import { useReadingStore } from '@/store/reading-store';
import { useUnlockStore } from '@/store/unlock-store';
import { StoryChapter } from '@/types';

export default function ChaptersScreen() {
  const { colors } = useAppTheme();
  const { t } = useTranslation();
  const language = useUserStore((state) => state.language);
  const router = useRouter();
  const { prophetId } = useLocalSearchParams<{ prophetId: string }>();

  const { isChapterLocked, getUnlockTime } = useReadingStore();
  const {
    isChapterUnlocked,
    shouldShowUnlockOption,
  } = useUnlockStore();

  const [unlockChapter, setUnlockChapter] = useState<StoryChapter | null>(null);

  const prophet = prophetId ? getProphetById(prophetId) : null;
  const chapters = prophetId ? getChaptersByProphetId(prophetId) : [];
  
  const storyName = prophet ? (language === 'ar' ? prophet.nameAr : prophet.nameEn) : '';
  const storyDescription = prophet ? (language === 'ar' ? prophet.shortDescriptionAr : prophet.shortDescriptionEn) : '';

  if (!prophet) {
    return (
      <SafeAreaView>
        <ScreenHeader title={t('common.loading')} showBack />
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: colors.textSecondary }]}>
            {t('emptyStates.noChaptersTitle')}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const handleChapterPress = (chapter: StoryChapter) => {
    // Check if chapter needs unlocking (unlock system)
    const needsUnlock = shouldShowUnlockOption(chapter.id, chapter.storyId, chapter.chapterNumber);
    const isUnlocked = isChapterUnlocked(chapter.id, chapter.storyId);
    
    // Check if chapter is locked (reading session lock)
    const isSessionLocked = isChapterLocked(chapter.id);

    if (needsUnlock && !isUnlocked) {
      // Show unlock screen
      setUnlockChapter(chapter);
      return;
    }

    if (isSessionLocked) {
      // Chapter is locked from reading session (24h cooldown)
      return;
    }

    // Chapter is available, proceed to reading setup
    router.push(`/reading-setup/${chapter.id}`);
  };

  const handleUnlocked = () => {
    setUnlockChapter(null);
    if (unlockChapter) {
      router.push(`/reading-setup/${unlockChapter.id}`);
    }
  };

  const renderChapter = ({ item, index }: { item: StoryChapter; index: number }) => {
    // Check unlock system status
    const needsUnlock = shouldShowUnlockOption(item.id, item.storyId, item.chapterNumber);
    const isUnlocked = isChapterUnlocked(item.id, item.storyId);
    
    // Check reading session lock
    const isSessionLocked = isChapterLocked(item.id);
    const unlockTime = getUnlockTime(item.id);

    // Chapter is locked if it needs unlock OR is session locked
    const locked = (needsUnlock && !isUnlocked) || isSessionLocked;

    return (
      <ChapterItem
        chapter={item}
        index={index}
        onPress={() => handleChapterPress(item)}
        isLocked={locked}
        lockedUntil={unlockTime}
      />
    );
  };

  const ListHeader = () => (
    <View style={styles.headerInfo}>
      <View
        style={[
          styles.illustrationContainer,
          { backgroundColor: colors.primaryLight },
        ]}
      >
        <Text style={styles.illustration}>{prophet.illustration}</Text>
      </View>
      <Text style={[styles.storyName, { color: colors.text }]}>
        {storyName}
      </Text>
      <Text style={[styles.description, { color: colors.textSecondary }]}>
        {storyDescription}
      </Text>
      <View style={[styles.divider, { backgroundColor: colors.divider }]} />
      <Text style={[styles.chaptersTitle, { color: colors.text }]}>
        {t('chapters.title')}
      </Text>
    </View>
  );

  return (
    <SafeAreaView edges={['top']}>
      <ScreenHeader
        title={storyName}
        showBack
      />

      <FlatList
        data={chapters}
        keyExtractor={(item) => item.id}
        renderItem={renderChapter}
        ListHeaderComponent={ListHeader}
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

      {/* Unlock Modal */}
      {unlockChapter && (
        <Modal
          visible={!!unlockChapter}
          animationType="slide"
          presentationStyle="pageSheet"
          onRequestClose={() => setUnlockChapter(null)}
        >
          <UnlockScreen
            chapterId={unlockChapter.id}
            storyId={unlockChapter.storyId}
            category={unlockChapter.category}
            chapterNumber={unlockChapter.chapterNumber}
            onUnlocked={handleUnlocked}
            onCancel={() => setUnlockChapter(null)}
          />
        </Modal>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  listContent: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xxxl,
  },
  headerInfo: {
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  illustrationContainer: {
    width: 80,
    height: 80,
    borderRadius: Radius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  illustration: {
    fontSize: 40,
  },
  storyName: {
    ...TextStyles.headingMedium,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  description: {
    ...TextStyles.bodyMedium,
    textAlign: 'center',
    paddingHorizontal: Spacing.md,
  },
  divider: {
    height: 1,
    width: 100,
    marginVertical: Spacing.lg,
  },
  chaptersTitle: {
    ...TextStyles.headingSmall,
    marginBottom: Spacing.sm,
  },
  emptyContainer: {
    alignItems: 'center',
    padding: Spacing.xl,
  },
  emptyText: {
    ...TextStyles.bodyMedium,
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
