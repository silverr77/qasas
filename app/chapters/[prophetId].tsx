/**
 * ChaptersScreen
 * List chapters for a specific prophet
 */

import { ChapterItem } from '@/components/chapter-item';
import { StoryImage } from '@/components/ui/image-placeholder';
import { SafeAreaView } from '@/components/ui/safe-area-view';
import { UnlockScreen } from '@/components/unlock/unlock-screen';
import { Shadows, Spacing, TextStyles } from '@/constants/theme';
import { getChaptersByProphetId } from '@/data/chapters';
import { getProphetById } from '@/data/prophets';
import { useAppTheme } from '@/hooks/use-app-theme';
import { useRTL } from '@/hooks/use-rtl';
import { useTranslation } from '@/hooks/use-translation';
import { useReadingStore } from '@/store/reading-store';
import { useUnlockStore } from '@/store/unlock-store';
import { useUserStore } from '@/store/user-store';
import { StoryChapter } from '@/types';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    FlatList,
    Image,
    Modal,
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';

// Story images: use require() so Metro bundles them. Keys must match story/prophet id.
const storyImages: Record<string, ReturnType<typeof require>> = {
  // Prophets
  'yusuf': require('@/assets/images/stories/prophets/yusuf.png'),
  'ibrahim': require('@/assets/images/stories/prophets/ibrahim.png'),
  'musa': require('@/assets/images/stories/prophets/musa.png'),
  'nuh': require('@/assets/images/stories/prophets/nuh.png'),
  'adam': require('@/assets/images/stories/prophets/adam.png'),
  'idris': require('@/assets/images/stories/prophets/idris.png'),
  'hud': require('@/assets/images/stories/prophets/hud.png'),
  'saleh': require('@/assets/images/stories/prophets/saleh.png'),
  'lut': require('@/assets/images/stories/prophets/lut.png'),
  'ismail': require('@/assets/images/stories/prophets/ismail.png'),
  // Sahabah
  'abu-bakr': require('@/assets/images/stories/sahabah/abu-bakr.png'),
  'umar': require('@/assets/images/stories/sahabah/umar.png'),
  'uthman': require('@/assets/images/stories/sahabah/uthman.png'),
  'ali': require('@/assets/images/stories/sahabah/ali.png'),
  // Educational
  'the-three-men': require('@/assets/images/stories/educational/the-three-men.png'),
  'the-merchant': require('@/assets/images/stories/educational/the-merchant.png'),
};

export default function ChaptersScreen() {
  const { colors } = useAppTheme();
  const { t } = useTranslation();
  const rtl = useRTL();
  const language = useUserStore((state) => state.language);
  const router = useRouter();
  const params = useLocalSearchParams<{ prophetId: string | string[] }>();
  // Expo Router can pass segment params as string or string[]; normalize to string
  const prophetId = typeof params.prophetId === 'string' ? params.prophetId : params.prophetId?.[0];

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

  const totalReadingTime = chapters.reduce(
    (sum, ch) => sum + ch.estimatedReadingTime,
    0
  );

  if (!prophet) {
    return (
      <SafeAreaView>
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: colors.textSecondary }]}>
            {t('emptyStates.noChaptersTitle')}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const handleBack = () => {
    router.back();
  };

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
      <Text style={[styles.storyName, { color: colors.text }]}>
        {storyName}
      </Text>
      
      <View style={[styles.metaRow, { flexDirection: rtl.row }]}>
        <Text style={[styles.metaText, { color: colors.textSecondary }]}>
          {t('common.category')}: {t(`categories.${prophet.category}`)}
        </Text>
        <Text style={[styles.metaDivider, { color: colors.textTertiary }]}>|</Text>
        <Text style={[styles.metaText, { color: colors.textSecondary }]}>
          {t('common.duration')}: {totalReadingTime} {t('durations.minutes', { count: totalReadingTime })}
        </Text>
      </View>

      <Text style={[styles.description, { color: colors.textSecondary, textAlign: rtl.textAlign }]}>
        {storyDescription}
      </Text>
      
      <View style={[styles.divider, { backgroundColor: colors.divider }]} />
      
      <Text style={[styles.chaptersTitle, { color: colors.text, textAlign: rtl.textAlign }]}>
        {t('chapters.title')}
      </Text>
    </View>
  );

  const storyImageSource = prophet?.id ? storyImages[prophet.id] : undefined;

  return (
    <View style={[styles.container, { backgroundColor: colors.creamBackground }]}>
      {/* Top Image Section */}
      <View style={styles.imageContainer}>
        {storyImageSource != null ? (
          <Image
            source={storyImageSource as number}
            style={styles.topImage}
            resizeMode="cover"
          />
        ) : (
          <StoryImage
            storyId={prophet.id}
            width={400}
            height={300}
            category={prophet.category}
            borderRadius={0}
          />
        )}
        
        {/* Back Button Overlay */}
        <Pressable 
          onPress={handleBack} 
          style={[
            styles.backButton, 
            { backgroundColor: 'rgba(255,255,255,0.8)' },
            rtl.isRTL ? { right: 20 } : { left: 20 }
          ]}
        >
          <Text style={styles.backIcon}>{rtl.isRTL ? '→' : '←'}</Text>
        </Pressable>
        
        {/* Bottom Curve/Wave Effect */}
        <View style={[styles.curveContainer, { backgroundColor: colors.creamBackground }]} />
      </View>

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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageContainer: {
    height: 300,
    width: '100%',
    position: 'relative',
  },
  topImage: {
    width: '100%',
    height: '100%',
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  curveContainer: {
    position: 'absolute',
    bottom: -1,
    left: 0,
    right: 0,
    height: 40,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    ...Shadows.sm,
  },
  backIcon: {
    fontSize: 24,
    fontWeight: '600',
  },
  listContent: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xxxl,
  },
  headerInfo: {
    alignItems: 'center',
    marginBottom: Spacing.lg,
    marginTop: 0, // Reset margin to prevent hiding title
    paddingTop: Spacing.md,
  },
  storyName: {
    ...TextStyles.headingLarge,
    fontSize: 28,
    fontWeight: '700',
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  metaRow: {
    alignItems: 'center',
    marginBottom: Spacing.md,
    gap: Spacing.sm,
  },
  metaText: {
    ...TextStyles.bodySmall,
    fontSize: 14,
  },
  metaDivider: {
    fontSize: 14,
  },
  description: {
    ...TextStyles.bodyMedium,
    lineHeight: 22,
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.lg,
  },
  divider: {
    height: 1,
    width: '60%',
    marginBottom: Spacing.xl,
    opacity: 0.3,
  },
  chaptersTitle: {
    ...TextStyles.headingMedium,
    fontSize: 22,
    fontWeight: '700',
    alignSelf: 'stretch',
    marginBottom: Spacing.md,
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
