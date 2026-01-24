# Qasas v3.0 Feature Plan

## Overview

This document outlines the next phase of features for Qasas, focusing on full internationalization, enhanced user experience, monetization strategy, and improved reading controls.

**Important Note:** Qasas includes stories from multiple categories:
- **Prophets (الأنبياء)** - Stories of the prophets mentioned in the Quran
- **Sahabah (الصحابة)** - Stories of the companions of the Prophet (peace be upon him)
- **Educational Stories** - Other good stories that teach valuable lessons

The app should accommodate all these story types seamlessly.

---

## 🎯 Feature 1: Full App Internationalization (i18n)

### Purpose
When a user selects Arabic or English as their primary language, the entire app interface should reflect that choice. Currently, only some strings are translated - we need complete language coverage.

### Current State
- ✅ Translation files exist (`i18n/en.ts`, `i18n/ar.ts`)
- ✅ `useTranslation()` hook exists
- ❌ Not all screens use translations
- ❌ RTL layout not fully implemented
- ❌ Some hardcoded English strings remain

### Implementation Scope

#### 1.1 Complete Translation Coverage
**Files to Update:**
```
app/
├── (tabs)/
│   ├── index.tsx              # Home screen
│   ├── explore.tsx             # Progress screen
│   └── settings.tsx             # Settings screen
├── stories.tsx                  # Stories list (all categories)
├── categories/[categoryId].tsx # Stories by category
├── chapters/[storyId].tsx     # Chapters list (renamed from prophetId)
├── reading-setup/[chapterId].tsx
├── reading/[chapterId].tsx
├── reflection/[chapterId].tsx
└── onboarding/                  # All onboarding screens
    ├── index.tsx
    ├── language.tsx
    ├── preferences.tsx
    ├── notifications.tsx
    └── bismillah.tsx

components/
├── story-card.tsx               # Renamed from prophet-card (works for all story types)
├── category-card.tsx            # New: Category selection card
├── chapter-item.tsx
├── reading-pager.tsx
├── progress-indicator.tsx
├── duration-selector.tsx
├── intention-selector.tsx
└── settings/                    # All settings components
```

**Translation Keys Needed:**
- All button labels
- All screen titles
- All placeholder text
- All error messages
- All empty states
- All tooltips and hints
- Category names (Prophets, Sahabah, Educational Stories)

#### 1.2 RTL (Right-to-Left) Layout Support
**Implementation:**
- Use `I18nManager.forceRTL()` when Arabic is selected
- Update all flexDirection styles to respect RTL
- Mirror icons and arrows for RTL
- Test all screens in RTL mode

**Components Requiring RTL Updates:**
- Navigation headers (back button position)
- Card layouts
- List items
- Form inputs
- Buttons with icons
- Progress indicators

#### 1.3 Language Switching Flow
**User Experience:**
1. User changes language in Settings
2. App shows confirmation: "Language changed. App will restart."
3. App reloads with new language
4. All screens reflect new language immediately

**Technical:**
- Store language preference in `user-store`
- Use `useTranslation()` hook everywhere
- Implement app restart mechanism
- Ensure state persists across language change

---

## 🎯 Feature 2: Enhanced Home Screen

### Current State Analysis
The home screen currently shows:
- Greeting (Assalamu Alaikum)
- Continue reading card (if applicable)
- "Choose a Prophet" button (needs to be more generic)
- Inspirational quote

**Note:** The app includes multiple story categories (Prophets, Sahabah, Educational Stories), so the home screen should reflect this diversity.

### Proposed UI/UX Improvements

#### 2.1 Visual Enhancements

**Option A: Card-Based Layout (Recommended)**
```
┌─────────────────────────────┐
│  [Greeting Header]          │
│  ┌───────────────────────┐  │
│  │  Continue Reading     │  │
│  │  [Chapter Card]       │  │
│  └───────────────────────┘  │
│                             │
│  ┌───────────────────────┐  │
│  │  Today's Recommendation│ │
│  │  [Story Card]          │  │
│  │  [Category Badge]      │  │
│  └───────────────────────┘  │
│                             │
│  ┌───────────────────────┐  │
│  │  Your Progress        │  │
│  │  [Mini Stats]          │  │
│  └───────────────────────┘  │
│                             │
│  ┌───────────────────────┐  │
│  │  Explore by Category   │  │
│  │  [Prophets] [Sahabah] │  │
│  │  [Educational]        │  │
│  └───────────────────────┘  │
│                             │
│  [Explore All Stories]      │
└─────────────────────────────┘
```

