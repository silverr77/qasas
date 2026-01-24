/**
 * AboutScreen
 * App information, credits, and legal
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Linking,
} from 'react-native';
import { SafeAreaView } from '@/components/ui/safe-area-view';
import { ScreenHeader } from '@/components/ui/screen-header';
import { SettingSection } from '@/components/settings/setting-section';
import { SettingRow } from '@/components/settings/setting-row';
import { Spacing, TextStyles, Radius } from '@/constants/theme';
import { useAppTheme } from '@/hooks/use-app-theme';
import { useTranslation } from '@/hooks/use-translation';

const APP_VERSION = '1.0.0';
const BUILD_NUMBER = '1';

export default function AboutScreen() {
  const { colors } = useAppTheme();
  const { t } = useTranslation();

  const handleOpenLink = (url: string) => {
    Linking.openURL(url).catch(() => {
      // Handle error silently
    });
  };

  return (
    <SafeAreaView edges={['top']}>
      <ScreenHeader
        title={t('aboutScreen.title')}
        showBack
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* App Info */}
        <View style={styles.appInfo}>
          <View
            style={[
              styles.appIcon,
              { backgroundColor: colors.primaryLight },
            ]}
          >
            <Text style={styles.appIconEmoji}>🌙</Text>
          </View>
          <Text style={[styles.appName, { color: colors.text }]}>
            Qasas
          </Text>
          <Text style={[styles.appNameArabic, { color: colors.primary }]}>
            قصص الأنبياء
          </Text>
          <Text style={[styles.appTagline, { color: colors.textSecondary }]}>
            Stories of the Prophets
          </Text>
          <Text style={[styles.version, { color: colors.textTertiary }]}>
            Version {APP_VERSION} ({BUILD_NUMBER})
          </Text>
        </View>

        {/* Mission */}
        <View
          style={[
            styles.missionCard,
            {
              backgroundColor: colors.backgroundCard,
              borderColor: colors.border,
            },
          ]}
        >
          <Text style={[styles.missionTitle, { color: colors.text }]}>
            Our Mission
          </Text>
          <Text style={[styles.missionText, { color: colors.textSecondary }]}>
            Qasas is designed to help Muslims connect with the timeless wisdom in the stories of the prophets. We believe in mindful, intentional reading — taking time each day to reflect and grow, without pressure or distraction.
          </Text>
        </View>

        {/* Legal */}
        <SettingSection title={t('aboutScreen.legal')}>
          <SettingRow
            type="navigation"
            label={t('aboutScreen.privacyPolicy')}
            onPress={() => handleOpenLink('https://example.com/privacy')}
          />
          <SettingRow
            type="navigation"
            label={t('aboutScreen.termsOfService')}
            onPress={() => handleOpenLink('https://example.com/terms')}
            isLast
          />
        </SettingSection>

        {/* Support */}
        <SettingSection title={t('aboutScreen.support')}>
          <SettingRow
            type="navigation"
            label={t('aboutScreen.contactUs')}
            value="support@qasas.app"
            onPress={() => handleOpenLink('mailto:support@qasas.app')}
          />
          <SettingRow
            type="navigation"
            label={t('aboutScreen.rateTheApp')}
            onPress={() => handleOpenLink('https://apps.apple.com')}
            isLast
          />
        </SettingSection>

        {/* Credits */}
        <View style={styles.credits}>
          <Text style={[styles.creditsText, { color: colors.textTertiary }]}>
            {t('aboutScreen.builtWithLove')}
          </Text>
          <Text style={[styles.creditsArabic, { color: colors.primary }]}>
            {t('onboarding.bismillahAr')}
          </Text>
        </View>

        {/* Quote */}
        <View
          style={[
            styles.quoteCard,
            { backgroundColor: colors.accentLight },
          ]}
        >
          <Text style={[styles.quoteText, { color: colors.text }]}>
            {t('home.quote')}
          </Text>
          <Text style={[styles.quoteSource, { color: colors.textSecondary }]}>
            {t('home.quoteSource')}
          </Text>
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
  appInfo: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  appIcon: {
    width: 80,
    height: 80,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  appIconEmoji: {
    fontSize: 40,
  },
  appName: {
    ...TextStyles.displayMedium,
    marginBottom: Spacing.xs,
  },
  appNameArabic: {
    ...TextStyles.arabicMedium,
    marginBottom: Spacing.xs,
  },
  appTagline: {
    ...TextStyles.bodyMedium,
    marginBottom: Spacing.sm,
  },
  version: {
    ...TextStyles.labelSmall,
  },
  missionCard: {
    padding: Spacing.lg,
    borderRadius: Radius.lg,
    borderWidth: 1,
    marginBottom: Spacing.xl,
  },
  missionTitle: {
    ...TextStyles.headingSmall,
    marginBottom: Spacing.sm,
  },
  missionText: {
    ...TextStyles.bodyMedium,
    lineHeight: 24,
  },
  credits: {
    alignItems: 'center',
    marginVertical: Spacing.lg,
  },
  creditsText: {
    ...TextStyles.bodySmall,
    marginBottom: Spacing.xs,
  },
  creditsArabic: {
    ...TextStyles.arabicSmall,
  },
  quoteCard: {
    padding: Spacing.lg,
    borderRadius: Radius.lg,
    alignItems: 'center',
  },
  quoteText: {
    ...TextStyles.bodyMedium,
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  quoteSource: {
    ...TextStyles.labelSmall,
  },
});
