/**
 * ChapterItem Component
 * Displays a story chapter with reading time and lock status
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { StoryChapter } from '@/types';
import { Colors, Spacing, Radius, Shadows, TextStyles } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useTranslation } from '@/hooks/use-translation';
import { formatCountdown } from '@/utils/timer';

import { useRTL } from '@/hooks/use-rtl';
import { useUserStore } from '@/store/user-store';

interface ChapterItemProps {
  chapter: StoryChapter;
  onPress: () => void;
  isLocked: boolean;
  lockedUntil?: string | null;
  index: number;
}

export function ChapterItem({
  chapter,
  onPress,
  isLocked,
  lockedUntil,
  index,
}: ChapterItemProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { t } = useTranslation();
  const rtl = useRTL();
  const language = useUserStore((state) => state.language);
  
  const chapterTitle = language === 'ar' ? chapter.titleAr : chapter.titleEn;

  const handlePress = () => {
    if (isLocked) {
      // Still call onPress so the parent can show the unlock screen
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      onPress();
      return;
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  return (
    <Pressable
      onPress={handlePress}
      accessibilityRole="button"
      accessibilityLabel={`Chapter ${index + 1}: ${chapterTitle}`}
      accessibilityHint={isLocked ? 'Tap to unlock this chapter' : 'Tap to start reading'}
      style={({ pressed }) => [
        styles.container,
        {
          backgroundColor: isLocked ? colors.backgroundSecondary : colors.backgroundCard,
          borderColor: isLocked ? colors.borderLight : colors.border,
          opacity: pressed ? 0.9 : 1,
          transform: [{ scale: pressed ? 0.98 : 1 }],
          flexDirection: rtl.row,
        },
      ]}
    >
      {/* Chapter number */}
      <View
        style={[
          styles.numberContainer,
          {
            backgroundColor: isLocked ? colors.disabled : colors.primaryLight,
          },
          rtl.marginEnd(Spacing.md),
        ]}
      >
        {isLocked ? (
          <Text style={styles.lockIcon}>🔒</Text>
        ) : (
          <Text
            style={[
              styles.number,
              { color: isLocked ? colors.textTertiary : colors.primary },
            ]}
          >
            {index + 1}
          </Text>
        )}
      </View>

      {/* Content */}
      <View style={[styles.content, { alignItems: rtl.alignStart, flex: 1 }]}>
        <Text
          style={[
            styles.title,
            { color: isLocked ? colors.textTertiary : colors.text, textAlign: rtl.textAlign },
          ]}
          numberOfLines={2}
        >
          {chapterTitle}
        </Text>

        <View style={[styles.metaRow, { flexDirection: rtl.row }]}>
            <Text
              style={[
                styles.readingTime,
                { color: colors.textSecondary },
              ]}
            >
              📖 {t('chapters.estimatedTime', { time: chapter.estimatedReadingTime })}
            </Text>

            {isLocked && lockedUntil && (
              <Text
                style={[
                  styles.lockInfo,
                  { color: colors.textTertiary },
                ]}
              >
                {t('locked.unlocksIn', { time: formatCountdown(lockedUntil) })}
              </Text>
            )}
        </View>

        {/* Watch ad hint for locked chapters */}
        {isLocked && (
          <View style={[styles.unlockHint, { backgroundColor: colors.primaryLight }]}>
            <Text style={[styles.unlockHintText, { color: colors.primary }]}>
              📺 {t('unlock.tapToWatchAd')}
            </Text>
          </View>
        )}
      </View>

      {/* Arrow or lock */}
      <View style={[styles.arrowContainer, rtl.marginStart(Spacing.sm)]}>
        <Text style={[styles.arrow, { color: isLocked ? colors.primary : colors.textTertiary }]}>
          {rtl.isRTL ? '‹' : '›'}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: Radius.md,
    borderWidth: 1,
    marginBottom: Spacing.sm,
    ...Shadows.sm,
  },
  numberContainer: {
    width: 44,
    height: 44,
    borderRadius: Radius.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  number: {
    ...TextStyles.headingMedium,
  },
  lockIcon: {
    fontSize: 18,
  },
  content: {
    flex: 1,
  },
  title: {
    ...TextStyles.labelLarge,
    marginBottom: Spacing.xs,
  },
  metaRow: {
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  readingTime: {
    ...TextStyles.labelSmall,
  },
  lockInfo: {
    ...TextStyles.labelSmall,
    fontStyle: 'italic',
  },
  unlockHint: {
    marginTop: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: Radius.sm,
    alignSelf: 'flex-start',
  },
  unlockHintText: {
    ...TextStyles.labelSmall,
    fontSize: 11,
    fontWeight: '600',
  },
  arrowContainer: {
    width: 20,
  },
  arrow: {
    fontSize: 24,
    fontWeight: '300',
  },
});
