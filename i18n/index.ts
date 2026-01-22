/**
 * i18n Configuration
 * Internationalization setup using i18n-js
 */

import { I18n } from 'i18n-js';
import en from './en';
import ar from './ar';

// Create i18n instance
const i18n = new I18n({
  en,
  ar,
});

// Set default locale
i18n.defaultLocale = 'en';
i18n.enableFallback = true;

export default i18n;

// Type-safe translation keys
export type TranslationKeys = typeof en;
