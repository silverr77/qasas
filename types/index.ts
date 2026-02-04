/**
 * Core data types for the Qasas app
 * Islamic stories reading application
 */

// Story categories
export type StoryCategory = 'prophets' | 'sahabah' | 'educational';

// Story data model (replaces Prophet, works for all categories)
export interface Story {
  id: string;
  category: StoryCategory;
  nameAr: string;
  nameEn: string;
  shortDescriptionAr: string;
  shortDescriptionEn: string;
  // Legacy field - use shortDescriptionEn/Ar instead
  shortDescription?: string;
  illustration: string; // Asset path or emoji for MVP
}

// Legacy type alias for backward compatibility during migration
export type Prophet = Story;

// Story chapter belonging to a story
export interface StoryChapter {
  id: string;
  storyId: string; // Changed from prophetId
  category: StoryCategory; // Added for filtering
  titleAr: string;
  titleEn: string;
  title?: string; // Legacy field - use titleEn/Ar instead
  content: string;
  contentAr?: string; // Arabic version; when set and app language is ar, this is shown
  estimatedReadingTime: number; // in minutes
  reflectionPrompt: string;
  relatedAyahOrQuote: string;
  chapterNumber: number; // Order within story (1-indexed)
}

// Reading session duration options
export type ReadingDuration = 3 | 5 | 10;

// Reading intention options
export type ReadingIntention = 'learning' | 'patience' | 'faith' | 'gratitude';

// Reading session tracking
export interface ReadingSession {
  id: string;
  chapterId: string;
  selectedDuration: ReadingDuration;
  startTime: string; // ISO date string
  endTime?: string; // ISO date string
  isCompleted: boolean;
  lockedUntil?: string; // ISO date string
  currentPage: number;
  totalPages: number;
  intention?: ReadingIntention;
  notes?: string;
}

// Reading progress for a chapter
export interface ChapterProgress {
  chapterId: string;
  lastReadPage: number;
  totalPages: number;
  isLocked: boolean;
  lockedUntil?: string;
  completedSessions: number;
}

// App-wide reading preferences
export interface ReadingPreferences {
  fontSize: 'small' | 'medium' | 'large' | 'xlarge';
  textColor: 'black' | 'darkGray' | 'brown' | 'blue';
  backgroundColor: 'white' | 'beige' | 'cream' | 'dark';
  lineSpacing: 'tight' | 'normal' | 'wide';
  lastReadChapterId?: string;
  lastReadStoryId?: string; // Changed from lastReadProphetId
  // Legacy support
  lastReadProphetId?: string;
}

// Chapter unlock information
export interface ChapterUnlock {
  chapterId: string;
  storyId: string;
  category: StoryCategory;
  unlockMethod: 'free' | 'ad' | 'wait';
  unlockedAt?: string; // ISO date string
  lockedUntil?: string; // ISO date string (for wait-based unlocks)
  adWatched?: boolean;
}

// Story progress tracking
export interface StoryProgress {
  storyId: string;
  category: StoryCategory;
  chaptersUnlocked: number; // Always at least 2
  lastUnlockMethod: 'free' | 'ad' | 'wait';
  nextUnlockTime?: string; // ISO date string
}

// Font size mappings
export const FONT_SIZES = {
  small: 16,
  medium: 18,
  large: 22,
  xlarge: 26,
} as const;

// Reading duration labels
export const DURATION_LABELS: Record<ReadingDuration, string> = {
  3: '3 minutes',
  5: '5 minutes',
  10: '10 minutes',
};

// Intention display text
export const INTENTION_LABELS: Record<ReadingIntention, { en: string; ar: string }> = {
  learning: { en: 'Learning', ar: 'التعلم' },
  patience: { en: 'Patience', ar: 'الصبر' },
  faith: { en: 'Faith', ar: 'الإيمان' },
  gratitude: { en: 'Gratitude', ar: 'الشكر' },
};
