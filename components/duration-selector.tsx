/**
 * DurationSelector Component
 * Choose reading duration with visual feedback
 */

import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import * as Haptics from 'expo-haptics';
import { ReadingDuration, DURATION_LABELS } from '@/types';
import { Colors, Spacing, Radius, Shadows, TextStyles } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useTranslation } from '@/hooks/use-translation';

interface DurationSelectorProps {
  selected: ReadingDuration;
  onSelect: (duration: ReadingDuration) => void;
}

const DURATIONS: ReadingDuration[] = [3, 5, 10];

export function DurationSelector({ selected, onSelect }: DurationSelectorProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { t } = useTranslation();

  const handleSelect = (duration: ReadingDuration) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onSelect(duration);
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: colors.textSecondary }]}>
        {t('readingSetup.readingDuration')}
      </Text>
      <View style={styles.options}>
        {DURATIONS.map((duration) => {
          const isSelected = selected === duration;
          return (
            <Pressable
              key={duration}
              onPress={() => handleSelect(duration)}
              accessibilityRole="radio"
              accessibilityState={{ selected: isSelected }}
              accessibilityLabel={DURATION_LABELS[duration]}
              style={[
                styles.option,
                {
                  backgroundColor: isSelected
                    ? colors.primary
                    : colors.backgroundCard,
                  borderColor: isSelected
                    ? colors.primary
                    : colors.border,
                },
                isSelected && Shadows.md,
              ]}
            >
              <Text
                style={[
                  styles.duration,
                  {
                    color: isSelected
                      ? colors.textInverse
                      : colors.text,
                  },
                ]}
              >
                {duration}
              </Text>
              <Text
                style={[
                  styles.unit,
                  {
                    color: isSelected
                      ? colors.textInverse
                      : colors.textSecondary,
                  },
                ]}
              >
                min
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
    marginBottom: Spacing.lg,
  },
  label: {
    ...TextStyles.labelMedium,
    marginBottom: Spacing.md,
  },
  options: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  option: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.lg,
    borderRadius: Radius.md,
    borderWidth: 1.5,
  },
  duration: {
    ...TextStyles.displayMedium,
  },
  unit: {
    ...TextStyles.labelSmall,
    marginTop: Spacing.xs,
  },
});
