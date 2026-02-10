/**
 * User Store
 * Manages user preferences, settings, and onboarding state
 */

import { I18nManager } from 'react-native';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from '@/i18n';
import { scheduleReloadForRTL } from '@/utils/reload-app';

// Types
export type Language = 'en' | 'ar';
export type ThemeMode = 'light' | 'dark' | 'auto';
export type FontSize = 'small' | 'medium' | 'large' | 'xlarge';
export type TextColor = 'black' | 'darkGray' | 'brown' | 'blue';
export type BackgroundColor = 'white' | 'beige' | 'cream' | 'dark';
export type LineSpacing = 'tight' | 'normal' | 'wide';

interface UserSettings {
  // Language
  language: Language;

  // Appearance
  fontSize: FontSize;
  theme: ThemeMode;
  
  // Reading Experience
  textColor: TextColor;
  backgroundColor: BackgroundColor;
  lineSpacing: LineSpacing;

  // Notifications
  notificationsEnabled: boolean;
  reminderTime: string; // "HH:MM" format

  // Onboarding
  hasCompletedOnboarding: boolean;
  /** True after user has seen the language screen this onboarding run; used to show welcome after language */
  onboardingSawLanguageScreen: boolean;

  // App rating: last time we requested review (ISO string), to re-prompt every 7 days
  lastRatingRequestDate: string | null;
}

interface UserStore extends UserSettings {
  // Language actions
  setLanguage: (language: Language) => void;

  // Appearance actions
  setFontSize: (size: FontSize) => void;
  setTheme: (theme: ThemeMode) => void;
  
  // Reading Experience actions
  setTextColor: (color: TextColor) => void;
  setBackgroundColor: (color: BackgroundColor) => void;
  setLineSpacing: (spacing: LineSpacing) => void;

  // Notification actions
  setNotificationsEnabled: (enabled: boolean) => void;
  setReminderTime: (time: string) => void;

  // Onboarding actions
  completeOnboarding: () => void;
  resetOnboarding: () => void; // For testing
  setOnboardingSawLanguageScreen: (value: boolean) => void;

  // Rating: record that we requested review (so we don’t prompt again for 7 days)
  setLastRatingRequestDate: (date: string | null) => void;

  // Reset all settings
  resetSettings: () => void;
}

const DEFAULT_SETTINGS: UserSettings = {
  language: 'ar', // Onboarding starts with Arabic selected; user can change
  fontSize: 'medium',
  theme: 'auto',
  textColor: 'black',
  backgroundColor: 'white',
  lineSpacing: 'normal',
  notificationsEnabled: false,
  reminderTime: '08:00',
  hasCompletedOnboarding: false,
  onboardingSawLanguageScreen: false,
  lastRatingRequestDate: null,
};

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      // Default values
      ...DEFAULT_SETTINGS,

      // Language actions
      setLanguage: (language) => set({ language }),

      // Appearance actions
      setFontSize: (fontSize) => set({ fontSize }),
      setTheme: (theme) => set({ theme }),
      
      // Reading Experience actions
      setTextColor: (textColor) => set({ textColor }),
      setBackgroundColor: (backgroundColor) => set({ backgroundColor }),
      setLineSpacing: (lineSpacing) => set({ lineSpacing }),

      // Notification actions
      setNotificationsEnabled: (notificationsEnabled) => set({ notificationsEnabled }),
      setReminderTime: (reminderTime) => set({ reminderTime }),

      // Onboarding actions
      completeOnboarding: () => set({ hasCompletedOnboarding: true }),
      resetOnboarding: () => set({ hasCompletedOnboarding: false, onboardingSawLanguageScreen: false }),
      setOnboardingSawLanguageScreen: (onboardingSawLanguageScreen) => set({ onboardingSawLanguageScreen }),

      // Rating
      setLastRatingRequestDate: (lastRatingRequestDate) => set({ lastRatingRequestDate }),

      // Reset all settings
      resetSettings: () => set(DEFAULT_SETTINGS),
    }),
    {
      name: 'qasas-user-storage',
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state, err) => {
        if (err) console.error('User store rehydration failed:', err);
        // Apply RTL and locale before first paint so layout is correct after reload.
        // Native forceRTL is inverted on some RN/Expo versions: we pass true for English (LTR) and false for Arabic (RTL).
        const lang = state?.language ?? DEFAULT_SETTINGS.language;
        const nativeRTL = lang === 'en'; // inverted so Arabic gets RTL layout and English gets LTR
        const wasRTL = I18nManager.isRTL;
        if (wasRTL !== nativeRTL) {
          I18nManager.forceRTL(nativeRTL);
          I18nManager.allowRTL(nativeRTL);
          // RTL only takes effect after app reload on React Native; trigger once so layout applies
          scheduleReloadForRTL();
        }
        i18n.locale = lang;
        rehydrationResolve?.();
      },
    }
  )
);

// Resolved when persisted state has been loaded (so we can show onboarding vs home correctly on fresh install)
let rehydrationResolve: (() => void) | null = null;
export const userStoreRehydrationPromise = new Promise<void>((resolve) => {
  rehydrationResolve = resolve;
});

// Selector hooks for performance
export const useLanguage = () => useUserStore((state) => state.language);
export const useThemeMode = () => useUserStore((state) => state.theme);
export const useFontSize = () => useUserStore((state) => state.fontSize);
