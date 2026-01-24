/**
 * Qasas Design System
 * A calm, Islamic-inspired color palette and typography
 */

import { Platform } from 'react-native';

// Islamic-inspired color palette
// Warm, earthy tones that evoke tranquility and spirituality
export const Palette = {
  // Primary - Warm sand/beige tones
  sand: {
    50: '#FDF9F3',
    100: '#FAF3E8',
    200: '#F5E6D3',
    300: '#EDD4B8',
    400: '#E0BC94',
    500: '#D4A574',
    600: '#C08B56',
    700: '#A67243',
    800: '#7D5533',
    900: '#5C3F26',
  },

  // Secondary - Soft sage green (Islamic green, muted)
  sage: {
    50: '#F4F7F4',
    100: '#E8EFE9',
    200: '#D1DFD3',
    300: '#B5CCB9',
    400: '#94B49A',
    500: '#739A7B',
    600: '#5A7D61',
    700: '#476350',
    800: '#374D3E',
    900: '#2A3B2F',
  },

  // Accent - Muted gold (warmth, spirituality)
  gold: {
    50: '#FFFBF0',
    100: '#FFF5DC',
    200: '#FFEAB8',
    300: '#FFDB85',
    400: '#F5C654',
    500: '#E8B130',
    600: '#C9941D',
    700: '#A47516',
    800: '#7D5912',
    900: '#5C420E',
  },

  // Neutrals - Warm grays
  neutral: {
    50: '#FAFAF8',
    100: '#F5F5F2',
    200: '#EAEAE5',
    300: '#DDDDD6',
    400: '#BDBDB4',
    500: '#9D9D92',
    600: '#7A7A6F',
    700: '#5C5C52',
    800: '#3D3D36',
    900: '#252521',
  },

  // Semantic colors
  white: '#FFFFFF',
  black: '#1A1A18',
  error: '#C45C5C',
  success: '#5C8A65',
};

// Light theme
const lightColors = {
  // Backgrounds
  background: Palette.sand[50],
  backgroundSecondary: Palette.sand[100],
  backgroundCard: Palette.white,
  backgroundElevated: Palette.white,

  // Text
  text: Palette.neutral[900],
  textSecondary: Palette.neutral[600],
  textTertiary: Palette.neutral[500],
  textInverse: Palette.white,

  // Primary actions and accents
  primary: Palette.sage[600],
  primaryLight: Palette.sage[100],
  primaryDark: Palette.sage[800],

  // Secondary accents
  accent: Palette.gold[500],
  accentLight: Palette.gold[100],

  // UI elements
  border: Palette.neutral[200],
  borderLight: Palette.neutral[100],
  divider: Palette.sand[200],

  // States
  disabled: Palette.neutral[300],
  error: Palette.error,
  success: Palette.success,

  // Specific elements
  icon: Palette.neutral[600],
  iconSecondary: Palette.neutral[400],
  tabIconDefault: Palette.neutral[400],
  tabIconSelected: Palette.sage[600],
  tint: Palette.sage[600],

  // Reading experience
  readingBackground: '#FFFDF9',
  readingText: Palette.neutral[800],

  // New design colors
  creamBackground: '#FAF8F3',
  lightCreamCard: '#FDF9F3',
  orangeAccent: '#FF6B35',
  softOrange: '#FF8C5A',
  primaryText: '#2C2C2C',
  secondaryText: '#6B6B6B',
  tertiaryText: '#9B9B9B',
  
  // Category colors
  categoryProphets: '#739A7B',
  categoryProphetsLight: '#E8F0EA',
  categorySahabah: '#E8B130',
  categorySahabahLight: '#FDF8E8',
  categoryEducational: '#4A7C7E',
  categoryEducationalLight: '#E8F0F2',

  // Cards and shadows
  cardShadow: 'rgba(93, 79, 62, 0.08)',

  // Overlay
  overlay: 'rgba(37, 37, 33, 0.5)',
};

