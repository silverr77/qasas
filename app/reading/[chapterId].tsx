/**
 * ReadingScreen
 * The main reading experience with page-by-page navigation
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  AppState,
  AppStateStatus,
  Pressable,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  FadeIn,
  FadeOut,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { SafeAreaView } from '@/components/ui/safe-area-view';
import { ReadingPager } from '@/components/reading-pager';
import { ConfirmationModal } from '@/components/ui/confirmation-modal';
import { QuickSettings } from '@/components/reading/quick-settings';
import { Spacing, TextStyles, Radius } from '@/constants/theme';
import { useAppTheme } from '@/hooks/use-app-theme';
import { useTranslation } from '@/hooks/use-translation';
import { useRTL } from '@/hooks/use-rtl';
import { useReadingStore } from '@/store/reading-store';
import { useUserStore } from '@/store/user-store';
import { getChapterById } from '@/data/chapters';
import { paginateTextSimple } from '@/utils/paginate-text';
import { formatTimeRemaining, isSessionExpired } from '@/utils/timer';
import {
  getReadingBackgroundColor,
  getReadingTextColor,
  getLineSpacingMultiplier,
} from '@/utils/reading-colors';

// Minimum reading time before allowing early finish (30 seconds)
const MIN_READING_TIME_SECONDS = 30;

export default function ReadingScreen() {
  const { colors } = useAppTheme();
  const { t } = useTranslation();
  const router = useRouter();
  const { chapterId } = useLocalSearchParams<{ chapterId: string }>();
  const language = useUserStore((state) => state.language);
  const rtl = useRTL();

  const {
    currentSession,
    updateCurrentPage,
    finishSessionEarly,
    cancelSession,
    getSessionTimeRemaining,
    getSessionElapsedTime,
    pauseSession,
    resumeSession,
  } = useReadingStore();
  
  const { fontSize, textColor, backgroundColor, lineSpacing } = useUserStore();

  const chapter = chapterId ? getChapterById(chapterId) : null;

  // Use Arabic content when available and language is Arabic
  const contentToRead =
    chapter && language === 'ar' && chapter.contentAr
      ? chapter.contentAr
      : chapter?.content ?? '';

  // Paginate content
  const { pages, totalPages } = chapter
    ? paginateTextSimple(contentToRead, fontSize)
    : { pages: [], totalPages: 0 };

  const readingBg = getReadingBackgroundColor(backgroundColor);
  const readingText = getReadingTextColor(textColor, backgroundColor);
  const lineSpacingMultiplier = getLineSpacingMultiplier(lineSpacing);

  const [currentPage, setCurrentPage] = useState(currentSession?.currentPage || 0);
  const [timeRemaining, setTimeRemaining] = useState(getSessionTimeRemaining());
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isTimeUp, setIsTimeUp] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [showFinishModal, setShowFinishModal] = useState(false);
  const [showQuickSettings, setShowQuickSettings] = useState(false);

  // Show finish button after minimum reading time
  const canFinishEarly = elapsedTime >= MIN_READING_TIME_SECONDS;

  const appStateRef = useRef(AppState.currentState);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const fadeOpacity = useSharedValue(1);

  // Handle app state changes (pause/resume)
  useEffect(() => {
    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => {
      subscription.remove();
    };
  }, []);

  const handleAppStateChange = (nextAppState: AppStateStatus) => {
    if (appStateRef.current === 'active' && nextAppState.match(/inactive|background/)) {
      // App is going to background - pause timer
      pauseSession();
    } else if (
      appStateRef.current.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      // App is coming to foreground - resume timer
      resumeSession();
    }
    appStateRef.current = nextAppState;
  };

  // Timer countdown
  useEffect(() => {
    if (!currentSession) return;

    const updateTimer = () => {
      const remaining = getSessionTimeRemaining();
      const elapsed = getSessionElapsedTime();
      setTimeRemaining(remaining);
      setElapsedTime(elapsed);

      if (remaining <= 0) {
        handleTimeComplete();
      }
    };

    updateTimer();
    timerRef.current = setInterval(updateTimer, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [currentSession]);

  // Check if session already expired on mount
  useEffect(() => {
    if (currentSession && isSessionExpired(currentSession.startTime, currentSession.selectedDuration)) {
      handleTimeComplete();
    }
  }, []);

  const handleTimeComplete = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    // Gentle haptic feedback
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    // Smooth fade transition
    fadeOpacity.value = withTiming(0, { duration: 500 }, () => {
      setIsTimeUp(true);
    });
  }, []);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    updateCurrentPage(page);
  };

  const handleContinueToReflection = () => {
    router.replace(`/reflection/${chapterId}`);
  };

  const handleExit = () => {
    cancelSession();
    router.back();
  };

  const handleFinishEarlyPress = () => {
    setShowFinishModal(true);
  };

  const handleConfirmFinishEarly = () => {
    setShowFinishModal(false);
    finishSessionEarly();
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.replace(`/reflection/${chapterId}`);
  };

  const toggleControls = () => {
    setShowControls(!showControls);
  };

  const animatedContentStyle = useAnimatedStyle(() => ({
    opacity: fadeOpacity.value,
  }));

  if (!chapter || !currentSession) {
    return (
      <SafeAreaView>
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: colors.textSecondary }]}>
            No active reading session
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // Time's up overlay
  if (isTimeUp) {
    return (
      <SafeAreaView style={{ backgroundColor: readingBg }}>
        <Animated.View
          entering={FadeIn.duration(500)}
          style={styles.timeUpContainer}
        >
          <Text style={styles.timeUpEmoji}>✨</Text>
          <Text style={[styles.timeUpTitle, { color: colors.text }]}>
            {t('reading.timeForReflection')}
          </Text>
          <Text style={[styles.timeUpMessage, { color: colors.textSecondary }]}>
            {t('reading.completedMessage')}
          </Text>
          <Pressable
            onPress={handleContinueToReflection}
            style={[
              styles.continueButton,
              { backgroundColor: colors.primary },
            ]}
          >
            <Text style={[styles.continueButtonText, { color: colors.textInverse }]}>
              {t('reading.continueToReflection')}
            </Text>
          </Pressable>
        </Animated.View>
      </SafeAreaView>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: readingBg }]}>
      <SafeAreaView style={styles.safeArea}>
        <Animated.View style={[styles.content, animatedContentStyle]}>
          {/* Header controls */}
          {showControls && (
            <Animated.View
              entering={FadeIn.duration(200)}
              exiting={FadeOut.duration(200)}
              style={[
                styles.header,
                { borderBottomColor: colors.borderLight, flexDirection: rtl.row },
              ]}
            >
              <Pressable
                onPress={handleExit}
                style={styles.exitButton}
                accessibilityLabel="Exit reading"
              >
                <Text style={[styles.exitText, { color: colors.textSecondary }]}>
                  ✕
                </Text>
              </Pressable>

              <View style={[styles.headerCenter, { alignItems: 'center' }]}>
                <Text
                  style={[
                    styles.chapterTitle,
                    { color: colors.text, textAlign: rtl.textAlign },
                  ]}
                  numberOfLines={1}
                >
                  {language === 'ar' ? chapter.titleAr : chapter.titleEn}
                </Text>
              </View>

              <View style={[styles.timerBlock, rtl.marginStart(Spacing.sm)]}>
                <Text style={[styles.timerText, { color: colors.primary }]}>
                  {formatTimeRemaining(timeRemaining)}
                </Text>
                <Text
                  style={[
                    styles.timerLabel,
                    { color: colors.textTertiary },
                    { textAlign: 'center' },
                  ]}
                >
                  {t('reading.timeLeft')}
                </Text>
              </View>

              <Pressable
                onPress={() => setShowQuickSettings(true)}
                style={[styles.settingsButton, rtl.marginStart(Spacing.xs)]}
                accessibilityLabel="Reading settings"
              >
                <Text style={[styles.settingsIcon, { color: colors.textSecondary }]}>
                  ⚙️
                </Text>
              </Pressable>
            </Animated.View>
          )}

          {/* Progress above text (when controls visible) */}
          {showControls && (
            <Animated.View
              entering={FadeIn.duration(200)}
              exiting={FadeOut.duration(200)}
              style={styles.progressAboveContent}
            >
              <View
                style={[
                  styles.progressBarWrap,
                  { backgroundColor: colors.borderLight },
                ]}
              >
                <View
                  style={[
                    styles.progressBarFill,
                    {
                      backgroundColor: colors.primary,
                      width: `${totalPages > 0 ? ((currentPage + 1) / totalPages) * 100 : 0}%`,
                      alignSelf: rtl.isRTL ? 'flex-end' : 'flex-start',
                    },
                  ]}
                />
              </View>
              <Text
                style={[
                  styles.pageLabel,
                  { color: colors.textTertiary },
                  { textAlign: rtl.textAlign },
                ]}
              >
                {t('navigation.pageCounter', {
                  current: currentPage + 1,
                  total: totalPages || 1,
                })}
              </Text>
            </Animated.View>
          )}

          {/* Reading content */}
          <Pressable style={styles.readingArea} onPress={toggleControls}>
            <ReadingPager
              pages={pages}
              currentPage={currentPage}
              onPageChange={handlePageChange}
              fontSize={fontSize}
              readingBackgroundColor={readingBg}
              readingTextColor={readingText}
              lineSpacingMultiplier={lineSpacingMultiplier}
            />
          </Pressable>

          {/* Footer: arrows on top, then progress */}
          {showControls && (
            <Animated.View
              entering={FadeIn.duration(200)}
              exiting={FadeOut.duration(200)}
              style={styles.footer}
            >
              {/* Row 1: prev/next arrows (grouped) and finish button */}
              <View style={[styles.footerArrowsRow, { flexDirection: rtl.row }]}>
                <View style={[styles.footerArrowsGroup, { flexDirection: rtl.row }]}>
                  <Pressable
                    onPress={() => {
                      if (currentPage > 0) {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        handlePageChange(currentPage - 1);
                      }
                    }}
                    style={[
                      styles.footerNavButton,
                      {
                        backgroundColor: currentPage > 0 ? colors.primary : colors.borderLight,
                        opacity: currentPage > 0 ? 1 : 0.5,
                      },
                    ]}
                    accessibilityRole="button"
                    accessibilityLabel={t('navigation.previousPage')}
                    accessibilityState={{ disabled: currentPage === 0 }}
                  >
                    <Text
                      style={[
                        styles.footerNavButtonText,
                        {
                          color: currentPage > 0 ? colors.textInverse : colors.textTertiary,
                        },
                      ]}
                    >
                      {rtl.isRTL ? '→' : '←'}
                    </Text>
                  </Pressable>

                  <Pressable
                    onPress={() => {
                      if (currentPage < totalPages - 1) {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        handlePageChange(currentPage + 1);
                      }
                    }}
                    style={[
                      styles.footerNavButton,
                      {
                        backgroundColor:
                          currentPage < totalPages - 1 ? colors.primary : colors.borderLight,
                        opacity: currentPage < totalPages - 1 ? 1 : 0.5,
                      },
                    ]}
                    accessibilityRole="button"
                    accessibilityLabel={t('navigation.nextPage')}
                    accessibilityState={{ disabled: currentPage >= totalPages - 1 }}
                  >
                    <Text
                      style={[
                        styles.footerNavButtonText,
                        {
                          color:
                            currentPage < totalPages - 1
                              ? colors.textInverse
                              : colors.textTertiary,
                        },
                      ]}
                    >
                      {rtl.isRTL ? '←' : '→'}
                    </Text>
                  </Pressable>
                </View>

                {canFinishEarly ? (
                  <Pressable
                    onPress={handleFinishEarlyPress}
                    style={[
                      styles.finishButton,
                      { backgroundColor: colors.primary },
                    ]}
                    accessibilityLabel="Finish reading"
                    accessibilityHint="Complete reading session and proceed to reflection"
                  >
                    <Text style={[styles.finishButtonText, { color: colors.textInverse }]}>
                      {t('reading.finishReading')}
                    </Text>
                  </Pressable>
                ) : (
                  <View style={styles.finishButtonPlaceholder} />
                )}
              </View>
            </Animated.View>
          )}
        </Animated.View>
      </SafeAreaView>

      {/* Finish Early Confirmation Modal */}
      <ConfirmationModal
        visible={showFinishModal}
        onClose={() => setShowFinishModal(false)}
        onConfirm={handleConfirmFinishEarly}
        icon="📖"
        title={t('reading.finishEarlyTitle')}
        message={t('reading.finishEarlyMessage', { time: formatTimeRemaining(timeRemaining) })}
        confirmLabel={t('reading.continueToReflection')}
        cancelLabel={t('reading.keepReading')}
      />

      {/* Quick Settings Modal */}
      <QuickSettings
        visible={showQuickSettings}
        onClose={() => setShowQuickSettings(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 0.5,
  },
  exitButton: {
    padding: Spacing.sm,
  },
  exitText: {
    fontSize: 20,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
  },
  chapterTitle: {
    ...TextStyles.labelMedium,
  },
  timerBlock: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 52,
  },
  timerText: {
    ...TextStyles.labelLarge,
    fontVariant: ['tabular-nums'],
  },
  timerLabel: {
    ...TextStyles.labelSmall,
    fontSize: 10,
    marginTop: 2,
  },
  settingsButton: {
    padding: Spacing.sm,
  },
  settingsIcon: {
    fontSize: 20,
  },
  readingArea: {
    flex: 1,
  },
  footer: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    paddingBottom: Spacing.xl,
    gap: Spacing.md,
  },
  footerArrowsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.sm,
  },
  footerArrowsGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  progressAboveContent: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    paddingBottom: Spacing.xs,
  },
  footerNavButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerNavButtonText: {
    fontSize: 22,
    fontWeight: '500',
  },
  progressBarWrap: {
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: Spacing.xs,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 2,
  },
  pageLabel: {
    ...TextStyles.labelSmall,
    fontSize: 11,
  },
  finishButton: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    borderRadius: Radius.md,
    minWidth: 120,
    alignItems: 'center',
  },
  finishButtonPlaceholder: {
    minWidth: 120,
  },
  finishButtonText: {
    ...TextStyles.labelMedium,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    ...TextStyles.bodyMedium,
  },
  timeUpContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
  },
  timeUpEmoji: {
    fontSize: 64,
    marginBottom: Spacing.lg,
  },
  timeUpTitle: {
    ...TextStyles.displayMedium,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  timeUpMessage: {
    ...TextStyles.bodyLarge,
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  continueButton: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    borderRadius: Radius.md,
  },
  continueButtonText: {
    ...TextStyles.labelLarge,
  },
});
