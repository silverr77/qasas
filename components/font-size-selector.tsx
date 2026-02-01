/**
 * FontSizeSelector Component
 * Adjust reading font size for accessibility
 */

import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import * as Haptics from 'expo-haptics';
import { ReadingPreferences, FONT_SIZES } from '@/types';
import { Colors, Radius, Shadows } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useRTL } from '@/hooks/use-rtl';

// Re-export FONT_SIZES for use in other components
export { FONT_SIZES };

interface FontSizeSelectorProps {
  selected: ReadingPreferences['fontSize'];
  onSelect: (size: ReadingPreferences['fontSize']) => void;
}

const SIZES: ReadingPreferences['fontSize'][] = ['small', 'medium', 'large', 'xlarge'];

const SIZE_LABELS: Record<ReadingPreferences['fontSize'], string> = {
  small: 'A',
  medium: 'A',
  large: 'A',
  xlarge: 'A',
};

export function FontSizeSelector({ selected, onSelect }: FontSizeSelectorProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const rtl = useRTL();

  const handleSelect = (size: ReadingPreferences['fontSize']) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onSelect(size);
  };

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.options,
          {
            backgroundColor: colors.backgroundSecondary,
            borderColor: colors.border,
            flexDirection: rtl.row,
          },
        ]}
      >
        {SIZES.map((size) => {
          const isSelected = selected === size;
          const fontSize = FONT_SIZES[size] * 0.8; // Scale down for preview
          return (
            <Pressable
              key={size}
              onPress={() => handleSelect(size)}
              accessibilityRole="radio"
              accessibilityState={{ selected: isSelected }}
              accessibilityLabel={`${size} font size`}
              style={[
                styles.option,
                {
                  backgroundColor: isSelected
                    ? colors.backgroundCard
                    : 'transparent',
                  borderColor: isSelected
                    ? colors.border
                    : 'transparent',
                },
              ]}
            >
              <Text
                style={[
                  styles.sizeLabel,
                  {
                    fontSize,
                    color: isSelected ? colors.text : colors.textSecondary,
                  },
                ]}
              >
                {SIZE_LABELS[size]}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // marginBottom is handled by parent
  },
  options: {
    borderRadius: Radius.md,
    borderWidth: 1,
    padding: 4,
  },
  option: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: Radius.sm,
    borderWidth: 1,
  },
  sizeLabel: {
    fontWeight: '600',
  },
});
