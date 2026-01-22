/**
 * Timer utilities for reading sessions
 */

import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

dayjs.extend(duration);

/**
 * Format seconds into a readable time string (MM:SS)
 */
export const formatTimeRemaining = (seconds: number): string => {
  if (seconds <= 0) return '0:00';

  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;

  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

/**
 * Format a countdown to a specific time
 */
export const formatCountdown = (unlockTime: string): string => {
  const now = dayjs();
  const unlock = dayjs(unlockTime);

  if (now.isAfter(unlock)) {
    return 'Available now';
  }

  const diff = unlock.diff(now);
  const dur = dayjs.duration(diff);

  const hours = Math.floor(dur.asHours());
  const minutes = dur.minutes();

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }

  return `${minutes} minutes`;
};

/**
 * Calculate time remaining in a session
 */
export const calculateTimeRemaining = (
  startTime: string,
  durationMinutes: number
): number => {
  const start = dayjs(startTime);
  const now = dayjs();
  const elapsed = now.diff(start, 'second');
  const total = durationMinutes * 60;

  return Math.max(0, total - elapsed);
};

/**
 * Check if a session has expired
 */
export const isSessionExpired = (
  startTime: string,
  durationMinutes: number
): boolean => {
  return calculateTimeRemaining(startTime, durationMinutes) <= 0;
};

/**
 * Get a friendly greeting based on time of day
 */
export const getTimeBasedGreeting = (): { greeting: string; arabic: string } => {
  const hour = dayjs().hour();

  if (hour >= 5 && hour < 12) {
    return {
      greeting: 'Good morning',
      arabic: 'صباح الخير',
    };
  } else if (hour >= 12 && hour < 17) {
    return {
      greeting: 'Good afternoon',
      arabic: 'مساء الخير',
    };
  } else if (hour >= 17 && hour < 21) {
    return {
      greeting: 'Good evening',
      arabic: 'مساء الخير',
    };
  } else {
    return {
      greeting: 'Peace be upon you',
      arabic: 'السلام عليكم',
    };
  }
};

/**
 * Format a date for display
 */
export const formatDate = (date: string | Date): string => {
  return dayjs(date).format('MMMM D, YYYY');
};

/**
 * Get human-readable time since
 */
export const getTimeSince = (date: string | Date): string => {
  const now = dayjs();
  const then = dayjs(date);
  const diffHours = now.diff(then, 'hour');

  if (diffHours < 1) {
    const diffMins = now.diff(then, 'minute');
    return `${diffMins} minutes ago`;
  } else if (diffHours < 24) {
    return `${diffHours} hours ago`;
  } else {
    const diffDays = now.diff(then, 'day');
    return `${diffDays} days ago`;
  }
};
