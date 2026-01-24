/**
 * Quick Settings Component
 * Floating settings panel for reading screen
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  ScrollView,
} from 'react-native';
import Animated, { FadeIn, FadeOut, SlideInDown, SlideOutDown } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Colors, Spacing, Radius, TextStyles, Shadows } from '@/constants/theme';
import { useAppTheme } from '@/hooks/use-app-theme';
import { useTranslation } from '@/hooks/use-translation';
import { useUserStore } from '@/store/user-store';
import { FontSizeSelector } from '@/components/font-size-selector';
import { Button } from '@/components/ui/button';

interface QuickSettingsProps {
  visible: boolean;
  onClose: () => void;
}

export function QuickSettings({ visible, onClose }: QuickSettingsProps) {
  const { colors } = useAppTheme();
  const { t } = useTranslation();
  const {
    fontSize,
    textColor,
    backgroundColor,
    lineSpacing,
    setFontSize,
    setTextColor,
    setBackgroundColor,
    setLineSpacing,
  } = useUserStore();

  const handleApply = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onClose();
  };

  const textColors: Array<{ value: typeof textColor; label: string; color: string }> = [
    { value: 'black', label: t('readingSettings.colors.black'), color: '#252521' },
    { value: 'darkGray', label: t('readingSettings.colors.darkGray'), color: '#5C5C52' },
    { value: 'brown', label: t('readingSettings.colors.brown'), color: '#7D5533' },
    { value: 'blue', label: t('readingSettings.colors.blue'), color: '#4A7C7E' },
  ];

  const backgroundColors: Array<{ value: typeof backgroundColor; label: string; color: string }> = [
    { value: 'white', label: t('readingSettings.backgrounds.white'), color: '#FFFFFF' },
    { value: 'beige', label: t('readingSettings.backgrounds.beige'), color: '#FDF9F3' },
    { value: 'cream', label: t('readingSettings.backgrounds.cream'), color: '#FAF3E8' },
    { value: 'dark', label: t('readingSettings.backgrounds.dark'), color: '#1F1E1B' },
  ];

  const lineSpacings: Array<{ value: typeof lineSpacing; label: string }> = [
    { value: 'tight', label: t('readingSettings.spacing.tight') },
    { value: 'normal', label: t('readingSettings.spacing.normal') },
    { value: 'wide', label: t('readingSettings.spacing.wide') },
  ];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Animated.View
          entering={FadeIn.duration(200)}
          exiting={FadeOut.duration(200)}
          style={styles.overlayContent}
        />
      </Pressable>

      <Animated.View
        entering={SlideInDown.duration(300)}
        exiting={SlideOutDown.duration(300)}
        style={[styles.container, { backgroundColor: colors.backgroundCard }]}
      >
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>
            {t('readingSettings.title')}
          </Text>
          <Pressable onPress={onClose}>
            <Text style={[styles.closeButton, { color: colors.textSecondary }]}>✕</Text>
          </Pressable>
        </View>

        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Font Size */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              {t('readingSettings.fontSize')}
            </Text>
            <FontSizeSelector selected={fontSize} onSelect={setFontSize} />
          </View>

          {/* Text Color */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              {t('readingSettings.textColor')}
            </Text>
            <View style={styles.colorOptions}>
              {textColors.map((option) => (
                <Pressable
                  key={option.value}
                  onPress={() => setTextColor(option.value)}
                  style={({ pressed }) => [
                    styles.colorOption,
                    {
                      backgroundColor: option.color,
                      borderColor: textColor === option.value ? colors.primary : colors.border,
                      borderWidth: textColor === option.value ? 3 : 1,
                      opacity: pressed ? 0.7 : 1,
                    },
                  ]}
                >
                  {textColor === option.value && (
                    <Text style={styles.checkmark}>✓</Text>
                  )}
                </Pressable>
              ))}
            </View>
          </View>

          {/* Background Color */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              {t('readingSettings.backgroundColor')}
            </Text>
            <View style={styles.colorOptions}>
              {backgroundColors.map((option) => (
                <Pressable
                  key={option.value}
                  onPress={() => setBackgroundColor(option.value)}
                  style={({ pressed }) => [
                    styles.colorOption,
                    {
                      backgroundColor: option.color,
                      borderColor: backgroundColor === option.value ? colors.primary : colors.border,
                      borderWidth: backgroundColor === option.value ? 3 : 1,
                      opacity: pressed ? 0.7 : 1,
                    },
                  ]}
                >
                  {backgroundColor === option.value && (
                    <Text style={styles.checkmark}>✓</Text>
                  )}
                </Pressable>
              ))}
            </View>
          </View>

          {/* Line Spacing */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              {t('readingSettings.lineSpacing')}
            </Text>
            <View style={styles.spacingOptions}>
              {lineSpacings.map((option) => (
                <Pressable
                  key={option.value}
                  onPress={() => setLineSpacing(option.value)}
                  style={({ pressed }) => [
                    styles.spacingOption,
                    {
                      backgroundColor: lineSpacing === option.value ? colors.primary : colors.backgroundSecondary,
                      borderColor: lineSpacing === option.value ? colors.primary : colors.border,
                      opacity: pressed ? 0.7 : 1,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.spacingOptionText,
                      {
                        color: lineSpacing === option.value ? colors.textInverse : colors.text,
                      },
                    ]}
                  >
                    {option.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <Button
            title={t('readingSettings.apply')}
            onPress={handleApply}
            variant="primary"
            fullWidth
          />
        </View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
  },
  overlayContent: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    maxHeight: '80%',
    ...Shadows.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  title: {
    ...TextStyles.headingMedium,
  },
  closeButton: {
    fontSize: 24,
    fontWeight: '300',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: Spacing.lg,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    ...TextStyles.labelMedium,
    marginBottom: Spacing.md,
  },
  colorOptions: {
    flexDirection: 'row',
    gap: Spacing.md,
    flexWrap: 'wrap',
  },
  colorOption: {
    width: 50,
    height: 50,
    borderRadius: Radius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  spacingOptions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  spacingOption: {
    flex: 1,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: Radius.md,
    borderWidth: 1,
    alignItems: 'center',
  },
  spacingOptionText: {
    ...TextStyles.labelMedium,
  },
  footer: {
    padding: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
  },
});
