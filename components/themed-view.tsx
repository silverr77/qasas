/**
 * ThemedView Component
 * View with automatic theme background color
 */

import { View, type ViewProps } from 'react-native';

import { useThemeColor } from '@/hooks/use-theme-color';

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
  variant?: 'default' | 'card' | 'secondary';
};

export function ThemedView({
  style,
  lightColor,
  darkColor,
  variant = 'default',
  ...otherProps
}: ThemedViewProps) {
  const colorKey = variant === 'card' 
    ? 'backgroundCard' 
    : variant === 'secondary' 
    ? 'backgroundSecondary' 
    : 'background';
  
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    colorKey as any
  );

  return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}
