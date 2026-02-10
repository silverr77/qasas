/**
 * SettingsScreen
 * Main settings and preferences screen
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import * as StoreReview from 'expo-store-review';
import { SafeAreaView } from '@/components/ui/safe-area-view';
import { ScreenHeader } from '@/components/ui/screen-header';
import { SettingSection } from '@/components/settings/setting-section';
import { SettingRow } from '@/components/settings/setting-row';
import { Spacing, TextStyles, Radius } from '@/constants/theme';
import { useAppTheme } from '@/hooks/use-app-theme';
import { useTranslation } from '@/hooks/use-translation';
import { useRTL } from '@/hooks/use-rtl';
import { useUserStore } from '@/store/user-store';

// Enable dev mode (set to false for production)
const DEV_MODE = __DEV__;

const LANGUAGE_LABELS = {
  en: 'English',
  ar: 'العربية',
};

const APP_VERSION = '1.0.0';

export default function SettingsScreen() {
  const { colors } = useAppTheme();
  const { t } = useTranslation();
  const rtl = useRTL();
  const router = useRouter();

  const {
    language,
    notificationsEnabled,
    reminderTime,
    resetOnboarding,
    resetSettings,
    setLastRatingRequestDate,
  } = useUserStore();

  const [devTapCount, setDevTapCount] = useState(0);
  const [showDevMode, setShowDevMode] = useState(DEV_MODE);

  const handleRateUs = async () => {
    try {
      const available = await StoreReview.isAvailableAsync();
      if (available) {
        await StoreReview.requestReview();
        setLastRatingRequestDate(new Date().toISOString());
      }
    } catch {
      // Ignore; store review may not be available (e.g. dev client)
    }
  };

  // Secret tap to enable dev mode (tap version 5 times)
  const handleVersionTap = () => {
    const newCount = devTapCount + 1;
    setDevTapCount(newCount);
    
    if (newCount >= 5 && !showDevMode) {
      setShowDevMode(true);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    
    // Reset count after 2 seconds
    setTimeout(() => setDevTapCount(0), 2000);
  };

  const handleResetOnboarding = () => {
    const isArabic = language === 'ar';
    Alert.alert(
      isArabic ? 'إعادة تعيين البدء' : 'Reset Onboarding',
      isArabic ? 'سيتم إعادة تعيين تدفق البدء. سيبدأ التطبيق من شاشة الترحيب.' : 'This will reset the onboarding flow. The app will restart at the welcome screen.',
      [
        { text: isArabic ? 'إلغاء' : 'Cancel', style: 'cancel' },
        {
          text: isArabic ? 'إعادة' : 'Reset',
          style: 'destructive',
          onPress: () => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            resetOnboarding();
            // Force reload by navigating
            router.replace('/onboarding');
          },
        },
      ]
    );
  };

  const handleResetAllData = () => {
    const isArabic = language === 'ar';
    Alert.alert(
      isArabic ? 'إعادة تعيين جميع البيانات' : 'Reset All Data',
      isArabic ? 'سيتم إعادة تعيين جميع بيانات التطبيق بما في ذلك تقدم القراءة والإعدادات. لا يمكن التراجع عن هذا.' : 'This will reset ALL app data including reading progress, settings, and onboarding. This cannot be undone.',
      [
        { text: isArabic ? 'إلغاء' : 'Cancel', style: 'cancel' },
        {
          text: isArabic ? 'إعادة الكل' : 'Reset Everything',
          style: 'destructive',
          onPress: () => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            resetSettings();
            // Reset reading store as well
            // Navigate to onboarding
            router.replace('/onboarding');
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView>
      <ScreenHeader
        title={t('settings.title')}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Reading Preferences */}
        <SettingSection title={t('settings.readingPreferences')}>
          <SettingRow
            type="navigation"
            icon="📖"
            label={t('readingSettings.title')}
            onPress={() => router.push('/settings/reading-preferences')}
            isLast
          />
        </SettingSection>


        {/* Language */}
        <SettingSection title={t('settings.language')}>
          <SettingRow
            type="navigation"
            icon="🌍"
            label={t('settings.primaryLanguage')}
            value={LANGUAGE_LABELS[language]}
            onPress={() => router.push('/settings/language')}
            isLast
          />
        </SettingSection>

        {/* Notifications */}
        <SettingSection title={t('settings.notifications')}>
          <SettingRow
            type="navigation"
            icon="🔔"
            label={t('settings.dailyReminder')}
            value={notificationsEnabled ? reminderTime : (language === 'ar' ? 'متوقف' : 'Off')}
            onPress={() => router.push('/settings/notifications')}
            isLast
          />
        </SettingSection>

        {/* About */}
        <SettingSection title={t('settings.about')}>
          <Pressable onPress={handleVersionTap}>
            <SettingRow
              type="static"
              icon="📱"
              label={t('settings.version')}
              value={APP_VERSION}
            />
          </Pressable>
          <SettingRow
            type="navigation"
            icon="⭐"
            label={t('settings.rateUs')}
            onPress={handleRateUs}
            isLast={!showDevMode}
          />
        </SettingSection>

        {/* Dev Mode Section - Only visible in dev mode or after tapping version 5 times */}
        {showDevMode && (
          <SettingSection title="🛠️ Developer Mode">
            <Pressable
              onPress={handleResetOnboarding}
              style={({ pressed }) => [
                styles.devButton,
                { backgroundColor: colors.accentLight },
                pressed && styles.devButtonPressed,
              ]}
            >
              <Text style={styles.devButtonIcon}>🔄</Text>
              <View style={[styles.devButtonContent, { alignItems: rtl.alignStart }]}>
                <Text style={[styles.devButtonLabel, { color: colors.text, textAlign: rtl.textAlign }]}>
                  Reset Onboarding
                </Text>
                <Text style={[styles.devButtonSublabel, { color: colors.textSecondary, textAlign: rtl.textAlign }]}>
                  Go back to the welcome screen
                </Text>
              </View>
            </Pressable>

            <Pressable
              onPress={handleResetAllData}
              style={({ pressed }) => [
                styles.devButton,
                styles.devButtonDanger,
                { backgroundColor: 'rgba(196, 92, 92, 0.1)' },
                pressed && styles.devButtonPressed,
              ]}
            >
              <Text style={styles.devButtonIcon}>⚠️</Text>
              <View style={[styles.devButtonContent, { alignItems: rtl.alignStart }]}>
                <Text style={[styles.devButtonLabel, { color: colors.error, textAlign: rtl.textAlign }]}>
                  Reset All Data
                </Text>
                <Text style={[styles.devButtonSublabel, { color: colors.textSecondary, textAlign: rtl.textAlign }]}>
                  Clear everything and start fresh
                </Text>
              </View>
            </Pressable>
          </SettingSection>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.textTertiary }]}>
            {t('settings.madeWithLove')}
          </Text>
          <Text style={[styles.footerArabic, { color: colors.primary }]}>
            جزاكم الله خيرا
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
  divider: {
    height: 0.5,
    marginHorizontal: Spacing.lg,
  },
  footer: {
    alignItems: 'center',
    marginTop: Spacing.xl,
    paddingTop: Spacing.lg,
  },
  footerText: {
    ...TextStyles.bodySmall,
    marginBottom: Spacing.xs,
  },
  footerArabic: {
    ...TextStyles.arabicSmall,
  },
  // Dev mode styles
  devButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: Radius.md,
    marginBottom: Spacing.sm,
  },
  devButtonPressed: {
    opacity: 0.7,
  },
  devButtonDanger: {
    marginBottom: 0,
  },
  devButtonIcon: {
    fontSize: 24,
    marginRight: Spacing.md,
  },
  devButtonContent: {
    flex: 1,
  },
  devButtonLabel: {
    ...TextStyles.labelMedium,
    marginBottom: 2,
  },
  devButtonSublabel: {
    ...TextStyles.bodySmall,
  },
});
