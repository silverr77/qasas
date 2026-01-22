/**
 * useAppTheme Hook
 * Returns the effective theme based on user preference and system setting
 */

import { useColorScheme as useSystemColorScheme } from 'react-native';
import { useUserStore } from '@/store/user-store';
import { Colors } from '@/constants/theme';

export type EffectiveTheme = 'light' | 'dark';

export function useAppTheme(): {
  theme: EffectiveTheme;
  colors: typeof Colors.light;
  isDark: boolean;
} {
  const systemColorScheme = useSystemColorScheme();
  const userTheme = useUserStore((state) => state.theme);

  // Determine effective theme
  let effectiveTheme: EffectiveTheme;

  if (userTheme === 'auto') {
    effectiveTheme = systemColorScheme === 'dark' ? 'dark' : 'light';
  } else {
    effectiveTheme = userTheme;
  }

  return {
    theme: effectiveTheme,
    colors: Colors[effectiveTheme],
    isDark: effectiveTheme === 'dark',
  };
}
