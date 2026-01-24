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
import { SafeAreaView } from '@/components/ui/safe-area-view';
import { ScreenHeader } from '@/components/ui/screen-header';
import { SettingSection } from '@/components/settings/setting-section';
import { SettingRow } from '@/components/settings/setting-row';
import { ThemeSelector } from '@/components/settings/theme-selector';
import { FontSizeSelector } from '@/components/font-size-selector';
import { Spacing, TextStyles, Radius } from '@/constants/theme';
import { useAppTheme } from '@/hooks/use-app-theme';
import { useTranslation } from '@/hooks/use-translation';
import { useUserStore } from '@/store/user-store';
import { useReadingStore } from '@/store/reading-store';

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
  const router = useRouter();

  const {
    language,
    fontSize,
    theme,
    textColor,
    backgroundColor,
    lineSpacing,
    showArabicText,
    notificationsEnabled,
    reminderTime,
    setFontSize,
    setTheme,
    setTextColor,
    setBackgroundColor,
    setLineSpacing,
    setShowArabicText,
    resetOnboarding,
    resetSettings,
  } = useUserStore();

  const readingStore = useReadingStore();
  const [devTapCount, setDevTapCount] = useState(0);
  const [showDevMode, setShowDevMode] = useState(DEV_MODE);

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
        {/* Reading Experience */}
        <SettingSection title={t('readingSettings.title')}>
          {/* Font Size */}
          <View style={styles.fontSizeContainer}>
            <Text style={[styles.settingLabel, { color: colors.text }]}>
              {t('readingSettings.fontSize')}
            </Text>
            <FontSizeSelector
              selected={fontSize}
              onSelect={setFontSize}
            />
          </View>

          {/* Text Color */}
          <View style={[styles.divider, { backgroundColor: colors.borderLight }]} />
          <View style={styles.colorSection}>
            <Text style={[styles.settingLabel, { color: colors.text }]}>
              {t('readingSettings.textColor')}
            </Text>
            <View style={styles.colorOptions}>
              {[
                { value: 'black', label: t('readingSettings.colors.black'), color: '#252521' },
                { value: 'darkGray', label: t('readingSettings.colors.darkGray'), color: '#5C5C52' },
                { value: 'brown', label: t('readingSettings.colors.brown'), color: '#7D5533' },
                { value: 'blue', label: t('readingSettings.colors.blue'), color: '#4A7C7E' },
              ].map((option) => (
                <Pressable
                  key={option.value}
                  onPress={() => setTextColor(option.value as any)}
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
          <View style={[styles.divider, { backgroundColor: colors.borderLight }]} />
          <View style={styles.colorSection}>
            <Text style={[styles.settingLabel, { color: colors.text }]}>
              {t('readingSettings.backgroundColor')}
            </Text>
            <View style={styles.colorOptions}>
              {[
                { value: 'white', label: t('readingSettings.backgrounds.white'), color: '#FFFFFF' },
                { value: 'beige', label: t('readingSettings.backgrounds.beige'), color: '#FDF9F3' },
                { value: 'cream', label: t('readingSettings.backgrounds.cream'), color: '#FAF3E8' },
                { value: 'dark', label: t('readingSettings.backgrounds.dark'), color: '#1F1E1B' },
              ].map((option) => (
                <Pressable
                  key={option.value}
                  onPress={() => setBackgroundColor(option.value as any)}
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
          <View style={[styles.divider, { backgroundColor: colors.borderLight }]} />
          <View style={styles.spacingSection}>
            <Text style={[styles.settingLabel, { color: colors.text }]}>
              {t('readingSettings.lineSpacing')}
            </Text>
            <View style={styles.spacingOptions}>
              {[
                { value: 'tight', label: t('readingSettings.spacing.tight') },
                { value: 'normal', label: t('readingSettings.spacing.normal') },
                { value: 'wide', label: t('readingSettings.spacing.wide') },
              ].map((option) => (
                <Pressable
                  key={option.value}
                  onPress={() => setLineSpacing(option.value as any)}
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
        </SettingSection>

        {/* Appearance */}
        <SettingSection title={t('settings.theme')}>
          <ThemeSelector
            selected={theme}
            onSelect={setTheme}
          />
        </SettingSection>

        {/* Language */}
        <SettingSection title="Language">
          <SettingRow
            type="navigation"
            icon="🌍"
            label="Primary Language"
            value={LANGUAGE_LABELS[language]}
            onPress={() => router.push('/settings/language')}
          />
          <SettingRow
            type="toggle"
            icon="🔤"
            label="Show Arabic Text"
            sublabel="Display Arabic alongside primary language"
            value={showArabicText}
            onValueChange={setShowArabicText}
            isLast
          />
        </SettingSection>

        {/* Notifications */}
        <SettingSection title="Notifications">
          <SettingRow
            type="navigation"
            icon="🔔"
            label="Daily Reminder"
            value={notificationsEnabled ? reminderTime : 'Off'}
            onPress={() => router.push('/settings/notifications')}
            isLast
          />
        </SettingSection>

        {/* About */}
        <SettingSection title="About">
          <Pressable onPress={handleVersionTap}>
            <SettingRow
              type="static"
              icon="📱"
              label="Version"
              value={APP_VERSION}
            />
          </Pressable>
          <SettingRow
            type="navigation"
            icon="📄"
            label="Privacy Policy"
            onPress={() => router.push('/settings/about')}
          />
          <SettingRow
            type="navigation"
            icon="📋"
            label="Terms of Service"
            onPress={() => router.push('/settings/about')}
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
              <View style={styles.devButtonContent}>
                <Text style={[styles.devButtonLabel, { color: colors.text }]}>
                  Reset Onboarding
                </Text>
                <Text style={[styles.devButtonSublabel, { color: colors.textSecondary }]}>
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
              <View style={styles.devButtonContent}>
                <Text style={[styles.devButtonLabel, { color: colors.error }]}>
                  Reset All Data
                </Text>
                <Text style={[styles.devButtonSublabel, { color: colors.textSecondary }]}>
                  Clear everything and start fresh
                </Text>
              </View>
            </Pressable>
          </SettingSection>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.textTertiary }]}>
            Made with 💚 for the Ummah
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
  fontSizeContainer: {
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.md,
  },
  settingLabel: {
    ...TextStyles.labelMedium,
    marginBottom: Spacing.md,
  },
  colorSection: {
    paddingVertical: Spacing.md,
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
  spacingSection: {
    paddingVertical: Spacing.md,
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
