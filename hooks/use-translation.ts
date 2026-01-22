/**
 * useTranslation Hook
 * Provides translations based on user's language preference
 */

import { useMemo } from 'react';
import { I18nManager } from 'react-native';
import i18n from '@/i18n';
import { useUserStore } from '@/store/user-store';

export function useTranslation() {
  const language = useUserStore((state) => state.language);

  // Set the locale based on user preference
  i18n.locale = language;

  const t = useMemo(() => {
    return (key: string, options?: Record<string, unknown>) => {
      return i18n.t(key, options);
    };
  }, [language]);

  return {
    t,
    language,
    isRTL: language === 'ar',
    locale: language,
  };
}

// Hook for getting translation direction styles
export function useRTL() {
  const language = useUserStore((state) => state.language);
  const isRTL = language === 'ar';

  return {
    isRTL,
    textAlign: isRTL ? 'right' as const : 'left' as const,
    flexDirection: isRTL ? 'row-reverse' as const : 'row' as const,
    alignSelf: isRTL ? 'flex-end' as const : 'flex-start' as const,
  };
}
