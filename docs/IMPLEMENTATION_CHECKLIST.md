# Qasas v2.0 - Implementation Checklist

## 🚀 Quick Start Commands

```bash
# Install new dependencies
npm install i18n-js expo-notifications expo-localization react-native-date-picker

# Run the app
npm run ios
```

---

## Phase 1: Core Settings (Week 1)

### 1.1 Create User Store
- [ ] Create `store/user-store.ts`
- [ ] Define `UserSettings` interface
- [ ] Implement Zustand store with persistence
- [ ] Add actions: `setLanguage`, `setFontSize`, `setTheme`, `setNotifications`

```typescript
// store/user-store.ts skeleton
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface UserSettings {
  language: 'en' | 'ar';
  showArabicText: boolean;
  fontSize: 'small' | 'medium' | 'large' | 'xlarge';
  theme: 'light' | 'dark' | 'auto';
  hasCompletedOnboarding: boolean;
  notificationsEnabled: boolean;
  reminderTime: string;
}

interface UserStore extends UserSettings {
  setLanguage: (lang: 'en' | 'ar') => void;
  setFontSize: (size: UserSettings['fontSize']) => void;
  setTheme: (theme: UserSettings['theme']) => void;
  setNotificationsEnabled: (enabled: boolean) => void;
  setReminderTime: (time: string) => void;
  completeOnboarding: () => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      // Defaults
      language: 'en',
      showArabicText: true,
      fontSize: 'medium',
      theme: 'auto',
      hasCompletedOnboarding: false,
      notificationsEnabled: false,
      reminderTime: '08:00',

      // Actions
      setLanguage: (language) => set({ language }),
      setFontSize: (fontSize) => set({ fontSize }),
      setTheme: (theme) => set({ theme }),
      setNotificationsEnabled: (notificationsEnabled) => set({ notificationsEnabled }),
      setReminderTime: (reminderTime) => set({ reminderTime }),
      completeOnboarding: () => set({ hasCompletedOnboarding: true }),
    }),
    {
      name: 'qasas-user-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
```

### 1.2 Settings Screen
- [ ] Create `app/(tabs)/settings.tsx`
- [ ] Add settings tab to `app/(tabs)/_layout.tsx`
- [ ] Create `components/settings/setting-row.tsx`
- [ ] Create `components/settings/setting-section.tsx`
- [ ] Wire up font size selector
- [ ] Wire up theme selector
- [ ] Add language navigation link
- [ ] Add notifications navigation link

### 1.3 Settings Sub-screens
- [ ] Create `app/settings/_layout.tsx`
- [ ] Create `app/settings/language.tsx`
- [ ] Create `app/settings/notifications.tsx`
- [ ] Create `app/settings/about.tsx`

### 1.4 Manual Chapter Completion
- [ ] Add `finishSessionEarly` action to `reading-store.ts`
- [ ] Add "Finish Reading" button to reading screen
- [ ] Show button after 30 seconds of reading
- [ ] Create confirmation modal component
- [ ] Update reflection flow to handle early finish

---

## Phase 2: Onboarding (Week 2)

### 2.1 Onboarding Screens
- [ ] Create `app/onboarding/_layout.tsx`
- [ ] Create `app/onboarding/index.tsx` (Welcome)
- [ ] Create `app/onboarding/language.tsx`
- [ ] Create `app/onboarding/preferences.tsx`
- [ ] Create `app/onboarding/notifications.tsx`
- [ ] Create `app/onboarding/bismillah.tsx`

### 2.2 Onboarding Navigation
- [ ] Update `app/_layout.tsx` to check `hasCompletedOnboarding`
- [ ] Redirect to onboarding if not completed
- [ ] Handle back navigation properly

### 2.3 Notification Setup
- [ ] Request notification permissions
- [ ] Schedule daily reminder notification
- [ ] Handle notification tap to open app
- [ ] Add notification utility functions

