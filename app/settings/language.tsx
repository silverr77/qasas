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
// Using RNRestart for app reload - expo-updates may not be installed
// For development builds, manual restart may be needed
import { SafeAreaView } from '@/components/ui/safe-area-view';
import { ScreenHeader } from '@/components/ui/screen-header';
import { LanguageSelector } from '@/components/settings/language-selector';
import { Spacing, TextStyles, Radius } from '@/constants/theme';
import { useAppTheme } from '@/hooks/use-app-theme';
import { useTranslation } from '@/hooks/use-translation';
import { useRTL } from '@/hooks/use-rtl';
import { useUserStore } from '@/store/user-store';

export default function LanguageSettingsScreen() {
  const { colors } = useAppTheme();
  const { t } = useTranslation();
  const rtl = useRTL();
  const { language, setLanguage } = useUserStore();

  const handleLanguageChange = (newLanguage: 'en' | 'ar') => {
    setLanguage(newLanguage);
    // RTL changes are handled automatically in _layout.tsx via useEffect
  };

  return (
    <SafeAreaView edges={['top']}>
      <ScreenHeader
        title={t('languageSettings.title')}
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
          onSelect={handleLanguageChange}
        />

        {/* Preview */}
        <View style={styles.previewSection}>
          <Text style={[
            styles.previewLabel, 
            { color: colors.textSecondary, textAlign: rtl.textAlign },
            rtl.isRTL ? { marginRight: Spacing.xs } : { marginLeft: Spacing.xs }
          ]}>
            {t('languageSettings.preview')}
          </Text>
          <View
            style={[
              styles.previewCard,
              {
                backgroundColor: colors.backgroundCard,
                borderColor: colors.border,
                alignItems: 'center',
              },
            ]}
          >
            <Text style={[styles.previewText, { color: colors.text, textAlign: 'center' }]}>
              {t('home.greeting')}
            </Text>
            <Text style={[styles.previewSubtext, { color: colors.textSecondary, textAlign: 'center' }]}>
              {t('languageSettings.peaceBeUponYou')}
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
  previewSection: {
    marginTop: Spacing.xl,
  },
  previewLabel: {
    ...TextStyles.labelSmall,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: Spacing.sm,
  },
  previewCard: {
    padding: Spacing.lg,
    borderRadius: Radius.lg,
    borderWidth: 1,
  },
  previewText: {
    ...TextStyles.headingMedium,
    marginBottom: Spacing.xs,
  },
  previewSubtext: {
    ...TextStyles.bodyMedium,
  },
});
