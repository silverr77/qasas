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
import { useRTL } from '@/hooks/use-rtl';

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
  const rtl = useRTL();

  const handleBack = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (onBackPress) {
      onBackPress();
    } else {
      router.back();
    }
  };

  return (
    <View style={[
      styles.container, 
      { borderBottomColor: colors.border, flexDirection: rtl.row }
    ]}>
      {/* Left/Start - Back button */}
      <View style={[styles.side, { alignItems: rtl.alignStart }]}>
        {showBack && (
          <Pressable
            onPress={handleBack}
            style={styles.backButton}
            accessibilityRole="button"
            accessibilityLabel={rtl.isRTL ? 'رجوع' : 'Go back'}
          >
            <Text style={[styles.backArrow, { color: colors.primary }]}>
              {rtl.isRTL ? '›' : '‹'}
            </Text>
          </Pressable>
        )}
      </View>

      {/* Center - Title */}
      <View style={styles.center}>
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

      {/* Right/End - Actions */}
      <View style={[styles.side, { alignItems: rtl.alignEnd }]}>{rightAction}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // flexDirection applied dynamically via rtl.row
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderBottomWidth: 0.5,
    minHeight: 56,
  },
  side: {
    width: 50,
  },
  center: {
    flex: 1,
    alignItems: 'center',
  },
  backButton: {
    padding: Spacing.xs,
  },
  backArrow: {
    fontSize: 36,
    fontWeight: '300',
    marginTop: -4,
  },
  title: {
    ...TextStyles.headingSmall,
    textAlign: 'center',
  },
});