```typescript
// utils/notifications.ts skeleton
import * as Notifications from 'expo-notifications';

export async function requestNotificationPermissions() {
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

export async function scheduleDailyReminder(time: string) {
  // Parse time "HH:MM"
  const [hours, minutes] = time.split(':').map(Number);
  
  await Notifications.cancelAllScheduledNotificationsAsync();
  
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Time for Today\'s Story 📖',
      body: 'Continue your journey through the stories of the prophets',
    },
    trigger: {
      hour: hours,
      minute: minutes,
      repeats: true,
    },
  });
}

export async function cancelAllReminders() {
  await Notifications.cancelAllScheduledNotificationsAsync();
}
```

---

## Phase 3: Internationalization (Week 3)

### 3.1 i18n Setup
- [ ] Create `i18n/index.ts`
- [ ] Create `i18n/en.ts` (English translations)
- [ ] Create `i18n/ar.ts` (Arabic translations)
- [ ] Create `hooks/use-translation.ts`

```typescript
// i18n/index.ts skeleton
import { I18n } from 'i18n-js';
import en from './en';
import ar from './ar';

const i18n = new I18n({ en, ar });
i18n.defaultLocale = 'en';
i18n.enableFallback = true;

export default i18n;

// hooks/use-translation.ts
import { useUserStore } from '@/store/user-store';
import i18n from '@/i18n';

export function useTranslation() {
  const { language } = useUserStore();
  i18n.locale = language;
  
  return {
    t: (key: string, options?: object) => i18n.t(key, options),
    language,
    isRTL: language === 'ar',
  };
}
```

### 3.2 Translation Keys Structure
```typescript
// i18n/en.ts
export default {
  common: {
    continue: 'Continue',
    back: 'Back',
    cancel: 'Cancel',
    save: 'Save',
  },
  home: {
    greeting: 'Assalamu Alaikum',
    goodMorning: 'Good morning',
    goodAfternoon: 'Good afternoon',
    goodEvening: 'Good evening',
    continueReading: 'Continue Today\'s Story',
    chooseAProphet: 'Choose a Prophet',
    quote: '"Indeed, in their stories, there is a lesson for those of understanding."',
    quoteSource: '— Surah Yusuf, Verse 111',
  },
  prophets: {
    title: 'Prophets',
    chapters: '{{count}} chapters',
    chaptersOne: '1 chapter',
  },
  reading: {
    prepareToRead: 'Prepare to Read',
    setIntention: 'Set Your Intention',
    intentionQuestion: 'What do you hope to gain from today\'s reading?',
    readingDuration: 'Reading Duration',
    fontSize: 'Font Size',
    beginReading: 'Begin Reading',
    finishReading: 'Finish Reading',
    finishEarlyTitle: 'Ready to reflect?',
    finishEarlyMessage: 'You still have {{time}} remaining, but you can move to reflection now.',
    continueToReflection: 'Continue to Reflection',
    keepReading: 'Keep Reading',
  },
  reflection: {
    title: 'Time for Reflection',
    subtitle: 'Let the wisdom settle in your heart',
    reflectionQuestion: 'Reflection Question',
    yourThoughts: 'Your Thoughts (Optional)',
    placeholder: 'Write down any thoughts or reflections...',
    sessionComplete: 'Session Complete',
    unlockMessage: 'This chapter will be available again tomorrow. Take time to let today\'s lesson resonate.',
    complete: 'Complete & Return Home',
    jazakAllah: 'May Allah reward you with goodness',
  },
  intentions: {
    learning: 'Learning',
    patience: 'Patience',
    faith: 'Faith',
    gratitude: 'Gratitude',
  },
  settings: {
    title: 'Settings',
    readingPreferences: 'Reading Preferences',
    fontSize: 'Font Size',
    theme: 'Theme',
    themeLight: 'Light',
    themeDark: 'Dark',
    themeAuto: 'Auto',
    language: 'Language',
    primaryLanguage: 'Primary Language',
    showArabicText: 'Show Arabic text',
    notifications: 'Notifications',
    dailyReminder: 'Daily Reminder',
    reminderTime: 'Reminder Time',
    about: 'About',
    version: 'Version',
    privacyPolicy: 'Privacy Policy',
    termsOfService: 'Terms of Service',
  },
  onboarding: {
    welcome: 'Stories of the Prophets',
    tagline: 'A journey of wisdom, one story at a time',
    getStarted: 'Get Started',
    chooseLanguage: 'Choose Language',
    languageNote: 'Arabic text will always appear alongside your chosen language',
    readingPreferences: 'How do you prefer to read?',
    preview: 'Preview',
    dailyReminder: 'Daily Reading Reminder',
    reminderDescription: 'We can gently remind you to continue your journey each day.',
    reminderNote: 'No pressure. No streaks. Just a soft nudge.',
    enableReminders: 'Enable Reminders',
    skipForNow: 'Skip for now',
    bismillah: 'In the name of Allah, the Most Gracious, the Most Merciful',
    beginJourney: 'Begin Your Journey',
  },
  progress: {
    title: 'Your Progress',
    readingSessions: 'Reading Sessions',
    chaptersRead: 'Chapters Read',
    prophetsExplored: 'Prophets Explored',
    totalProphets: 'Total Prophets',
    readingJourney: 'Reading Journey',
    chaptersProgress: '{{completed}} of {{total}} chapters',
    wayOfPatience: 'The Way of Patience',
    patienceMessage: 'True learning comes not from rushing through pages, but from allowing each story to settle in your heart. Take your time — the prophets\' wisdom has waited centuries for you.',
    emptyState: 'Begin your journey through the stories of the prophets',
  },
  locked: {
    title: 'Time for Reflection',
    message: 'Continue tomorrow 🤍',
    unlocksIn: 'Unlocks in {{time}}',
  },
};
```