**Option B: Category-First Approach**
```
┌─────────────────────────────┐
│  [Hero Section]             │
│  Greeting + Illustration    │
│                             │
│  ┌──────┐ ┌──────┐ ┌──────┐│
│  │Proph.│ │Sahab.│ │Educ. ││
│  │  🌙  │ │  ⭐  │ │  📚 ││
│  │  12  │ │  8   │ │  15  ││
│  └──────┘ └──────┘ └──────┘│
│                             │
│  [Continue Reading]         │
│  [Today's Story]            │
└─────────────────────────────┘
```

**Option C: Minimalist Focus**
```
┌─────────────────────────────┐
│                             │
│        🌙                    │
│                             │
│     السلام عليكم             │
│   Assalamu Alaikum          │
│                             │
│  ┌───────────────────────┐  │
│  │                       │  │
│  │  Continue Reading     │  │
│  │  [Beautiful Card]     │  │
│  │                       │  │
│  └───────────────────────┘  │
│                             │
│  ┌───────────────────────┐  │
│  │  Recommended Today     │  │
│  │  [Story Preview]      │  │
│  │  [Category: Sahabah]   │  │
│  └───────────────────────┘  │
│                             │
│  [Explore All Stories]      │
│                             │
└─────────────────────────────┘
```

#### 2.2 New Features to Add

**A. Daily Recommendation**
- Algorithm suggests a story from any category (Prophets, Sahabah, Educational) based on:
  - User's reading history
  - Time of day
  - Completion status
  - Category diversity (rotate between categories)
  - Random selection from unread stories
- Show category badge: "Prophet", "Sahabah", or "Story"
- Display story type icon

**B. Category Quick Access**
- Three category cards on home screen:
  - Prophets (الأنبياء) - with count of available stories
  - Sahabah (الصحابة) - with count
  - Educational Stories (قصص تعليمية) - with count
- Tap to see all stories in that category
- Visual distinction between categories

**C. Quick Stats Widget**
- Mini progress indicator
- "X chapters read this week"
- "X days streak" (gentle, no pressure)
- Breakdown by category (e.g., "5 Prophet stories, 3 Sahabah stories")
- Tap to go to full Progress screen

**D. Recent Activity**
- Last 3 stories read (any category)
- Show category badge
- Quick access to continue
- Visual timeline

**E. Motivational Messages**
- Rotating quotes from Quran/Hadith
- Time-based greetings
- Encouragement based on progress
- Category-specific messages

#### 2.3 Animation & Polish
- Subtle parallax on scroll
- Smooth card transitions
- Gentle fade-in for content
- Micro-interactions on cards
- Category-specific animations

---

## 🎯 Feature 3: Chapter Unlocking System

### Purpose
Implement a freemium model where:
- First 2 chapters are always free (applies to ALL story categories)
- Additional chapters require either watching a reward ad or waiting 8 hours

### Legal & Ethical Considerations
✅ **Reward ads are legal** - Users voluntarily choose to watch
✅ **No forced ads** - Always provide free alternative (wait time)
✅ **Respectful implementation** - Ads only between chapters, never during reading
✅ **Applies uniformly** - Same rules for Prophets, Sahabah, and Educational stories

### User Flow

#### 3.1 First-Time User
```
Story: [Any Category - Prophet/Sahabah/Educational]

Chapter 1 → ✅ Free (always)
Chapter 2 → ✅ Free (unlocks after reading Chapter 1)
Chapter 3 → 🔒 Locked
  Options:
  - Watch reward ad → Unlock immediately
  - Wait 8 hours → Unlock for free
```

#### 3.2 Returning User
```
Story: [Any Category]

Chapter 1 → ✅ Read
Chapter 2 → ✅ Read
Chapter 3 → 🔒 Locked
  - Last unlocked: 2 hours ago
  - Unlocks in: 6 hours
  OR
  - Watch ad now → Unlock immediately
```

