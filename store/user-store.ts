/**
 * User Store
 * Manages user preferences, settings, and onboarding state
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

  // Reset all settings
  resetSettings: () => void;
}

const DEFAULT_SETTINGS: UserSettings = {
  language: 'en',
  fontSize: 'medium',
  theme: 'auto',
  textColor: 'black',
  backgroundColor: 'white',
  lineSpacing: 'normal',
  notificationsEnabled: false,
  reminderTime: '08:00',
  hasCompletedOnboarding: false,
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
      resetOnboarding: () => set({ hasCompletedOnboarding: false }),

      // Reset all settings
      resetSettings: () => set(DEFAULT_SETTINGS),
    }),
    {
      name: 'qasas-user-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

// Selector hooks for performance
export const useLanguage = () => useUserStore((state) => state.language);
export const useThemeMode = () => useUserStore((state) => state.theme);
export const useFontSize = () => useUserStore((state) => state.fontSize);
