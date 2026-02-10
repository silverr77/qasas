/**
 * Notification service: permission request, Android channel, and daily reminder scheduling.
 * Used for onboarding and settings reminder flow.
 */

import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

const DAILY_REMINDER_ID = 'daily-reading-reminder';
const ANDROID_CHANNEL_ID = 'reminders';

// Foreground behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export type NotificationPermissionStatus = 'granted' | 'denied' | 'undetermined';

/**
 * Request notification permission and set up Android channel.
 * Call when user enters reminder flow (onboarding notifications screen or settings > notifications).
 */
export async function registerForPushNotificationsAsync(): Promise<NotificationPermissionStatus> {
  try {
    // On simulator/emulator, isDevice is false – we still try to request so devs can test when the OS allows it
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      return finalStatus as NotificationPermissionStatus;
    }

    if (Device.isDevice && Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync(ANDROID_CHANNEL_ID, {
        name: 'Reminders',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#2D5A3D',
        sound: 'default',
      });
    }

    return 'granted';
  } catch (error) {
    console.error('Notification permission request failed:', error);
    return 'denied';
  }
}

/**
 * Get current notification permission status.
 */
export async function getNotificationPermissionStatus(): Promise<NotificationPermissionStatus> {
  const { status } = await Notifications.getPermissionsAsync();
  return status as NotificationPermissionStatus;
}

export type ScheduleReminderOptions = {
  title: string;
  body: string;
};

/**
 * Schedule a daily local notification at the given time (e.g. "08:00").
 * Replaces any existing daily reminder. Call after permission is granted.
 */
export async function scheduleDailyReminder(
  timeHHMM: string,
  options: ScheduleReminderOptions
): Promise<void> {
  const [hourStr, minuteStr] = timeHHMM.split(':');
  const hour = parseInt(hourStr, 10);
  const minute = parseInt(minuteStr, 10);
  if (Number.isNaN(hour) || Number.isNaN(minute)) return;

  await Notifications.cancelScheduledNotificationAsync(DAILY_REMINDER_ID);

  await Notifications.scheduleNotificationAsync({
    identifier: DAILY_REMINDER_ID,
    content: {
      title: options.title,
      body: options.body,
      sound: true,
      channelId: Platform.OS === 'android' ? ANDROID_CHANNEL_ID : undefined,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour,
      minute,
    },
  });
}

/**
 * Cancel the daily reminder. Call when user disables reminders.
 */
export async function cancelDailyReminder(): Promise<void> {
  await Notifications.cancelScheduledNotificationAsync(DAILY_REMINDER_ID);
}
