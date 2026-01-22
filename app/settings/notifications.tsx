/**
 * NotificationSettingsScreen
 * Configure daily reading reminders
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
  Platform,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { SafeAreaView } from '@/components/ui/safe-area-view';
import { ScreenHeader } from '@/components/ui/screen-header';
import { SettingSection } from '@/components/settings/setting-section';
import { SettingRow } from '@/components/settings/setting-row';
import { Button } from '@/components/ui/button';
import { Spacing, TextStyles, Radius } from '@/constants/theme';
import { useAppTheme } from '@/hooks/use-app-theme';
import { useUserStore } from '@/store/user-store';

const PRESET_TIMES = [
  { value: '06:00', label: '6:00 AM', period: 'Fajr time' },
  { value: '08:00', label: '8:00 AM', period: 'Morning' },
  { value: '12:00', label: '12:00 PM', period: 'Noon' },
  { value: '18:00', label: '6:00 PM', period: 'Evening' },
  { value: '21:00', label: '9:00 PM', period: 'Night' },
];

export default function NotificationSettingsScreen() {
  const { colors } = useAppTheme();
  const {
    notificationsEnabled,
    reminderTime,
    setNotificationsEnabled,
    setReminderTime,
  } = useUserStore();

  const handleToggleNotifications = async (enabled: boolean) => {
    if (enabled) {
      // In a real app, we'd request permissions here
      // For now, just enable
      setNotificationsEnabled(true);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else {
      setNotificationsEnabled(false);
    }
  };

  const handleSelectTime = (time: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setReminderTime(time);
  };

  return (
    <SafeAreaView edges={['top']}>
      <ScreenHeader
        title="Notifications"
        titleAr="الإشعارات"
        showBack
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Enable/Disable */}
        <SettingSection title="Daily Reminder">
          <SettingRow
            type="toggle"
            icon="🔔"
            label="Enable Reminder"
            sublabel="Get a gentle nudge to continue reading"
            value={notificationsEnabled}
            onValueChange={handleToggleNotifications}
            isLast
          />
        </SettingSection>

        {/* Time Selection */}
        {notificationsEnabled && (
          <View style={styles.timeSection}>
            <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>
              Reminder Time
            </Text>
            <View style={styles.timeOptions}>
              {PRESET_TIMES.map((time) => {
                const isSelected = reminderTime === time.value;
                return (
                  <Pressable
                    key={time.value}
                    onPress={() => handleSelectTime(time.value)}
                    accessibilityRole="radio"
                    accessibilityState={{ selected: isSelected }}
                    accessibilityLabel={`${time.label}, ${time.period}`}
                    style={[
                      styles.timeOption,
                      {
                        backgroundColor: isSelected
                          ? colors.primaryLight
                          : colors.backgroundCard,
                        borderColor: isSelected
                          ? colors.primary
                          : colors.border,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.timeLabel,
                        { color: isSelected ? colors.primary : colors.text },
                      ]}
                    >
                      {time.label}
                    </Text>
                    <Text
                      style={[
                        styles.timePeriod,
                        { color: colors.textSecondary },
                      ]}
                    >
                      {time.period}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        )}

        {/* Info card */}
        <View
          style={[
            styles.infoCard,
            { backgroundColor: colors.backgroundSecondary },
          ]}
        >
          <Text style={styles.infoIcon}>🕊️</Text>
          <View style={styles.infoContent}>
            <Text style={[styles.infoTitle, { color: colors.text }]}>
              Gentle Reminders Only
            </Text>
            <Text style={[styles.infoText, { color: colors.textSecondary }]}>
              We believe in consistency without pressure. No streaks, no guilt — just a soft reminder to continue your journey when you're ready.
            </Text>
          </View>
        </View>

        {/* Sample notification preview */}
        {notificationsEnabled && (
          <View style={styles.previewSection}>
            <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>
              Preview
            </Text>
            <View
              style={[
                styles.notificationPreview,
                {
                  backgroundColor: colors.backgroundCard,
                  borderColor: colors.border,
                },
              ]}
            >
              <View style={styles.notificationHeader}>
                <Text style={styles.notificationAppIcon}>📖</Text>
                <Text style={[styles.notificationAppName, { color: colors.textSecondary }]}>
                  QASAS
                </Text>
                <Text style={[styles.notificationTime, { color: colors.textTertiary }]}>
                  now
                </Text>
              </View>
              <Text style={[styles.notificationTitle, { color: colors.text }]}>
                Time for Today's Story
              </Text>
              <Text style={[styles.notificationBody, { color: colors.textSecondary }]}>
                Continue your journey through the stories of the prophets 🌙
              </Text>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xxxl,
  },
  timeSection: {
    marginBottom: Spacing.xl,
  },
  sectionLabel: {
    ...TextStyles.labelSmall,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: Spacing.sm,
    marginLeft: Spacing.xs,
  },
  timeOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  timeOption: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    alignItems: 'center',
    minWidth: '30%',
  },
  timeLabel: {
    ...TextStyles.labelLarge,
    marginBottom: 2,
  },
  timePeriod: {
    ...TextStyles.labelSmall,
  },
  infoCard: {
    flexDirection: 'row',
    padding: Spacing.md,
    borderRadius: Radius.lg,
    marginBottom: Spacing.xl,
  },
  infoIcon: {
    fontSize: 24,
    marginRight: Spacing.md,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    ...TextStyles.labelMedium,
    marginBottom: Spacing.xs,
  },
  infoText: {
    ...TextStyles.bodySmall,
    lineHeight: 20,
  },
  previewSection: {
    marginTop: Spacing.md,
  },
  notificationPreview: {
    padding: Spacing.md,
    borderRadius: Radius.lg,
    borderWidth: 1,
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  notificationAppIcon: {
    fontSize: 16,
    marginRight: Spacing.xs,
  },
  notificationAppName: {
    ...TextStyles.labelSmall,
    flex: 1,
  },
  notificationTime: {
    ...TextStyles.labelSmall,
  },
  notificationTitle: {
    ...TextStyles.labelMedium,
    marginBottom: Spacing.xs,
  },
  notificationBody: {
    ...TextStyles.bodySmall,
  },
});