**Note:** Unlocking system applies uniformly across all story categories (Prophets, Sahabah, Educational Stories).

### Implementation Details

#### 3.1 Data Model Updates
```typescript
// types/index.ts

// Story categories
export type StoryCategory = 'prophets' | 'sahabah' | 'educational';

// Updated Story model (replaces Prophet)
export interface Story {
  id: string;
  category: StoryCategory;
  nameAr: string;
  nameEn: string;
  shortDescription: string;
  illustration: string;
}

// Updated Chapter model
export interface StoryChapter {
  id: string;
  storyId: string;        // Changed from prophetId
  category: StoryCategory; // Added for filtering
  title: string;
  content: string;
  estimatedReadingTime: number;
  reflectionPrompt: string;
  relatedAyahOrQuote: string;
  chapterNumber: number; // Order within story
}

interface ChapterUnlock {
  chapterId: string;
  storyId: string;
  category: StoryCategory;
  unlockMethod: 'free' | 'ad' | 'wait';
  unlockedAt?: string;
  lockedUntil?: string; // For wait-based unlocks
  adWatched?: boolean;
}

interface StoryProgress {
  storyId: string;
  category: StoryCategory;
  chaptersUnlocked: number; // Always at least 2
  lastUnlockMethod: 'free' | 'ad' | 'wait';
  nextUnlockTime?: string;
}
```

#### 3.2 Store Updates
```typescript
// store/unlock-store.ts
interface UnlockState {
  chapterUnlocks: Record<string, ChapterUnlock>;
  
  // Actions
  unlockChapter: (chapterId: string, method: 'ad' | 'wait') => void;
  isChapterUnlocked: (chapterId: string) => boolean;
  getUnlockMethod: (chapterId: string) => 'free' | 'ad' | 'wait' | null;
  getTimeUntilUnlock: (chapterId: string) => number; // seconds
  canWatchAd: (chapterId: string) => boolean;
  getFreeChaptersCount: (storyId: string) => number; // Always returns 2
}
```

#### 3.3 Ad Integration
**Dependencies:**
```bash
npm install react-native-google-mobile-ads
# or
npm install @react-native-admob/admob
```

**Ad Placement:**
- Only reward ads (user-initiated)
- Between chapters (not during reading)
- Clear messaging: "Watch a short ad to unlock immediately, or wait 8 hours"
- Applies to all story categories equally

**Ad Implementation:**
```typescript
// utils/ads.ts
export async function showRewardAd(): Promise<boolean> {
  // Show reward ad
  // Return true if user watched, false if skipped/error
}

export function isAdReady(): boolean {
  // Check if ad is loaded and ready
}
```

#### 3.4 UI Components

**Chapter Lock Screen:**
```
┌─────────────────────────────┐
│                             │
│           🔒                │
│                             │
│   Unlock Chapter 3          │
│   [Category Badge]          │
│                             │
│   Choose how to unlock:     │
│                             │
│   ┌───────────────────────┐│
│   │  📺 Watch Ad          ││
│   │  Unlock immediately   ││
│   └───────────────────────┘│
│                             │
│   ┌───────────────────────┐│
│   │  ⏰ Wait 8 Hours      ││
│   │  Unlocks in: 6h 23m  ││
│   └───────────────────────┘│
│                             │
│   ℹ️ First 2 chapters are   │
│      always free            │
│                             │
└─────────────────────────────┘
```

**Unlock Timer Component:**
- Visual countdown
- Progress circle
- "Unlock Now" button (watch ad)
- Clear messaging
- Category badge display

---

## 🎯 Feature 4: Reading Settings Refinement

### Purpose
Consolidate font size and text color settings to:
1. Global Settings (applies everywhere)
2. Reading Screen (quick access during reading)

### Current State
- Font size selector in reading setup screen
- No text color option
- Settings scattered

### Proposed Changes

