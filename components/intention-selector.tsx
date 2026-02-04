/**
 * IntentionSelector Component
 * Set reading intention for mindful reading
 */

import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import * as Haptics from 'expo-haptics';
import { ReadingIntention, INTENTION_LABELS } from '@/types';
import { Colors, Spacing, Radius, TextStyles } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useTranslation } from '@/hooks/use-translation';
import { useRTL } from '@/hooks/use-rtl';
import { useUserStore } from '@/store/user-store';

interface IntentionSelectorProps {
  selected?: ReadingIntention;
  onSelect: (intention: ReadingIntention) => void;
}

const INTENTIONS: ReadingIntention[] = ['learning', 'patience', 'faith', 'gratitude'];

const INTENTION_ICONS: Record<ReadingIntention, string> = {
  learning: '📖',
  patience: '🌿',
  faith: '✨',
  gratitude: '💚',
};

export function IntentionSelector({ selected, onSelect }: IntentionSelectorProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { t } = useTranslation();
  const rtl = useRTL();
  const language = useUserStore((state) => state.language);

  const handleSelect = (intention: ReadingIntention) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onSelect(intention);
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: colors.textSecondary, textAlign: rtl.textAlign }]}>
        {t('readingSetup.setIntention')}
      </Text>
      <Text style={[styles.sublabel, { color: colors.textTertiary, textAlign: rtl.textAlign }]}>
        {t('readingSetup.intentionQuestion')}
      </Text>
      <View style={styles.options}>
        {INTENTIONS.map((intention) => {
          const isSelected = selected === intention;
          const labels = INTENTION_LABELS[intention];
          return (
            <Pressable
              key={intention}
              onPress={() => handleSelect(intention)}
              accessibilityRole="radio"
              accessibilityState={{ selected: isSelected }}
              accessibilityLabel={`${labels.en} - ${labels.ar}`}
              style={[
                styles.option,
                {
                  backgroundColor: isSelected
                    ? colors.primaryLight
                    : colors.backgroundCard,
                  borderColor: isSelected
                    ? colors.primary
                    : colors.borderLight,
                  flexDirection: rtl.row,
                },
              ]}
            >
              <Text style={[styles.icon, rtl.marginEnd(Spacing.md)]}>{INTENTION_ICONS[intention]}</Text>
              <View style={styles.textContainer}>
                <Text
                  style={[
                    language === 'ar' ? styles.intentionAr : styles.intentionEn,
                    { 
                      color: isSelected ? colors.primary : colors.textSecondary,
                      textAlign: rtl.textAlign,
                    },
                  ]}
                >
                  {language === 'ar' ? labels.ar : labels.en}
                </Text>
              </View>
              {isSelected && (
                <View
                  style={[
                    styles.checkmark,
                    { backgroundColor: colors.primary },
                    rtl.marginStart(Spacing.sm),
                  ]}
                >
                  <Text style={styles.checkmarkText}>✓</Text>
                </View>
              )}
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
    marginBottom: Spacing.xs,
  },
  sublabel: {
    ...TextStyles.bodySmall,
    marginBottom: Spacing.md,
  },
  options: {
    gap: Spacing.sm,
  },
  option: {
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: Radius.md,
    borderWidth: 1.5,
  },
  icon: {
    fontSize: 24,
  },
  textContainer: {
    flex: 1,
  },
  intentionAr: {
    ...TextStyles.arabicSmall,
    marginBottom: 2,
  },
  intentionEn: {
    ...TextStyles.labelMedium,
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmarkText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
