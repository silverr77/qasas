/**
 * SettingsScreen
 * Main settings and preferences screen
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from '@/components/ui/safe-area-view';
import { ScreenHeader } from '@/components/ui/screen-header';
import { SettingSection } from '@/components/settings/setting-section';
import { SettingRow } from '@/components/settings/setting-row';
import { ThemeSelector } from '@/components/settings/theme-selector';
import { FontSizeSelector } from '@/components/font-size-selector';
import { Spacing, TextStyles, Radius } from '@/constants/theme';
import { useAppTheme } from '@/hooks/use-app-theme';
import { useUserStore } from '@/store/user-store';

const LANGUAGE_LABELS = {
  en: 'English',
  ar: 'العربية',
};

const APP_VERSION = '1.0.0';

export default function SettingsScreen() {
  const { colors } = useAppTheme();
  const router = useRouter();

  const {
    language,
    fontSize,
    theme,
    showArabicText,
    notificationsEnabled,
    reminderTime,
    setFontSize,
    setTheme,
    setShowArabicText,
  } = useUserStore();

  return (
    <SafeAreaView>
      <ScreenHeader
        title="Settings"
        titleAr="الإعدادات"
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Reading Preferences */}
        <SettingSection title="Reading Preferences">
          {/* Font Size */}
          <View style={styles.fontSizeContainer}>
            <FontSizeSelector
              selected={fontSize}
              onSelect={setFontSize}
            />
          </View>

          {/* Theme */}
          <View style={[styles.divider, { backgroundColor: colors.borderLight }]} />
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
          <SettingRow
            type="static"
            icon="📱"
            label="Version"
            value={APP_VERSION}
          />
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
            isLast
          />
        </SettingSection>

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
});
