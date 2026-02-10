/**
 * NotificationSettingsScreen
 * Configure daily reading reminders
 */

import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { SafeAreaView } from '@/components/ui/safe-area-view';
import { ScreenHeader } from '@/components/ui/screen-header';
import { SettingSection } from '@/components/settings/setting-section';
import { SettingRow } from '@/components/settings/setting-row';
import { Spacing, TextStyles, Radius } from '@/constants/theme';
import { useAppTheme } from '@/hooks/use-app-theme';
import { useTranslation } from '@/hooks/use-translation';
import { useRTL } from '@/hooks/use-rtl';
import { useUserStore } from '@/store/user-store';
import {
  registerForPushNotificationsAsync,
  scheduleDailyReminder,
  cancelDailyReminder,
} from '@/services/notificationService';

export default function NotificationSettingsScreen() {
  const { colors } = useAppTheme();
  const { t, language } = useTranslation();
  const rtl = useRTL();
  const {
    notificationsEnabled,
    reminderTime,
    setNotificationsEnabled,
    setReminderTime,
  } = useUserStore();

  useEffect(() => {
    registerForPushNotificationsAsync();
  }, []);

  const PRESET_TIMES = [
    { value: '06:00', label: '6:00 AM', period: t('notificationSettings.fajrTime') },
    { value: '08:00', label: '8:00 AM', period: t('notificationSettings.morning') },
    { value: '12:00', label: '12:00 PM', period: t('notificationSettings.noon') },
    { value: '18:00', label: '6:00 PM', period: t('notificationSettings.evening') },
    { value: '21:00', label: '9:00 PM', period: t('notificationSettings.night') },
  ];

  const handleToggleNotifications = async (enabled: boolean) => {
    if (enabled) {
      setNotificationsEnabled(true);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      const status = await registerForPushNotificationsAsync();
      if (status === 'granted') {
        await scheduleDailyReminder(reminderTime, {
          title: t('notificationSettings.notificationTitle'),
          body: t('notificationSettings.notificationBody'),
        });
      }
    } else {
      setNotificationsEnabled(false);
      await cancelDailyReminder();
    }
  };

  const handleSelectTime = async (time: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setReminderTime(time);
    if (notificationsEnabled) {
      await scheduleDailyReminder(time, {
        title: t('notificationSettings.notificationTitle'),
        body: t('notificationSettings.notificationBody'),
      });
    }
  };

  return (
    <SafeAreaView edges={['top']}>
      <ScreenHeader
        title={t('notificationSettings.title')}
        showBack
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Enable/Disable */}
        <SettingSection title={t('notificationSettings.dailyReminder')}>
          <SettingRow
            type="toggle"
            icon="🔔"
            label={t('notificationSettings.enableReminder')}
            sublabel={t('notificationSettings.enableReminderDesc')}
            value={notificationsEnabled}
            onValueChange={handleToggleNotifications}
            isLast
          />
        </SettingSection>

        {/* Time Selection */}
        {notificationsEnabled && (
          <View style={styles.timeSection}>
            <Text style={[
              styles.sectionLabel, 
              { color: colors.textSecondary, textAlign: rtl.textAlign },
              rtl.isRTL ? { marginRight: Spacing.xs } : { marginLeft: Spacing.xs }
            ]}>
              {t('notificationSettings.reminderTime')}
            </Text>
            <View style={[styles.timeOptions, { flexDirection: rtl.row }]}>
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
                      rtl.marginEnd(Spacing.sm),
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
            { backgroundColor: colors.backgroundSecondary, flexDirection: rtl.row },
          ]}
        >
          <Text style={[styles.infoIcon, rtl.marginEnd(Spacing.md)]}>🕊️</Text>
          <View style={[styles.infoContent, { alignItems: rtl.alignStart }]}>
            <Text style={[styles.infoTitle, { color: colors.text, textAlign: rtl.textAlign }]}>
              {t('notificationSettings.gentleReminders')}
            </Text>
            <Text style={[styles.infoText, { color: colors.textSecondary, textAlign: rtl.textAlign }]}>
              {t('notificationSettings.gentleRemindersDesc')}
            </Text>
          </View>
        </View>

        {/* Sample notification preview */}
        {notificationsEnabled && (
          <View style={styles.previewSection}>
            <Text style={[
              styles.sectionLabel, 
              { color: colors.textSecondary, textAlign: rtl.textAlign },
              rtl.isRTL ? { marginRight: Spacing.xs } : { marginLeft: Spacing.xs }
            ]}>
              {t('notificationSettings.preview')}
            </Text>
            <View
              style={[
                styles.notificationPreview,
                {
                  backgroundColor: colors.backgroundCard,
                  borderColor: colors.border,
                  alignItems: rtl.alignStart,
                },
              ]}
            >
              <View style={[styles.notificationHeader, { flexDirection: rtl.row }]}>
                <Text style={[styles.notificationAppIcon, rtl.marginEnd(Spacing.xs)]}>📖</Text>
                <Text style={[styles.notificationAppName, { color: colors.textSecondary, textAlign: rtl.textAlign }]}>
                  {t('aboutScreen.appName').toUpperCase()}
                </Text>
                <Text style={[styles.notificationTime, { color: colors.textTertiary, textAlign: rtl.textAlignOpposite }]}>
                  {language === 'ar' ? 'الآن' : 'now'}
                </Text>
              </View>
              <Text style={[styles.notificationTitle, { color: colors.text, textAlign: rtl.textAlign }]}>
                {t('notificationSettings.notificationTitle')}
              </Text>
              <Text style={[styles.notificationBody, { color: colors.textSecondary, textAlign: rtl.textAlign }]}>
                {t('notificationSettings.notificationBody')}
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
  },
  timeOptions: {
    flexWrap: 'wrap',
  },
  timeOption: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    alignItems: 'center',
    minWidth: '30%',
    marginBottom: Spacing.sm,
  },
  timeLabel: {
    ...TextStyles.labelLarge,
    marginBottom: 2,
  },
  timePeriod: {
    ...TextStyles.labelSmall,
  },
  infoCard: {
    padding: Spacing.md,
    borderRadius: Radius.lg,
    marginBottom: Spacing.xl,
  },
  infoIcon: {
    fontSize: 24,
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
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  notificationAppIcon: {
    fontSize: 16,
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
