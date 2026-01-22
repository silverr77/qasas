/**
 * Onboarding Stack Layout
 * Navigation for onboarding screens
 */

import { Stack } from 'expo-router';
import { useAppTheme } from '@/hooks/use-app-theme';

export default function OnboardingLayout() {
  const { colors } = useAppTheme();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
        animation: 'fade',
        gestureEnabled: false, // Prevent swipe back during onboarding
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="language" />
      <Stack.Screen name="preferences" />
      <Stack.Screen name="notifications" />
      <Stack.Screen name="bismillah" />
    </Stack>
  );
}
