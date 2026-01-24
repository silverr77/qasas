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
import { Spacing, TextStyles } from '@/constants/theme';
import { getTimeBasedGreeting } from '@/utils/timer';

export function HomeHeader() {
  const { colors } = useAppTheme();
  const { t, language } = useTranslation();
  const greeting = getTimeBasedGreeting();

  return (
    <View style={styles.container}>
      {/* Left: Profile/App Icon */}
      <View style={[styles.iconContainer, { backgroundColor: colors.primaryLight }]}>
        <Text style={styles.icon}>🌙</Text>
      </View>

      {/* Center: Welcome Message */}
      <View style={styles.welcomeContainer}>
        <Text style={[styles.welcomeLabel, { color: colors.textSecondary }]}>
          {t('home.welcomeBack')}
        </Text>
        <Text style={[styles.welcomeText, { color: colors.text }]}>
          {language === 'ar' ? t('home.greetingAr') : t('home.greeting')}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
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
    marginRight: Spacing.md,
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
