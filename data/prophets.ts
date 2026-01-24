/**
 * Seed data for prophets
 * Legacy file - use stories.ts instead
 * Kept for backward compatibility during migration
 */

import { Story } from '@/types';
import { getStoriesByCategory, getStoryById } from './stories';

// Re-export prophets from stories
export const prophets: Story[] = getStoriesByCategory('prophets');

export const getProphetById = (id: string): Story | undefined => {
  return getStoryById(id);
};
