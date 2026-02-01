/**
 * Home Header Component
 * Time-based greeting and welcome message
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
import { getTimeBasedGreeting } from '@/utils/timer';

export function HomeHeader() {
  const { colors } = useAppTheme();
  const { t, language } = useTranslation();
  const rtl = useRTL();
  const greeting = getTimeBasedGreeting();
  
  const displayGreeting = language === 'ar' ? greeting.arabic : greeting.greeting;
  
  // Icon based on time of day
  const getGreetingIcon = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return '🌅';
    if (hour >= 12 && hour < 17) return '☀️';
    if (hour >= 17 && hour < 21) return '🌇';
    return '🌙';
  };

  return (
    <View style={[styles.container, { flexDirection: rtl.row }]}>
      <View style={[styles.content, { alignItems: rtl.alignStart }]}>
        <Text style={[styles.greetingText, { color: colors.text, textAlign: rtl.textAlign }]}>
          {getGreetingIcon()} {displayGreeting}
        </Text>
        <Text style={[styles.subGreeting, { color: colors.textSecondary, textAlign: rtl.textAlign }]}>
          {language === 'ar' ? 'حان وقت قصة ملهمة' : 'Time for an inspiring story'}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.md,
    paddingHorizontal: Spacing.lg,
  },
  content: {
    flex: 1,
  },
  greetingText: {
    ...TextStyles.headingLarge,
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 4,
  },
  subGreeting: {
    ...TextStyles.bodyMedium,
    fontSize: 16,
    opacity: 0.8,
  },
});
