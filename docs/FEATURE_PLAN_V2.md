# Qasas v2.0 Feature Plan

## ✅ Implementation Status: COMPLETE

All features in this plan have been implemented.

## Overview

This document outlines the next phase of features for Qasas, focusing on personalization, accessibility, and UX polish.

---

## ✅ Feature 1: Onboarding Flow (IMPLEMENTED)

### Purpose
First-time users should have a warm, welcoming experience that sets the right tone and allows them to personalize their experience from the start.

### Screens

#### 1.1 Welcome Screen
```
┌─────────────────────────────┐
│                             │
│           🌙                │
│                             │
│      قصص الأنبياء            │
│   Stories of the Prophets   │
│                             │
│    "A journey of wisdom,    │
│     one story at a time"    │
│                             │
│     [ Get Started ]         │
│                             │
└─────────────────────────────┘
```

#### 1.2 Language Selection Screen
```
┌─────────────────────────────┐
│        Choose Language      │
│         اختر اللغة          │
│                             │
│  ┌───────────────────────┐  │
│  │   🇬🇧  English         │  │
│  │   Primary language    │  │
│  └───────────────────────┘  │
│                             │
│  ┌───────────────────────┐  │
│  │   🇸🇦  العربية          │  │
│  │   اللغة الرئيسية        │  │
│  └───────────────────────┘  │
│                             │
│  ℹ️ Arabic text will always │
│     appear alongside your   │
│     chosen language         │
│                             │
│        [ Continue ]         │
└─────────────────────────────┘
```

#### 1.3 Reading Preference Screen
```
┌─────────────────────────────┐
│     How do you prefer       │
│       to read?              │
│                             │
│  Font Size:                 │
│  [ A ][ A ][ A ][ A ]       │
│   sm   md   lg   xl         │
│                             │
│  Preview:                   │
│  ┌───────────────────────┐  │
│  │ In the land of Canaan,│  │
│  │ there lived a young   │  │
│  │ boy named Yusuf...    │  │
│  └───────────────────────┘  │
│                             │
│        [ Continue ]         │
└─────────────────────────────┘
```

#### 1.4 Notification Permission Screen
```
┌─────────────────────────────┐
│         🔔                  │
│                             │
│    Daily Reading Reminder   │
│                             │
│  We can gently remind you   │
│  to continue your journey   │
│  each day.                  │
│                             │
│  No pressure. No streaks.   │
│  Just a soft nudge.         │
│                             │
│    [ Enable Reminders ]     │
│                             │
│       Skip for now          │
└─────────────────────────────┘
```

#### 1.5 Bismillah Screen (Final)
```
┌─────────────────────────────┐
│                             │
│                             │
│   بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ │
│                             │
│  In the name of Allah,      │
│  the Most Gracious,         │
│  the Most Merciful          │
│                             │
│                             │
│   [ Begin Your Journey ]    │
│                             │
└─────────────────────────────┘
```

### Implementation

#### Files to Create
```
app/
├── onboarding/
│   ├── _layout.tsx          # Onboarding stack navigator
│   ├── index.tsx            # Welcome screen
│   ├── language.tsx         # Language selection
│   ├── preferences.tsx      # Font size preview
│   ├── notifications.tsx    # Notification permission
│   └── bismillah.tsx        # Final screen before home
```

#### Store Updates
```typescript
// store/user-store.ts
interface UserSettings {
  language: 'en' | 'ar';
  hasCompletedOnboarding: boolean;
  fontSize: 'small' | 'medium' | 'large' | 'xlarge';
  notificationsEnabled: boolean;
  reminderTime?: string; // "08:00" format
}
```

#### Dependencies
```bash
npm install expo-notifications
```

#### Routing Logic
```typescript
// app/_layout.tsx
// Check if onboarding is complete
const { hasCompletedOnboarding } = useUserStore();

if (!hasCompletedOnboarding) {
  return <Redirect href="/onboarding" />;
}
```

---

## ✅ Feature 2: Profile & Settings (IMPLEMENTED)

### Purpose
Give users control over their reading experience and app preferences.

### Screen Design

