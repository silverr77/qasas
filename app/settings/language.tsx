/**
 * LanguageSettingsScreen
 * Select primary app language
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from '@/components/ui/safe-area-view';
import { ScreenHeader } from '@/components/ui/screen-header';
import { LanguageSelector } from '@/components/settings/language-selector';
import { Spacing, TextStyles, Radius } from '@/constants/theme';
import { useAppTheme } from '@/hooks/use-app-theme';
import { useUserStore } from '@/store/user-store';

export default function LanguageSettingsScreen() {
  const { colors } = useAppTheme();
  const { language, setLanguage } = useUserStore();

  return (
    <SafeAreaView edges={['top']}>
      <ScreenHeader
        title="Language"
        titleAr="اللغة"
        showBack
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Language selector */}
        <LanguageSelector
          selected={language}
          onSelect={setLanguage}
        />

        {/* Info note */}
        <View
          style={[
            styles.infoCard,
            { backgroundColor: colors.accentLight },
          ]}
        >
          <Text style={styles.infoIcon}>ℹ️</Text>
          <Text style={[styles.infoText, { color: colors.text }]}>
            Arabic text will always appear alongside your chosen language to maintain the spiritual connection with the original texts.
          </Text>
        </View>

        {/* Preview */}
        <View style={styles.previewSection}>
          <Text style={[styles.previewLabel, { color: colors.textSecondary }]}>
            Preview
          </Text>
          <View
            style={[
              styles.previewCard,
              {
                backgroundColor: colors.backgroundCard,
                borderColor: colors.border,
              },
            ]}
          >
            <Text style={[styles.previewArabic, { color: colors.primary }]}>
              السلام عليكم
            </Text>
            <Text style={[styles.previewText, { color: colors.text }]}>
              {language === 'en' ? 'Assalamu Alaikum' : 'السلام عليكم'}
            </Text>
            <Text style={[styles.previewSubtext, { color: colors.textSecondary }]}>
              {language === 'en' ? 'Peace be upon you' : 'السلام عليكم ورحمة الله'}
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xxxl,
  },
  infoCard: {
    flexDirection: 'row',
    padding: Spacing.md,
    borderRadius: Radius.md,
    marginTop: Spacing.xl,
  },
  infoIcon: {
    fontSize: 18,
    marginRight: Spacing.sm,
  },
  infoText: {
    ...TextStyles.bodySmall,
    flex: 1,
  },
  previewSection: {
    marginTop: Spacing.xl,
  },
  previewLabel: {
    ...TextStyles.labelSmall,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: Spacing.sm,
    marginLeft: Spacing.xs,
  },
  previewCard: {
    padding: Spacing.lg,
    borderRadius: Radius.lg,
    borderWidth: 1,
    alignItems: 'center',
  },
  previewArabic: {
    ...TextStyles.arabicLarge,
    marginBottom: Spacing.sm,
  },
  previewText: {
    ...TextStyles.headingMedium,
    marginBottom: Spacing.xs,
  },
  previewSubtext: {
    ...TextStyles.bodyMedium,
  },
});
