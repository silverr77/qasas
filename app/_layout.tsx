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
import { useUserStore } from '@/store/user-store';
import { Colors } from '@/constants/theme';
import i18n from '@/i18n';

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
  const [isReady, setIsReady] = useState(false);

  // Set RTL based on language
  useEffect(() => {
    const isRTL = language === 'ar';
    if (I18nManager.isRTL !== isRTL) {
      I18nManager.forceRTL(isRTL);
      I18nManager.allowRTL(isRTL);
      // Note: App restart may be needed for RTL to fully apply on some platforms
    }
    i18n.locale = language;
  }, [language]);

  // Wait for store to hydrate
  useEffect(() => {
    // Small delay to ensure store is hydrated
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

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