#### 4.1 Global Settings Screen
**New Section: "Reading Experience"**
```
┌─ Reading Experience ────────┐
│                             │
│  Font Size                  │
│  [ A ][ A ][ A ][ A ]       │
│   sm   md   lg   xl         │
│                             │
│  Text Color                 │
│  ┌────┐ ┌────┐ ┌────┐       │
│  │ ⚫ │ │ ⚪ │ │ 🔵 │       │
│  │Dark│ │Light│ │Blue│      │
│  └────┘ └────┘ └────┘       │
│                             │
│  Background Color           │
│  ┌────┐ ┌────┐ ┌────┐       │
│  │ ⚪ │ │ 🟤 │ │ ⚫ │       │
│  │White│ │Beige│ │Dark│     │
│  └────┘ └────┘ └────┘       │
│                             │
│  Line Spacing               │
│  [Tight] [Normal] [Wide]    │
│                             │
└─────────────────────────────┘
```

#### 4.2 Reading Screen Quick Settings
**Floating Settings Button:**
```
┌─────────────────────────────┐
│  ✕         3:42         ⚙️  │ ← Settings icon
│─────────────────────────────│
│                             │
│  [Story content...]         │
│                             │
│                             │
│─────────────────────────────│
│       ● ● ○ ○ ○ ○           │
└─────────────────────────────┘
```

**Settings Panel (Slide-up Modal):**
```
┌─────────────────────────────┐
│  Reading Settings      [✕]  │
│─────────────────────────────│
│                             │
│  Font Size                  │
│  [ A ][ A ][ A ][ A ]       │
│                             │
│  Text Color                 │
│  [⚫] [⚪] [🔵] [🟢]        │
│                             │
│  Background                 │
│  [⚪] [🟤] [⚫]              │
│                             │
│  Line Spacing               │
│  [Tight] [Normal] [Wide]    │
│                             │
│  [Apply]                    │
└─────────────────────────────┘
```

#### 4.3 Settings Persistence
- Store in `user-store.ts`
- Apply globally across all reading screens
- Sync with reading screen quick settings
- Preview changes in real-time

#### 4.4 Remove Settings From
- ❌ Reading Setup screen (move to global settings)
- ✅ Keep in Reading screen (quick access)

---

## 🎯 Feature 5: Improved Page Navigation

### Current State
- Swipe left/right works
- Tap zones exist but not visible
- No clear indication of navigation method
- Users might not realize they can swipe

### Proposed Improvements

#### 5.1 Visual Indicators

**Option A: Page Dots with Arrows (Recommended)**
```
┌─────────────────────────────┐
│  [Story content...]          │
│                             │
│                             │
│─────────────────────────────│
│  ←  ● ● ○ ○ ○ ○  →          │ ← Arrows + dots
│  Page 2 of 7                 │
│  Swipe or tap arrows        │
└─────────────────────────────┘
```

**Option B: Edge Hints**
```
┌─────────────────────────────┐
│  ←  [Story content...]  →   │ ← Subtle arrows at edges
│                             │
│                             │
│─────────────────────────────│
│       ● ● ○ ○ ○ ○           │
└─────────────────────────────┘
```

**Option C: Swipe Indicator**
```
┌─────────────────────────────┐
│  [Story content...]          │
│                             │
│                             │
│─────────────────────────────│
│  ← Swipe to continue →      │ ← Hint text
│       ● ● ○ ○ ○ ○           │
│      Page 2 of 7             │
└─────────────────────────────┘
```

#### 5.2 Interactive Elements

**A. Visible Navigation Buttons**
- Show on first page load
- Fade out after 3 seconds
- Reappear on tap
- Positioned at screen edges
- Clear visual design (not just tap zones)
- Left arrow (previous) and right arrow (next)

**B. Swipe Gesture Indicator**
- Animated arrow on first load
- Shows swipe direction
- Disappears after user swipes once
- Can be toggled in settings

**C. Page Counter Enhancement**
- Current page / Total pages
- Progress bar
- "X pages remaining" indicator
- Visual page dots

#### 5.3 Accessibility
- Screen reader: "Swipe left for next page, swipe right for previous"
- Large tap targets for navigation buttons
- Keyboard navigation support (if applicable)
- Clear focus indicators

#### 5.4 Animation
- Smooth page transition
- Subtle bounce on page edges (when at first/last page)
- Visual feedback on swipe gesture
- Page turn animation (optional, subtle)

---

## 📋 Implementation Priority