// Dark theme - Warm dark tones
const darkColors = {
  // Backgrounds
  background: '#1C1B18',
  backgroundSecondary: '#242320',
  backgroundCard: '#2A2925',
  backgroundElevated: '#323129',

  // Text
  text: Palette.sand[100],
  textSecondary: Palette.sand[300],
  textTertiary: Palette.neutral[500],
  textInverse: Palette.neutral[900],

  // Primary actions and accents
  primary: Palette.sage[400],
  primaryLight: 'rgba(148, 180, 154, 0.15)',
  primaryDark: Palette.sage[300],

  // Secondary accents
  accent: Palette.gold[400],
  accentLight: 'rgba(245, 198, 84, 0.15)',

  // UI elements
  border: '#3D3C37',
  borderLight: '#2F2E2A',
  divider: '#3D3C37',

  // States
  disabled: Palette.neutral[700],
  error: '#E07777',
  success: '#77B082',

  // Specific elements
  icon: Palette.sand[300],
  iconSecondary: Palette.neutral[500],
  tabIconDefault: Palette.neutral[500],
  tabIconSelected: Palette.sage[400],
  tint: Palette.sage[400],

  // Reading experience
  readingBackground: '#1F1E1B',
  readingText: Palette.sand[200],

  // New design colors (dark mode variants)
  creamBackground: '#1C1B18',
  lightCreamCard: '#2A2925',
  orangeAccent: '#FF8C5A',
  softOrange: '#FFA67A',
  primaryText: Palette.sand[100],
  secondaryText: Palette.sand[300],
  tertiaryText: Palette.neutral[500],
  
  // Category colors (dark mode)
  categoryProphets: Palette.sage[400],
  categoryProphetsLight: 'rgba(148, 180, 154, 0.15)',
  categorySahabah: Palette.gold[400],
  categorySahabahLight: 'rgba(245, 198, 84, 0.15)',
  categoryEducational: '#6A9FA1',
  categoryEducationalLight: 'rgba(74, 124, 126, 0.15)',

  // Cards and shadows
  cardShadow: 'rgba(0, 0, 0, 0.3)',

  // Overlay
  overlay: 'rgba(0, 0, 0, 0.7)',
};

export const Colors = {
  light: lightColors,
  dark: darkColors,
};

// Typography
export const Fonts = Platform.select({
  ios: {
    sans: 'System',
    serif: 'Georgia',
    rounded: 'System',
    mono: 'Menlo',
    // Arabic-friendly system font
    arabic: 'System',
  },
  default: {
    sans: 'System',
    serif: 'serif',
    rounded: 'System',
    mono: 'monospace',
    arabic: 'System',
  },
});

// Spacing scale (updated for new design)
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
};

// Border radius (updated for new design)
export const Radius = {
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  full: 9999,
};

// Shadows for iOS
export const Shadows = {
  sm: {
    shadowColor: '#5D4F3E',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#5D4F3E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  lg: {
    shadowColor: '#5D4F3E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 5,
  },
};

// Animation durations
export const Animation = {
  fast: 150,
  normal: 300,
  slow: 500,
};

// Animation config for react-native-reanimated
export const Animations = {
  pageFlip: {
    duration: 300,
  },
  fadeIn: {
    duration: 200,
  },
  spring: {
    damping: 15,
    stiffness: 150,
  },
  cardPress: {
    scale: 0.98,
  },
};

// High Contrast colors for accessibility
export const HighContrastColors = {
  light: {
    text: '#000000',
    background: '#FFFFFF',
    primary: '#2D5A3D',
    border: '#000000',
  },
  dark: {
    text: '#FFFFFF',
    background: '#000000',
    primary: '#7CB88F',
    border: '#FFFFFF',
  },
};

// Common text styles
export const TextStyles = {
  // Display - Large titles
  displayLarge: {
    fontSize: 32,
    lineHeight: 40,
    fontWeight: '700' as const,
    letterSpacing: -0.5,
  },
  displayMedium: {
    fontSize: 28,
    lineHeight: 36,
    fontWeight: '600' as const,
    letterSpacing: -0.3,
  },

  // Headings
  headingLarge: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: '600' as const,
  },
  headingMedium: {
    fontSize: 20,
    lineHeight: 28,
    fontWeight: '600' as const,
  },
  headingSmall: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '600' as const,
  },

  // Body text
  bodyLarge: {
    fontSize: 18,
    lineHeight: 28,
    fontWeight: '400' as const,
  },
  bodyMedium: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400' as const,
  },
  bodySmall: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400' as const,
  },

  // Labels and captions
  labelLarge: {
    fontSize: 16,
    lineHeight: 20,
    fontWeight: '500' as const,
  },
  labelMedium: {
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '500' as const,
  },
  labelSmall: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '500' as const,
  },

  // Arabic text (larger for readability)
  arabicLarge: {
    fontSize: 28,
    lineHeight: 44,
    fontWeight: '400' as const,
  },
  arabicMedium: {
    fontSize: 22,
    lineHeight: 36,
    fontWeight: '400' as const,
  },
  arabicSmall: {
    fontSize: 18,
    lineHeight: 28,
    fontWeight: '400' as const,
  },
  arabicDisplay: {
    fontSize: 36,
    lineHeight: 52,
    fontWeight: '500' as const,
  },
};
