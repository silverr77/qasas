/**
 * ProphetCard Component
 * Displays a prophet's name and description in an elegant card
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  AccessibilityProps,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { Prophet } from '@/types';
import { Colors, Spacing, Radius, Shadows, TextStyles } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useTranslation } from '@/hooks/use-translation';
import { useUserStore } from '@/store/user-store';

interface ProphetCardProps extends AccessibilityProps {
  prophet: Prophet;
  onPress: () => void;
  chaptersCount?: number;
}

export function ProphetCard({ prophet, onPress, chaptersCount }: ProphetCardProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { t } = useTranslation();
  const language = useUserStore((state) => state.language);
  
  const prophetName = language === 'ar' ? prophet.nameAr : prophet.nameEn;

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  return (
    <Pressable
      onPress={handlePress}
      accessibilityRole="button"
      accessibilityLabel={`${prophetName}, ${language === 'ar' ? prophet.shortDescriptionAr : prophet.shortDescriptionEn}`}
      accessibilityHint="Tap to view chapters"
      style={({ pressed }) => [
        styles.container,
        {
          backgroundColor: colors.backgroundCard,
          borderColor: colors.border,
          opacity: pressed ? 0.9 : 1,
          transform: [{ scale: pressed ? 0.98 : 1 }],
        },
      ]}
    >
      {/* Illustration / Emoji */}
      <View
        style={[
          styles.illustrationContainer,
          { backgroundColor: colors.primaryLight },
        ]}
      >
        <Text style={styles.illustration}>{prophet.illustration}</Text>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Story Name */}
        <Text
          style={[
            language === 'ar' ? styles.nameArabic : styles.nameEnglish,
            { color: language === 'ar' ? colors.primary : colors.text },
          ]}
        >
          {prophetName}
        </Text>

        {/* Description */}
        <Text
          style={[
            styles.description,
            { color: colors.textSecondary },
          ]}
          numberOfLines={2}
        >
          {language === 'ar' ? prophet.shortDescriptionAr : prophet.shortDescriptionEn}
        </Text>

        {/* Chapters count */}
        {chaptersCount !== undefined && (
          <Text
            style={[
              styles.chaptersCount,
              { color: colors.textTertiary },
            ]}
          >
            {chaptersCount === 1
              ? t('prophets.chaptersOne')
              : t('prophets.chapters', { count: chaptersCount })}
          </Text>
        )}
      </View>

      {/* Arrow indicator */}
      <View style={styles.arrowContainer}>
        <Text style={[styles.arrow, { color: colors.textTertiary }]}>›</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
    borderRadius: Radius.lg,
    borderWidth: 1,
    marginBottom: Spacing.md,
    ...Shadows.md,
  },
  illustrationContainer: {
    width: 64,
    height: 64,
    borderRadius: Radius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  illustration: {
    fontSize: 32,
  },
  content: {
    flex: 1,
  },
  nameArabic: {
    ...TextStyles.arabicMedium,
    marginBottom: Spacing.xs,
  },
  nameEnglish: {
    ...TextStyles.headingSmall,
    marginBottom: Spacing.xs,
  },
  description: {
    ...TextStyles.bodySmall,
    marginBottom: Spacing.xs,
  },
  chaptersCount: {
    ...TextStyles.labelSmall,
    marginTop: Spacing.xs,
  },
  arrowContainer: {
    marginLeft: Spacing.sm,
  },
  arrow: {
    fontSize: 28,
    fontWeight: '300',
  },
});
