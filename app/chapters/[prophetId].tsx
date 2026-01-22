/**
 * ChaptersScreen
 * List chapters for a specific prophet
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
import { ScreenHeader } from '@/components/ui/screen-header';
import { ChapterItem } from '@/components/chapter-item';
import { Spacing, TextStyles, Radius } from '@/constants/theme';
import { useAppTheme } from '@/hooks/use-app-theme';
import { getProphetById } from '@/data/prophets';
import { getChaptersByProphetId } from '@/data/chapters';
import { useReadingStore } from '@/store/reading-store';
import { StoryChapter } from '@/types';

export default function ChaptersScreen() {
  const { colors } = useAppTheme();
  const router = useRouter();
  const { prophetId } = useLocalSearchParams<{ prophetId: string }>();

  const { isChapterLocked, getUnlockTime } = useReadingStore();

  const prophet = prophetId ? getProphetById(prophetId) : null;
  const chapters = prophetId ? getChaptersByProphetId(prophetId) : [];

  if (!prophet) {
    return (
      <SafeAreaView>
        <ScreenHeader title="Not Found" showBack />
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: colors.textSecondary }]}>
            Prophet not found
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const handleChapterPress = (chapter: StoryChapter) => {
    if (isChapterLocked(chapter.id)) return;
    router.push(`/reading-setup/${chapter.id}`);
  };

  const renderChapter = ({ item, index }: { item: StoryChapter; index: number }) => {
    const locked = isChapterLocked(item.id);
    const unlockTime = getUnlockTime(item.id);

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
      <Text style={[styles.prophetNameAr, { color: colors.primary }]}>
        {prophet.nameAr}
      </Text>
      <Text style={[styles.prophetNameEn, { color: colors.text }]}>
        {prophet.nameEn}
      </Text>
      <Text style={[styles.description, { color: colors.textSecondary }]}>
        {prophet.shortDescription}
      </Text>
      <View style={[styles.divider, { backgroundColor: colors.divider }]} />
      <Text style={[styles.chaptersTitle, { color: colors.text }]}>
        Chapters
      </Text>
    </View>
  );

  return (
    <SafeAreaView edges={['top']}>
      <ScreenHeader
        title={prophet.nameEn}
        titleAr={prophet.nameAr}
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
              No chapters available yet
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
  prophetNameAr: {
    ...TextStyles.arabicLarge,
    marginBottom: Spacing.xs,
  },
  prophetNameEn: {
    ...TextStyles.headingMedium,
    marginBottom: Spacing.sm,
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
