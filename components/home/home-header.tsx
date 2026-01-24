/**
 * Home Header Component
 * Welcome section with profile icon and greeting
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { useAppTheme } from '@/hooks/use-app-theme';
import { useTranslation } from '@/hooks/use-translation';
import { useRTL } from '@/hooks/use-rtl';
import { Spacing, TextStyles } from '@/constants/theme';

export function HomeHeader() {
  const { colors } = useAppTheme();
  const { t } = useTranslation();
  const rtl = useRTL();

  return (
    <View style={[styles.container, { flexDirection: rtl.row }]}>
      {/* Profile/App Icon */}
      <View style={[
        styles.iconContainer, 
        { backgroundColor: colors.primaryLight },
        rtl.marginEnd(Spacing.md),
      ]}>
        <Text style={styles.icon}>🌙</Text>
      </View>

      {/* Welcome Message */}
      <View style={[styles.welcomeContainer, { alignItems: rtl.alignStart }]}>
        <Text style={[
          styles.welcomeLabel, 
          { color: colors.textSecondary, textAlign: rtl.textAlign }
        ]}>
          {t('home.welcomeBack')}
        </Text>
        <Text style={[
          styles.welcomeText, 
          { color: colors.text, textAlign: rtl.textAlign }
        ]}>
          {t('home.greeting')}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
    paddingHorizontal: Spacing.lg,
    height: 80,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    fontSize: 24,
  },
  welcomeContainer: {
    flex: 1,
  },
  welcomeLabel: {
    ...TextStyles.labelSmall,
    fontSize: 12,
    marginBottom: 2,
  },
  welcomeText: {
    ...TextStyles.headingMedium,
    fontSize: 20,
  },
});