### Phase 1: Data Model Refactoring (Week 1)
1. Update types to support multiple categories
2. Rename `Prophet` to `Story` with category field
3. Update all data files
4. Migrate existing data
5. Update store references

### Phase 2: Core i18n (Week 2)
1. Update all screens to use `useTranslation()`
2. Implement RTL layout support
3. Test language switching
4. Update all hardcoded strings
5. Add category translations

### Phase 3: Home Screen Enhancement (Week 3)
1. Design new home screen layout
2. Implement category cards
3. Add daily recommendation (all categories)
4. Add quick stats widget
5. Polish animations

### Phase 4: Unlocking System (Week 4)
1. Update data models for unlocking
2. Implement unlock store
3. Integrate ad SDK
4. Build unlock UI components
5. Test ad flow and wait timers
6. Ensure works across all categories

### Phase 5: Settings Refinement (Week 5)
1. Move font size to global settings
2. Add text color options
3. Add background color options
4. Implement reading screen quick settings
5. Remove settings from reading setup

### Phase 6: Navigation Improvements (Week 6)
1. Add visual navigation indicators
2. Implement swipe hints
3. Add navigation buttons
4. Enhance page counter
5. Test accessibility

---

## 📦 New Dependencies

```json
{
  "dependencies": {
    "react-native-google-mobile-ads": "^14.0.0",
    // or
    "@react-native-admob/admob": "^3.0.0"
  }
}
```

---

## 🎨 Design Specifications

### Story Categories

**Prophets (الأنبياء)**
- Icon: 🌙
- Color: Sage green (primary)
- Description: "Stories of the prophets from the Quran"

**Sahabah (الصحابة)**
- Icon: ⭐
- Color: Gold accent
- Description: "Stories of the companions of the Prophet (peace be upon him)"

**Educational Stories (قصص تعليمية)**
- Icon: 📚
- Color: Soft blue
- Description: "Good stories that teach valuable lessons"

### Color Options for Reading
```typescript
// Text Colors
- Black (#252521) - Default
- Dark Gray (#5C5C52) - Reduced eye strain
- Brown (#7D5533) - Warm, comfortable
- Blue (#4A7C7E) - Cool, calming

// Background Colors
- White (#FFFFFF) - Default
- Beige (#FDF9F3) - Warm, paper-like
- Cream (#FAF3E8) - Soft, gentle
- Dark (#1F1E1B) - Dark mode
```

### Line Spacing Options
```typescript
- Tight: 1.4x font size
- Normal: 1.7x font size (current)
- Wide: 2.0x font size
```

---

## 🔒 Ad Implementation Guidelines

### Best Practices
1. **User Choice**: Always provide free alternative (wait time)
2. **No Interruption**: Never show ads during reading
3. **Clear Messaging**: Explain what user gets from watching ad
4. **Respectful Timing**: Only show unlock option between chapters
5. **Privacy**: No tracking of ad viewing for analytics
6. **Equal Treatment**: Same rules for all story categories

### Ad Placement Rules
- ✅ Between chapters (unlock screen)
- ✅ User-initiated only
- ❌ Never during reading
- ❌ Never on home screen
- ❌ Never forced

### Reward Ad Flow
```
User taps "Watch Ad" 
  → Show loading state
  → Load reward ad
  → User watches ad
  → Ad completes
  → Unlock chapter immediately
  → Show success message
  → Navigate to chapter
```

---

## 📁 File Structure Changes

