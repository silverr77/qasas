/**
 * Core data types for the Qasas app
 * Islamic stories reading application
 */

// Prophet data model
export interface Prophet {
  id: string;
  nameAr: string;
  nameEn: string;
  shortDescription: string;
  illustration: string; // Asset path or emoji for MVP
}

// Story chapter belonging to a prophet
export interface StoryChapter {
  id: string;
  prophetId: string;
  title: string;
  content: string;
  estimatedReadingTime: number; // in minutes
  reflectionPrompt: string;
  relatedAyahOrQuote: string;
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
  lastReadChapterId?: string;
  lastReadProphetId?: string;
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
