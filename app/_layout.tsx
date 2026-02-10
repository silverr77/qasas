/**
 * Root Layout
 * Main navigation structure for the Qasas app
 */

import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator, I18nManager } from 'react-native';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';

import { useAppTheme } from '@/hooks/use-app-theme';
import { useUserStore, userStoreRehydrationPromise } from '@/store/user-store';
import { Colors } from '@/constants/theme';
import i18n from '@/i18n';
import { requestTrackingPermission } from '@/utils/trackingPermission';
import {
  getNotificationPermissionStatus,
  scheduleDailyReminder,
} from '@/services/notificationService';

// Custom theme extending React Navigation's default
const QasasLightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: Colors.light.primary,
    background: Colors.light.background,
    card: Colors.light.backgroundCard,
    text: Colors.light.text,
    border: Colors.light.border,
    notification: Colors.light.accent,
  },
};

const QasasDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: Colors.dark.primary,
    background: Colors.dark.background,
    card: Colors.dark.backgroundCard,
    text: Colors.dark.text,
    border: Colors.dark.border,
    notification: Colors.dark.accent,
  },
};

export default function RootLayout() {
  const { colors, isDark } = useAppTheme();
  const navTheme = isDark ? QasasDarkTheme : QasasLightTheme;
  const hasCompletedOnboarding = useUserStore((state) => state.hasCompletedOnboarding);
  const language = useUserStore((state) => state.language);
  const notificationsEnabled = useUserStore((state) => state.notificationsEnabled);
  const reminderTime = useUserStore((state) => state.reminderTime);
  const [isReady, setIsReady] = useState(false);

  // Set RTL based on language (native API is inverted on some RN/Expo: pass true for LTR/English, false for RTL/Arabic)
  useEffect(() => {
    const nativeRTL = language === 'en';
    if (I18nManager.isRTL !== nativeRTL) {
      I18nManager.forceRTL(nativeRTL);
      I18nManager.allowRTL(nativeRTL);
    }
    i18n.locale = language;
  }, [language]);

  // Wait for persisted user store to rehydrate so we show onboarding vs home correctly on fresh install
  useEffect(() => {
    let cancelled = false;
    userStoreRehydrationPromise.then(() => {
      if (!cancelled) setIsReady(true);
    });
    return () => { cancelled = true; };
  }, []);

  // App Tracking Transparency (iOS): request once at launch
  useEffect(() => {
    requestTrackingPermission().catch((err) => {
      console.error('ATT request failed:', err);
    });
  }, []);

  // Sync daily reminder when app opens (if reminders enabled and permission already granted)
  useEffect(() => {
    if (!isReady || !hasCompletedOnboarding || !notificationsEnabled) return;
    getNotificationPermissionStatus().then((status) => {
      if (status === 'granted') {
        scheduleDailyReminder(reminderTime, {
          title: i18n.t('notificationSettings.notificationTitle'),
          body: i18n.t('notificationSettings.notificationBody'),
        }).catch((err) => console.error('Schedule reminder sync failed:', err));
      }
    });
  }, [isReady, hasCompletedOnboarding, notificationsEnabled, reminderTime, language]);

  // Show loading while store hydrates
  if (!isReady) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    );
  }

  // Determine initial route based on onboarding status
  const initialRouteName = hasCompletedOnboarding ? '(tabs)' : 'onboarding';

  return (
    <ThemeProvider value={navTheme}>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
          animation: 'slide_from_right',
        }}
        initialRouteName={initialRouteName}
      >
        <Stack.Screen
          name="onboarding"
          options={{
            animation: 'fade',
            gestureEnabled: false,
          }}
        />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="prophets"
          options={{
            animation: 'slide_from_right',
          }}
        />
        <Stack.Screen
          name="stories"
          options={{
            animation: 'slide_from_right',
          }}
        />
        <Stack.Screen
          name="categories/[categoryId]"
          options={{
            animation: 'slide_from_right',
          }}
        />
        <Stack.Screen
          name="chapters/[prophetId]"
          options={{
            animation: 'slide_from_right',
          }}
        />
        <Stack.Screen
          name="reading-setup/[chapterId]"
          options={{
            animation: 'slide_from_right',
          }}
        />
        <Stack.Screen
          name="reading/[chapterId]"
          options={{
            animation: 'fade',
            gestureEnabled: false,
          }}
        />
        <Stack.Screen
          name="reflection/[chapterId]"
          options={{
            animation: 'fade',
            gestureEnabled: false,
          }}
        />
        <Stack.Screen
          name="settings"
          options={{
            animation: 'slide_from_right',
          }}
        />
        <Stack.Screen
          name="settings/reading-preferences"
          options={{
            animation: 'slide_from_right',
          }}
        />
      </Stack>
      <StatusBar style={isDark ? 'light' : 'dark'} />
    </ThemeProvider>
  );
}