### 3.3 Update All Screens
- [ ] Update `app/(tabs)/index.tsx`
- [ ] Update `app/(tabs)/explore.tsx`
- [ ] Update `app/prophets.tsx`
- [ ] Update `app/chapters/[prophetId].tsx`
- [ ] Update `app/reading-setup/[chapterId].tsx`
- [ ] Update `app/reading/[chapterId].tsx`
- [ ] Update `app/reflection/[chapterId].tsx`
- [ ] Update all components

### 3.4 RTL Support
- [ ] Add RTL layout handling for Arabic
- [ ] Test all screens in RTL mode
- [ ] Fix any layout issues

---

## Phase 4: UX Polish (Week 4)

### 4.1 Animations
- [ ] Add page turn animation to reading pager
- [ ] Add card press animations
- [ ] Add staggered list animations
- [ ] Add fade transitions between screens

### 4.2 Loading States
- [ ] Create `components/ui/skeleton.tsx`
- [ ] Add skeleton for prophet cards
- [ ] Add skeleton for chapter items
- [ ] Add loading state to buttons

### 4.3 Empty States
- [ ] Create empty state for no chapters started
- [ ] Create empty state for all chapters locked
- [ ] Style empty states with illustrations

### 4.4 Haptics
- [ ] Create `utils/haptics.ts` utility
- [ ] Standardize haptic feedback across app
- [ ] Add page flip haptic
- [ ] Add completion celebration haptic

### 4.5 Accessibility
- [ ] Add screen reader announcements
- [ ] Test with VoiceOver
- [ ] Ensure proper focus order
- [ ] Add accessibility labels where missing
- [ ] Test high contrast mode

### 4.6 Visual Polish
- [ ] Add subtle background patterns
- [ ] Refine shadows and depth
- [ ] Polish dark mode colors
- [ ] Ensure consistent spacing

---

## Testing Checklist

### Functional Tests
- [ ] Onboarding completes correctly
- [ ] Language switching works
- [ ] Font size changes apply everywhere
- [ ] Theme switching works
- [ ] Manual chapter completion works
- [ ] Notifications schedule correctly
- [ ] Chapter locking still works
- [ ] Progress tracking accurate

### Device Tests
- [ ] iPhone SE (small screen)
- [ ] iPhone 15 Pro (standard)
- [ ] iPhone 15 Pro Max (large)
- [ ] iPad (if supporting)

### Accessibility Tests
- [ ] VoiceOver navigation
- [ ] Dynamic Type sizes
- [ ] Reduce Motion respected
- [ ] High Contrast mode

---

## Launch Checklist

- [ ] All translations complete and reviewed
- [ ] All animations smooth (60fps)
- [ ] No console warnings
- [ ] TypeScript strict mode passes
- [ ] ESLint passes
- [ ] Tested on physical devices
- [ ] App Store screenshots updated
- [ ] Version number updated in `app.json`

---

*Ready to build! بسم الله*
