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
import { formatCountdown } from '@/utils/timer';

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

  const handlePress = () => {
    if (isLocked) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      return;
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  return (
    <Pressable
      onPress={handlePress}
      accessibilityRole="button"
      accessibilityLabel={`Chapter ${index + 1}: ${chapter.title}`}
      accessibilityHint={isLocked ? 'This chapter is locked' : 'Tap to start reading'}
      accessibilityState={{ disabled: isLocked }}
      style={({ pressed }) => [
        styles.container,
        {
          backgroundColor: isLocked ? colors.backgroundSecondary : colors.backgroundCard,
          borderColor: isLocked ? colors.borderLight : colors.border,
          opacity: pressed && !isLocked ? 0.9 : 1,
          transform: [{ scale: pressed && !isLocked ? 0.98 : 1 }],
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
      <View style={styles.content}>
        <Text
          style={[
            styles.title,
            { color: isLocked ? colors.textTertiary : colors.text },
          ]}
          numberOfLines={2}
        >
          {chapter.title}
        </Text>

        <View style={styles.metaRow}>
          <Text
            style={[
              styles.readingTime,
              { color: colors.textSecondary },
            ]}
          >
            📖 {chapter.estimatedReadingTime} min read
          </Text>

          {isLocked && lockedUntil && (
            <Text
              style={[
                styles.lockInfo,
                { color: colors.textTertiary },
              ]}
            >
              Unlocks in {formatCountdown(lockedUntil)}
            </Text>
          )}
        </View>
      </View>

      {/* Arrow or lock */}
      <View style={styles.arrowContainer}>
        <Text style={[styles.arrow, { color: colors.textTertiary }]}>
          {isLocked ? '' : '›'}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
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
    marginRight: Spacing.md,
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
    flexDirection: 'row',
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
  arrowContainer: {
    marginLeft: Spacing.sm,
    width: 20,
  },
  arrow: {
    fontSize: 24,
    fontWeight: '300',
  },
});
