/**
 * ThemedText Component
 * Text with automatic theme colors and style variants
 */

import { StyleSheet, Text, type TextProps } from 'react-native';

import { useThemeColor } from '@/hooks/use-theme-color';
import { TextStyles } from '@/constants/theme';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link' | 'arabic' | 'body';
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = 'default',
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  return (
    <Text
      style={[
        { color },
        type === 'default' ? styles.default : undefined,
        type === 'title' ? styles.title : undefined,
        type === 'defaultSemiBold' ? styles.defaultSemiBold : undefined,
        type === 'subtitle' ? styles.subtitle : undefined,
        type === 'link' ? styles.link : undefined,
        type === 'arabic' ? styles.arabic : undefined,
        type === 'body' ? styles.body : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    ...TextStyles.bodyMedium,
  },
  defaultSemiBold: {
    ...TextStyles.labelLarge,
  },
  title: {
    ...TextStyles.displayMedium,
  },
  subtitle: {
    ...TextStyles.headingMedium,
  },
  link: {
    ...TextStyles.bodyMedium,
    textDecorationLine: 'underline',
  },
  arabic: {
    ...TextStyles.arabicMedium,
  },
  body: {
    ...TextStyles.bodyLarge,
  },
});