#### 2.1 Profile Tab (Replace or add to tabs)
```
┌─────────────────────────────┐
│          الإعدادات           │
│          Settings           │
│─────────────────────────────│
│                             │
│  ┌─ Reading Preferences ──┐ │
│  │                        │ │
│  │  Font Size             │ │
│  │  [ A ][ A ][ A ][ A ]  │ │
│  │                        │ │
│  │  Theme                 │ │
│  │  ○ Light  ○ Dark  ○ Auto│ │
│  │                        │ │
│  └────────────────────────┘ │
│                             │
│  ┌─ Language ─────────────┐ │
│  │                        │ │
│  │  Primary Language   >  │ │
│  │  English               │ │
│  │                        │ │
│  │  ☑ Show Arabic text    │ │
│  │                        │ │
│  └────────────────────────┘ │
│                             │
│  ┌─ Notifications ────────┐ │
│  │                        │ │
│  │  Daily Reminder   [ON] │ │
│  │                        │ │
│  │  Reminder Time      >  │ │
│  │  8:00 AM               │ │
│  │                        │ │
│  └────────────────────────┘ │
│                             │
│  ┌─ About ────────────────┐ │
│  │  Version 1.0.0         │ │
│  │  Privacy Policy     >  │ │
│  │  Terms of Service   >  │ │
│  └────────────────────────┘ │
│                             │
└─────────────────────────────┘
```

### Implementation

#### Files to Create
```
app/
├── (tabs)/
│   └── settings.tsx         # Settings tab
├── settings/
│   ├── language.tsx         # Language picker
│   ├── notifications.tsx    # Notification settings
│   └── about.tsx            # About page
components/
├── settings/
│   ├── setting-row.tsx      # Reusable row component
│   ├── setting-section.tsx  # Section wrapper
│   └── time-picker.tsx      # Reminder time picker
```

#### Store Schema
```typescript
// store/user-store.ts
interface UserStore {
  // Settings
  settings: {
    language: 'en' | 'ar';
    showArabicText: boolean;
    fontSize: 'small' | 'medium' | 'large' | 'xlarge';
    theme: 'light' | 'dark' | 'auto';
    notificationsEnabled: boolean;
    reminderTime: string;
  };
  
  // Actions
  setLanguage: (lang: 'en' | 'ar') => void;
  setFontSize: (size: FontSize) => void;
  setTheme: (theme: ThemeMode) => void;
  setNotificationSettings: (enabled: boolean, time?: string) => void;
}
```

#### i18n Setup
```typescript
// i18n/index.ts
import { I18n } from 'i18n-js';

const i18n = new I18n({
  en: {
    greeting: 'Assalamu Alaikum',
    chooseAProphet: 'Choose a Prophet',
    continueReading: 'Continue Reading',
    // ... more translations
  },
  ar: {
    greeting: 'السلام عليكم',
    chooseAProphet: 'اختر نبياً',
    continueReading: 'متابعة القراءة',
    // ... more translations
  },
});

export default i18n;
```

---

## ✅ Feature 3: Manual Chapter Completion (IMPLEMENTED)

### Purpose
Allow users to mark a chapter as complete even if the timer hasn't finished, respecting their reading pace.

### UX Flow

#### Current Behavior
- User must wait for timer to end
- Then sees reflection screen
- Chapter locks for 24 hours

#### New Behavior
- User can tap "Finish Early" button
- Shows confirmation with gentle message
- Proceeds to reflection screen
- Chapter still locks for 24 hours

### Screen Updates

#### Reading Screen - Add "Finish Early" Option
```
┌─────────────────────────────┐
│  ✕         3:42         🔤  │
│─────────────────────────────│
│                             │
│  [Story content...]         │
│                             │
│                             │
│─────────────────────────────│
│       ● ● ○ ○ ○ ○           │
│                             │
│     [ Finish Reading ]      │  ← New button (appears after 30s)
│                             │
└─────────────────────────────┘
```

#### Finish Early Confirmation Modal
```
┌─────────────────────────────┐
│                             │
│           📖                │
│                             │
│   Ready to reflect?         │
│                             │
│   You still have 2:15       │
│   remaining, but you can    │
│   move to reflection now.   │
│                             │
│   ┌───────────────────────┐ │
│   │  Continue to Reflection │ │
│   └───────────────────────┘ │
│                             │
│       Keep Reading          │
│                             │
└─────────────────────────────┘
```

