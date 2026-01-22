/**
 * Settings Stack Layout
 * Navigation for settings sub-screens
 */

import { Stack } from 'expo-router';
import { useAppTheme } from '@/hooks/use-app-theme';

export default function SettingsLayout() {
  const { colors } = useAppTheme();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="language" />
      <Stack.Screen name="notifications" />
      <Stack.Screen name="about" />
    </Stack>
  );
}
