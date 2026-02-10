/**
 * Programmatic app reload. Used when RTL must be applied (I18nManager.forceRTL
 * only takes effect after a reload on React Native).
 */

import { reloadAppAsync } from 'expo';

/**
 * Schedules an app reload after a short delay so the current tick can finish
 * (e.g. persist state, then reload).
 */
export function scheduleReloadForRTL(): void {
  setTimeout(() => {
    reloadAppAsync().catch(() => {
      // Ignore if reload fails (e.g. in some dev environments)
    });
  }, 100);
}
