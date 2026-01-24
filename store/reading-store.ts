/**
 * Zustand store for reading state management
 * Handles reading sessions, progress tracking, and chapter locking
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import dayjs from 'dayjs';
import {
  ReadingSession,
  ChapterProgress,
  ReadingPreferences,
  ReadingDuration,
  ReadingIntention,
} from '@/types';

interface ReadingState {
  // Current active session
  currentSession: ReadingSession | null;

  // Progress tracking per chapter
  chapterProgress: Record<string, ChapterProgress>;

  // User preferences
  preferences: ReadingPreferences;

  // Actions
  startSession: (
    chapterId: string,
    duration: ReadingDuration,
    totalPages: number,
    intention?: ReadingIntention
  ) => void;
  updateCurrentPage: (page: number) => void;
  completeSession: (notes?: string) => void;
  finishSessionEarly: () => void; // Complete session before timer ends
  cancelSession: () => void;
  isChapterLocked: (chapterId: string) => boolean;
  getUnlockTime: (chapterId: string) => string | null;
  setFontSize: (size: ReadingPreferences['fontSize']) => void;
  setLastRead: (storyId: string, chapterId: string) => void;
  getSessionTimeRemaining: () => number; // returns seconds
  getSessionElapsedTime: () => number; // returns seconds elapsed
  pauseSession: () => void;
  resumeSession: () => void;
}

// Generate unique ID for sessions
const generateId = (): string => {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const useReadingStore = create<ReadingState>()(
  persist(
    (set, get) => ({
      currentSession: null,
      chapterProgress: {},
      preferences: {
        fontSize: 'medium',
        textColor: 'black',
        backgroundColor: 'white',
        lineSpacing: 'normal',
      },

      startSession: (chapterId, duration, totalPages, intention) => {
        const session: ReadingSession = {
          id: generateId(),
          chapterId,
          selectedDuration: duration,
          startTime: dayjs().toISOString(),
          isCompleted: false,
          currentPage: 0,
          totalPages,
          intention,
        };

        set({ currentSession: session });
      },

      updateCurrentPage: (page) => {
        const { currentSession } = get();
        if (!currentSession) return;

        set({
          currentSession: {
            ...currentSession,
            currentPage: page,
          },
        });
      },

      completeSession: (notes) => {
        const { currentSession, chapterProgress } = get();
        if (!currentSession) return;

        const now = dayjs();
        const lockedUntil = now.add(24, 'hour').toISOString();

        // Update session as completed
        const completedSession: ReadingSession = {
          ...currentSession,
          endTime: now.toISOString(),
          isCompleted: true,
          lockedUntil,
          notes,
        };

        // Update chapter progress
        const existingProgress = chapterProgress[currentSession.chapterId];
        const newProgress: ChapterProgress = {
          chapterId: currentSession.chapterId,
          lastReadPage: currentSession.currentPage,
          totalPages: currentSession.totalPages,
          isLocked: true,
          lockedUntil,
          completedSessions: (existingProgress?.completedSessions || 0) + 1,
        };

        set({
          currentSession: null,
          chapterProgress: {
            ...chapterProgress,
            [currentSession.chapterId]: newProgress,
          },
        });
      },

      finishSessionEarly: () => {
        // Same as completeSession but marks as finished early
        const { currentSession, chapterProgress } = get();
        if (!currentSession) return;

        const now = dayjs();
        const lockedUntil = now.add(24, 'hour').toISOString();

        // Update chapter progress
        const existingProgress = chapterProgress[currentSession.chapterId];
        const newProgress: ChapterProgress = {
          chapterId: currentSession.chapterId,
          lastReadPage: currentSession.currentPage,
          totalPages: currentSession.totalPages,
          isLocked: true,
          lockedUntil,
          completedSessions: (existingProgress?.completedSessions || 0) + 1,
        };

        set({
          currentSession: {
            ...currentSession,
            endTime: now.toISOString(),
            isCompleted: true,
            lockedUntil,
          },
          chapterProgress: {
            ...chapterProgress,
            [currentSession.chapterId]: newProgress,
          },
        });
      },

      cancelSession: () => {
        set({ currentSession: null });
      },

      isChapterLocked: (chapterId) => {
        const { chapterProgress } = get();
        const progress = chapterProgress[chapterId];

        if (!progress || !progress.lockedUntil) return false;

        const unlockTime = dayjs(progress.lockedUntil);
        return dayjs().isBefore(unlockTime);
      },

      getUnlockTime: (chapterId) => {
        const { chapterProgress } = get();
        const progress = chapterProgress[chapterId];

        if (!progress || !progress.lockedUntil) return null;

        const unlockTime = dayjs(progress.lockedUntil);
        if (dayjs().isAfter(unlockTime)) return null;

        return progress.lockedUntil;
      },

      setFontSize: (size) => {
        set((state) => ({
          preferences: {
            ...state.preferences,
            fontSize: size,
          },
        }));
      },

      setLastRead: (storyId, chapterId) => {
        set((state) => ({
          preferences: {
            ...state.preferences,
            lastReadStoryId: storyId,
            lastReadChapterId: chapterId,
            // Legacy support
            lastReadProphetId: storyId,
          },
        }));
      },

      getSessionTimeRemaining: () => {
        const { currentSession } = get();
        if (!currentSession) return 0;

        const startTime = dayjs(currentSession.startTime);
        const durationMs = currentSession.selectedDuration * 60 * 1000;
        const elapsed = dayjs().diff(startTime);
        const remaining = Math.max(0, durationMs - elapsed);

        return Math.floor(remaining / 1000);
      },

      getSessionElapsedTime: () => {
        const { currentSession } = get();
        if (!currentSession) return 0;

        const startTime = dayjs(currentSession.startTime);
        const elapsed = dayjs().diff(startTime);

        return Math.floor(elapsed / 1000);
      },

      pauseSession: () => {
        // Store the elapsed time when pausing
        const { currentSession } = get();
        if (!currentSession) return;

        // We'll handle pause by storing elapsed time in a way that
        // resumeSession can use to adjust the start time
        const elapsed = dayjs().diff(dayjs(currentSession.startTime));

        set({
          currentSession: {
            ...currentSession,
            // Store elapsed as a note temporarily (workaround for MVP)
            notes: `__elapsed:${elapsed}`,
          },
        });
      },

      resumeSession: () => {
        const { currentSession } = get();
        if (!currentSession || !currentSession.notes?.startsWith('__elapsed:')) return;

        const elapsed = parseInt(currentSession.notes.split(':')[1], 10);
        const newStartTime = dayjs().subtract(elapsed, 'millisecond').toISOString();

        set({
          currentSession: {
            ...currentSession,
            startTime: newStartTime,
            notes: undefined,
          },
        });
      },
    }),
    {
      name: 'qasas-reading-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        chapterProgress: state.chapterProgress,
        preferences: state.preferences,
        // Don't persist currentSession to handle app crashes gracefully
      }),
    }
  )
);
