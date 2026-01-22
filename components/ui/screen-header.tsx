/**
 * ScreenHeader Component
 * Consistent header across screens
 */

import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Colors, Spacing, TextStyles } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface ScreenHeaderProps {
  title: string;
  titleAr?: string;
  showBack?: boolean;
  rightAction?: React.ReactNode;
  onBackPress?: () => void;
}

export function ScreenHeader({
  title,
  titleAr,
  showBack = false,
  rightAction,
  onBackPress,
}: ScreenHeaderProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const router = useRouter();

  const handleBack = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (onBackPress) {
      onBackPress();
    } else {
      router.back();
    }
  };

  return (
    <View style={[styles.container, { borderBottomColor: colors.border }]}>
      {/* Left - Back button */}
      <View style={styles.left}>
        {showBack && (
          <Pressable
            onPress={handleBack}
            style={styles.backButton}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <Text style={[styles.backArrow, { color: colors.primary }]}>‹</Text>
          </Pressable>
        )}
      </View>

      {/* Center - Title */}
      <View style={styles.center}>
        {titleAr && (
          <Text
            style={[
              styles.titleArabic,
              { color: colors.primary },
            ]}
          >
            {titleAr}
          </Text>
        )}
        <Text
          style={[
            styles.title,
            { color: colors.text },
          ]}
          numberOfLines={1}
        >
          {title}
        </Text>
      </View>

      {/* Right - Actions */}
      <View style={styles.right}>{rightAction}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderBottomWidth: 0.5,
    minHeight: 56,
  },
  left: {
    width: 50,
    alignItems: 'flex-start',
  },
  center: {
    flex: 1,
    alignItems: 'center',
  },
  right: {
    width: 50,
    alignItems: 'flex-end',
  },
  backButton: {
    padding: Spacing.xs,
  },
  backArrow: {
    fontSize: 36,
    fontWeight: '300',
    marginTop: -4,
  },
  titleArabic: {
    ...TextStyles.arabicSmall,
    marginBottom: -2,
  },
  title: {
    ...TextStyles.headingSmall,
    textAlign: 'center',
  },
});