### Implementation

#### Store Updates
```typescript
// store/reading-store.ts
interface ReadingSession {
  // ... existing fields
  finishedEarly: boolean;        // Track if user finished before timer
  actualReadingTime: number;     // Actual seconds read
}

interface ReadingState {
  // ... existing
  finishSessionEarly: () => void;  // New action
}
```

#### Component Updates
```typescript
// app/reading/[chapterId].tsx
// Add state for showing finish button
const [showFinishButton, setShowFinishButton] = useState(false);

// Show button after minimum reading time (30 seconds)
useEffect(() => {
  const timer = setTimeout(() => {
    setShowFinishButton(true);
  }, 30000);
  return () => clearTimeout(timer);
}, []);
```

---

## ✅ Feature 4: UX/UI Improvements (IMPLEMENTED)

### 4.1 Micro-Animations

#### Page Turn Animation
```typescript
// components/reading-pager.tsx
// Add spring animation for page turns
const pageAnimation = useAnimatedStyle(() => ({
  transform: [
    { perspective: 1000 },
    { rotateY: withSpring(`${rotation.value}deg`) },
  ],
}));
```

#### Card Press Feedback
```typescript
// Enhance all cards with subtle scale + shadow animation
const animatedStyle = useAnimatedStyle(() => ({
  transform: [{ scale: withSpring(pressed ? 0.98 : 1) }],
  shadowOpacity: withTiming(pressed ? 0.15 : 0.08),
}));
```

#### Progress Celebrations
- Subtle confetti when completing a chapter
- Gentle glow effect on completion
- Use `react-native-confetti-cannon` or custom SVG animations

### 4.2 Enhanced Visual Design

#### Gradient Backgrounds
```typescript
// Add subtle geometric patterns to backgrounds
// Islamic geometric patterns using SVG
// Overlay very subtle pattern on sand background
```

#### Reading Screen Improvements
- Add subtle paper texture to reading background
- Slightly rounded page edges
- Soft shadow at page edges for depth

#### Typography Refinements
```typescript
// constants/theme.ts
// Add more refined Arabic typography
arabicDisplay: {
  fontFamily: Platform.OS === 'ios' ? 'GeezaPro' : 'Amiri',
  fontSize: 32,
  lineHeight: 52,
}
```

### 4.3 Empty States

#### No Chapters Started
```
┌─────────────────────────────┐
│                             │
│           🌙                │
│                             │
│   Your journey awaits       │
│                             │
│   Begin reading the stories │
│   of the prophets and       │
│   discover timeless wisdom. │
│                             │
│   [ Start Reading ]         │
│                             │
└─────────────────────────────┘
```

#### All Chapters Locked
```
┌─────────────────────────────┐
│                             │
│           🌿                │
│                             │
│   Time for patience         │
│                             │
│   All your chapters are     │
│   resting. Return tomorrow  │
│   to continue your journey. │
│                             │
│   Earliest unlock: 8 hours  │
│                             │
└─────────────────────────────┘
```

### 4.4 Loading States

#### Skeleton Screens
```typescript
// components/ui/skeleton.tsx
export function ProphetCardSkeleton() {
  return (
    <View style={styles.card}>
      <SkeletonCircle size={64} />
      <View style={styles.content}>
        <SkeletonLine width="40%" height={24} />
        <SkeletonLine width="60%" height={16} />
        <SkeletonLine width="80%" height={14} />
      </View>
    </View>
  );
}
```

### 4.5 Haptic Feedback Refinement

```typescript
// utils/haptics.ts
export const Haptics = {
  light: () => Haptics.impactAsync(ImpactFeedbackStyle.Light),
  medium: () => Haptics.impactAsync(ImpactFeedbackStyle.Medium),
  success: () => Haptics.notificationAsync(NotificationFeedbackType.Success),
  warning: () => Haptics.notificationAsync(NotificationFeedbackType.Warning),
  pageFlip: () => Haptics.impactAsync(ImpactFeedbackStyle.Soft),
  selection: () => Haptics.selectionAsync(),
};
```