```
qasas/
├── app/
│   ├── (tabs)/
│   │   └── index.tsx              # Enhanced home screen
│   ├── stories.tsx                 # New: All stories (replaces prophets.tsx)
│   ├── categories/
│   │   └── [categoryId].tsx       # New: Stories by category
│   └── chapters/
│       └── [storyId].tsx          # Renamed from [prophetId].tsx
├── components/
│   ├── reading/
│   │   ├── quick-settings.tsx     # New: Reading screen settings
│   │   ├── navigation-hints.tsx  # New: Swipe indicators
│   │   ├── navigation-buttons.tsx # New: Visible nav buttons
│   │   └── page-counter.tsx      # Enhanced: Better page display
│   ├── unlock/
│   │   ├── unlock-screen.tsx     # New: Ad/wait choice
│   │   ├── unlock-timer.tsx      # New: Countdown timer
│   │   └── ad-button.tsx         # New: Watch ad button
│   ├── home/
│   │   ├── daily-recommendation.tsx  # New
│   │   ├── quick-stats.tsx          # New
│   │   ├── category-cards.tsx       # New: Category selection
│   │   └── recent-activity.tsx       # New
│   ├── story-card.tsx               # Renamed from prophet-card.tsx
│   └── category-badge.tsx           # New: Category indicator
├── data/
│   ├── stories.ts                   # Renamed from prophets.ts
│   │                                # Includes all categories
│   └── chapters.ts                  # Updated with category field
├── store/
│   └── unlock-store.ts              # New: Chapter unlocking logic
├── utils/
│   ├── ads.ts                       # New: Ad integration
│   └── unlock-timer.ts              # New: Timer utilities
└── i18n/
    ├── en.ts                        # Update: Complete translations
    └── ar.ts                        # Update: Complete translations
```

---

## 🔄 Migration Plan

### Data Migration
1. **Rename Prophet to Story**
   - Update all type definitions
   - Update all component props
   - Update all store references
   - Update all file names

2. **Add Category Field**
   - Existing prophets → category: 'prophets'
   - Add new Sahabah stories → category: 'sahabah'
   - Add new Educational stories → category: 'educational'

3. **Update Navigation**
   - Change `/prophets` → `/stories`
   - Change `/chapters/[prophetId]` → `/chapters/[storyId]`
   - Add `/categories/[categoryId]` route

4. **Update Components**
   - `ProphetCard` → `StoryCard`
   - Add category badge display
   - Update filtering logic

---

## ✅ Success Metrics

| Feature | Metric | Target |
|---------|--------|--------|
| i18n | All screens translated | 100% |
| Home Screen | User engagement | Track taps |
| Categories | Category distribution | Track reads per category |
| Unlocking | Ad watch rate | Track % |
| Settings | Usage frequency | Track changes |
| Navigation | Swipe discovery | Track first swipe time |

---

## 🚨 Important Notes

### Legal & Ethical
- ✅ Reward ads are legal and ethical when user-initiated
- ✅ Always provide free alternative (wait time)
- ✅ No forced ads
- ✅ Clear messaging about what user gets
- ✅ Equal treatment for all story categories

### User Experience
- Keep the calm, mindful feeling
- No aggressive monetization
- Respect user's time and choice
- Maintain spiritual atmosphere
- Honor all story categories equally

### Technical
- Test ad integration thoroughly
- Handle ad loading failures gracefully
- Ensure offline functionality (wait timer works offline)
- Persist unlock state properly
- Support all story categories uniformly

### Content Considerations
- Prophets: Stories from Quran
- Sahabah: Authentic stories from reliable sources
- Educational: Stories that align with Islamic values
- All content should be verified and authentic

---

## 📝 Testing Checklist

### Data Model Testing
- [ ] Story model works for all categories
- [ ] Category filtering works correctly
- [ ] Migration from Prophet to Story successful
- [ ] All existing data preserved

### i18n Testing
- [ ] All screens display correct language
- [ ] RTL layout works correctly
- [ ] Language switching doesn't break state
- [ ] All strings are translated
- [ ] Category names translated
- [ ] No hardcoded text remains

### Home Screen Testing
- [ ] Daily recommendation works (all categories)
- [ ] Category cards functional
- [ ] Quick stats accurate
- [ ] Animations smooth
- [ ] All cards clickable
- [ ] Responsive layout

### Unlocking System Testing
- [ ] First 2 chapters always free (all categories)
- [ ] Ad integration works
- [ ] Wait timer accurate
- [ ] Unlock state persists
- [ ] Offline wait timer works
- [ ] Equal rules for all categories

### Settings Testing
- [ ] Font size applies globally
- [ ] Text color changes work
- [ ] Quick settings sync with global
- [ ] Preview updates in real-time
- [ ] Settings persist correctly

### Navigation Testing
- [ ] Swipe works smoothly
- [ ] Hints are clear
- [ ] Buttons functional
- [ ] Page counter accurate
- [ ] Accessibility works

---

*جزاكم الله خيرا*
*May Allah reward you with goodness*
