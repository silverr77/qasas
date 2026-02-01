/**
 * Home Header Component
 * App title with points and profile icon
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
} from 'react-native';
import { useAppTheme } from '@/hooks/use-app-theme';
import { useTranslation } from '@/hooks/use-translation';
import { useRTL } from '@/hooks/use-rtl';
import { useReadingStore } from '@/store/reading-store';
import { Spacing, TextStyles, Radius } from '@/constants/theme';

export function HomeHeader() {
  const { colors } = useAppTheme();
  const { t } = useTranslation();
  const rtl = useRTL();
  const { chapterProgress } = useReadingStore();
  
  // Calculate points based on completed chapters
  const points = Object.values(chapterProgress).reduce(
    (acc, p) => acc + (p.completedSessions * 10),
    0
  );

  return (
    <View style={[styles.container, { flexDirection: rtl.row }]}>
      {/* App Name */}
      <Text style={[styles.appName, { color: colors.text }]}>
        {t('home.title')}
      </Text>

      {/* Right side: Points + Profile */}
      <View style={[styles.rightSection, { flexDirection: rtl.row }]}>
        {/* Points Badge */}
        <View style={[
          styles.pointsBadge,
          { backgroundColor: colors.accentLight },
          rtl.isRTL ? { marginLeft: Spacing.sm } : { marginRight: Spacing.sm }
        ]}>
          <Text style={styles.starIcon}>⭐</Text>
          <Text style={[styles.pointsText, { color: colors.orangeAccent }]}>
            {points}
          </Text>
        </View>

        {/* Profile Icon */}
        <Pressable style={[styles.profileButton, { backgroundColor: colors.orangeAccent }]}>
          <Text style={styles.profileIcon}>👤</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Spacing.md,
    paddingBottom: Spacing.md,
    paddingHorizontal: Spacing.lg,
    height: 60,
  },
  appName: {
    ...TextStyles.headingMedium,
    fontSize: 22,
    fontWeight: '700',
  },
  rightSection: {
    alignItems: 'center',
  },
  pointsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.full,
  },
  starIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  pointsText: {
    fontSize: 14,
    fontWeight: '600',
  },
  profileButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileIcon: {
    fontSize: 18,
  },
});
