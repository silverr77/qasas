/**
 * Hook to get the current theme's colors
 */

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export function useColors() {
  const colorScheme = useColorScheme();
  return Colors[colorScheme ?? 'light'];
}