### 4.6 Improved Accessibility

#### Screen Reader Announcements
```typescript
// Announce progress updates
AccessibilityInfo.announceForAccessibility(
  `Reading chapter ${chapterTitle}. Page ${current} of ${total}.`
);
```

#### Focus Management
- Auto-focus on primary actions
- Proper tab order
- Clear focus indicators

#### High Contrast Mode
```typescript
// hooks/use-high-contrast.ts
export function useHighContrast() {
  const [isHighContrast, setIsHighContrast] = useState(false);
  
  useEffect(() => {
    AccessibilityInfo.isReduceTransparencyEnabled().then(setIsHighContrast);
  }, []);
  
  return isHighContrast;
}
```

---

## 📋 Implementation Priority

### Phase 1: Core Settings (Week 1)
1. Create user store with settings
2. Build settings screen
3. Implement font size persistence
4. Add manual chapter completion

### Phase 2: Onboarding (Week 2)
1. Create onboarding flow screens
2. Implement language selection
3. Add notification permission request
4. Connect to user store

### Phase 3: i18n (Week 3)
1. Set up i18n library
2. Extract all strings
3. Add Arabic translations
4. Test RTL layout

### Phase 4: UX Polish (Week 4)
1. Add micro-animations
2. Implement loading states
3. Create empty states
4. Refine haptic feedback

---

## 📦 New Dependencies

```json
{
  "dependencies": {
    "i18n-js": "^4.4.3",
    "expo-notifications": "~0.28.0",
    "expo-localization": "~15.0.0",
    "@react-native-async-storage/async-storage": "^1.21.0",
    "react-native-date-picker": "^5.0.0"
  }
}
```

---

## 📁 Final File Structure

```
qasas/
├── app/
│   ├── _layout.tsx
│   ├── onboarding/
│   │   ├── _layout.tsx
│   │   ├── index.tsx
│   │   ├── language.tsx
│   │   ├── preferences.tsx
│   │   ├── notifications.tsx
│   │   └── bismillah.tsx
│   ├── (tabs)/
│   │   ├── index.tsx
│   │   ├── explore.tsx
│   │   └── settings.tsx       # New
│   ├── settings/
│   │   ├── language.tsx       # New
│   │   ├── notifications.tsx  # New
│   │   └── about.tsx          # New
│   └── ...existing screens
├── components/
│   ├── settings/
│   │   ├── setting-row.tsx
│   │   └── setting-section.tsx
│   └── ui/
│       ├── skeleton.tsx       # New
│       └── modal.tsx          # New
├── i18n/
│   ├── index.ts
│   ├── en.ts
│   └── ar.ts
├── store/
│   ├── reading-store.ts
│   └── user-store.ts          # New
└── utils/
    └── haptics.ts             # New
```

---

## 🎨 Design Tokens to Add

```typescript
// constants/theme.ts - additions

export const Animations = {
  pageFlip: {
    duration: 300,
    easing: Easing.bezier(0.25, 0.1, 0.25, 1),
  },
  fadeIn: {
    duration: 200,
  },
  spring: {
    damping: 15,
    stiffness: 150,
  },
};

export const HighContrastColors = {
  light: {
    text: '#000000',
    background: '#FFFFFF',
    primary: '#2D5A3D',
    border: '#000000',
  },
  dark: {
    text: '#FFFFFF',
    background: '#000000',
    primary: '#7CB88F',
    border: '#FFFFFF',
  },
};
```

---

## ✅ Success Metrics

| Feature | Metric | Target |
|---------|--------|--------|
| Onboarding | Completion rate | >90% |
| Language | Arabic users | Track % |
| Manual complete | Usage rate | Track % |
| Settings | Visits | Track frequency |
| Notifications | Opt-in rate | >40% |

---

## 🙏 Notes

- Keep the spiritual, calm feeling throughout
- Never rush or pressure the user
- Arabic should feel native, not an afterthought
- Test with actual Arabic readers for authenticity
- Consider consultation with Islamic scholars for content accuracy

---

*جزاكم الله خيرا*
*May Allah reward you with goodness*
