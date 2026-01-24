/**
 * Unlock Store
 * Manages chapter unlocking system with ad/watch time support
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import dayjs from 'dayjs';
import { ChapterUnlock, StoryProgress, StoryCategory } from '@/types';

interface UnlockState {
  // Chapter unlock records
  chapterUnlocks: Record<string, ChapterUnlock>;
  
  // Story progress tracking
  storyProgress: Record<string, StoryProgress>;
  
  // Actions
  unlockChapter: (
    chapterId: string,
    storyId: string,
    category: StoryCategory,
    method: 'ad' | 'wait'
  ) => void;
  
  isChapterUnlocked: (chapterId: string, storyId: string) => boolean;
  
  getUnlockMethod: (
    chapterId: string,
    storyId: string
  ) => 'free' | 'ad' | 'wait' | null;
  
  getTimeUntilUnlock: (chapterId: string) => number; // seconds
  
  canWatchAd: (chapterId: string) => boolean;
  
  getFreeChaptersCount: (storyId: string) => number; // Always returns 2
  
  getChaptersUnlocked: (storyId: string) => number;
  
  shouldShowUnlockOption: (chapterId: string, storyId: string, chapterNumber: number) => boolean;
}

const FREE_CHAPTERS_COUNT = 2;
const WAIT_HOURS = 8;

export const useUnlockStore = create<UnlockState>()(
  persist(
    (set, get) => ({
      chapterUnlocks: {},
      storyProgress: {},
      
      unlockChapter: (chapterId, storyId, category, method) => {
        const now = dayjs();
        const unlockRecord: ChapterUnlock = {
          chapterId,
          storyId,
          category,
          unlockMethod: method,
          unlockedAt: now.toISOString(),
          adWatched: method === 'ad',
        };
        
        if (method === 'wait') {
          unlockRecord.lockedUntil = now.add(WAIT_HOURS, 'hour').toISOString();
        }
        
        // Update story progress
        const existingProgress = get().storyProgress[storyId];
        const chaptersUnlocked = get().getChaptersUnlocked(storyId) + 1;
        
        const newProgress: StoryProgress = {
          storyId,
          category,
          chaptersUnlocked,
          lastUnlockMethod: method,
          nextUnlockTime: method === 'wait' ? unlockRecord.lockedUntil : undefined,
        };
        
        set((state) => ({
          chapterUnlocks: {
            ...state.chapterUnlocks,
            [chapterId]: unlockRecord,
          },
          storyProgress: {
            ...state.storyProgress,
            [storyId]: newProgress,
          },
        }));
      },
      
      isChapterUnlocked: (chapterId, storyId) => {
        const { chapterUnlocks, getFreeChaptersCount } = get();
        
        // First 2 chapters are always free
        const freeCount = getFreeChaptersCount(storyId);
        const chapterNumber = parseInt(chapterId.split('-').pop() || '0', 10);
        if (chapterNumber <= freeCount) {
          return true;
        }
        
        const unlock = chapterUnlocks[chapterId];
        if (!unlock) return false;
        
        // If unlocked via ad, it's permanent
        if (unlock.unlockMethod === 'ad' && unlock.unlockedAt) {
          return true;
        }
        
        // If unlocked via wait, check if wait time has passed
        if (unlock.unlockMethod === 'wait' && unlock.lockedUntil) {
          return dayjs().isAfter(dayjs(unlock.lockedUntil));
        }
        
        return false;
      },
      
      getUnlockMethod: (chapterId, storyId) => {
        const { getFreeChaptersCount, chapterUnlocks } = get();
        
        // Check if it's a free chapter
        const freeCount = getFreeChaptersCount(storyId);
        const chapterNumber = parseInt(chapterId.split('-').pop() || '0', 10);
        if (chapterNumber <= freeCount) {
          return 'free';
        }
        
        const unlock = chapterUnlocks[chapterId];
        if (!unlock) return null;
        
        return unlock.unlockMethod;
      },
      
      getTimeUntilUnlock: (chapterId) => {
        const unlock = get().chapterUnlocks[chapterId];
        if (!unlock || !unlock.lockedUntil) return 0;
        
        const unlockTime = dayjs(unlock.lockedUntil);
        const now = dayjs();
        
        if (now.isAfter(unlockTime)) return 0;
        
        return unlockTime.diff(now, 'second');
      },
      
      canWatchAd: (chapterId) => {
        // In a real implementation, this would check if ad is loaded
        // For now, always return true
        return true;
      },
      
      getFreeChaptersCount: () => {
        // Always returns 2 for first 2 chapters
        return FREE_CHAPTERS_COUNT;
      },
      
      getChaptersUnlocked: (storyId) => {
        const { storyProgress, chapterUnlocks } = get();
        const progress = storyProgress[storyId];
        
        if (progress) {
          return progress.chaptersUnlocked;
        }
        
        // Count unlocked chapters for this story
        const unlockedChapters = Object.values(chapterUnlocks).filter(
          (unlock) => unlock.storyId === storyId && get().isChapterUnlocked(unlock.chapterId, storyId)
        );
        
        // Always at least 2 free chapters
        return Math.max(FREE_CHAPTERS_COUNT, unlockedChapters.length);
      },
      
      shouldShowUnlockOption: (chapterId, storyId, chapterNumber) => {
        const { getFreeChaptersCount, isChapterUnlocked } = get();
        
        // First 2 chapters are always free, no unlock needed
        const freeCount = getFreeChaptersCount(storyId);
        if (chapterNumber <= freeCount) {
          return false;
        }
        
        // Show unlock option if chapter is not unlocked
        // This means the chapter needs to be unlocked (via ad or wait)
        return !isChapterUnlocked(chapterId, storyId);
      },
    }),
    {
      name: 'qasas-unlock-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
