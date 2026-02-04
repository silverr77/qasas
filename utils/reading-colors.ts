/**
 * Maps user reading preferences to actual colors and line spacing
 * Used by reading screen and quick-settings so they stay in sync
 */

import type { TextColor, BackgroundColor, LineSpacing } from '@/store/user-store';

const TEXT_COLOR_MAP: Record<TextColor, string> = {
  black: '#252521',
  darkGray: '#5C5C52',
  brown: '#7D5533',
  blue: '#4A7C7E',
};

const BACKGROUND_COLOR_MAP: Record<BackgroundColor, string> = {
  white: '#FFFFFF',
  beige: '#FDF9F3',
  cream: '#FAF3E8',
  dark: '#1F1E1B',
};

// When background is dark, use light text for contrast
const DARK_BG_TEXT = '#E8E6E3';

export function getReadingBackgroundColor(backgroundColor: BackgroundColor): string {
  return BACKGROUND_COLOR_MAP[backgroundColor];
}

export function getReadingTextColor(
  textColor: TextColor,
  backgroundColor: BackgroundColor
): string {
  if (backgroundColor === 'dark') {
    return DARK_BG_TEXT;
  }
  return TEXT_COLOR_MAP[textColor];
}

export function getLineSpacingMultiplier(lineSpacing: LineSpacing): number {
  switch (lineSpacing) {
    case 'tight':
      return 1.4;
    case 'wide':
      return 2.0;
    case 'normal':
    default:
      return 1.7;
  }
}
