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
import { ProgressIndicator } from '@/components/progress-indicator';
import { ConfirmationModal } from '@/components/ui/confirmation-modal';
import { QuickSettings } from '@/components/reading/quick-settings';
import { Spacing, TextStyles, Radius } from '@/constants/theme';
import { useAppTheme } from '@/hooks/use-app-theme';
import { useTranslation } from '@/hooks/use-translation';
import { useReadingStore } from '@/store/reading-store';
import { useUserStore } from '@/store/user-store';
import { getChapterById } from '@/data/chapters';
import { paginateTextSimple } from '@/utils/paginate-text';
import { formatTimeRemaining, isSessionExpired } from '@/utils/timer';

// Minimum reading time before allowing early finish (30 seconds)
const MIN_READING_TIME_SECONDS = 30;

export default function ReadingScreen() {
  const { colors } = useAppTheme();
  const { t } = useTranslation();
  const router = useRouter();
  const { chapterId } = useLocalSearchParams<{ chapterId: string }>();
  const language = useUserStore((state) => state.language);

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
  
  const { fontSize } = useUserStore();

  const chapter = chapterId ? getChapterById(chapterId) : null;

  // Paginate content
  const { pages, totalPages } = chapter
    ? paginateTextSimple(chapter.content, fontSize)
    : { pages: [], totalPages: 0 };

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
      <SafeAreaView style={{ backgroundColor: colors.readingBackground }}>
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
    <View style={[styles.container, { backgroundColor: colors.readingBackground }]}>
      <SafeAreaView style={styles.safeArea}>
        <Animated.View style={[styles.content, animatedContentStyle]}>
          {/* Header controls */}
          {showControls && (
            <Animated.View
              entering={FadeIn.duration(200)}
              exiting={FadeOut.duration(200)}
              style={[styles.header, { borderBottomColor: colors.borderLight }]}
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

              <View style={styles.headerCenter}>
                <Text
                  style={[styles.chapterTitle, { color: colors.text }]}
                  numberOfLines={1}
                >
                  {language === 'ar' ? chapter.titleAr : chapter.titleEn}
                </Text>
              </View>

              <View style={styles.timerContainer}>
                <Text style={[styles.timerText, { color: colors.primary }]}>
                  {formatTimeRemaining(timeRemaining)}
                </Text>
              </View>

              <Pressable
                onPress={() => setShowQuickSettings(true)}
                style={styles.settingsButton}
                accessibilityLabel="Reading settings"
              >
                <Text style={[styles.settingsIcon, { color: colors.textSecondary }]}>
                  ⚙️
                </Text>
              </Pressable>
            </Animated.View>
          )}

          {/* Reading content */}
          <Pressable style={styles.readingArea} onPress={toggleControls}>
            <ReadingPager
              pages={pages}
              currentPage={currentPage}
              onPageChange={handlePageChange}
              fontSize={fontSize}
            />
          </Pressable>

          {/* Footer with progress and finish button */}
          {showControls && (
            <Animated.View
              entering={FadeIn.duration(200)}
              exiting={FadeOut.duration(200)}
              style={styles.footer}
            >
              <ProgressIndicator
                currentPage={currentPage}
                totalPages={totalPages}
              />

              {/* Finish Early Button - appears after minimum reading time */}
              {canFinishEarly && (
                <Pressable
                  onPress={handleFinishEarlyPress}
                  style={[
                    styles.finishButton,
                    {
                      backgroundColor: colors.backgroundCard,
                      borderColor: colors.border,
                    },
                  ]}
                  accessibilityLabel="Finish reading"
                  accessibilityHint="Complete reading session and proceed to reflection"
                >
                  <Text style={[styles.finishButtonText, { color: colors.primary }]}>
                    {t('reading.finishReading')}
                  </Text>
                </Pressable>
              )}
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
  timerContainer: {
    paddingHorizontal: Spacing.sm,
    alignItems: 'center',
    minWidth: 60,
  },
  timerText: {
    ...TextStyles.labelLarge,
    fontVariant: ['tabular-nums'],
  },
  settingsButton: {
    padding: Spacing.sm,
    marginLeft: Spacing.sm,
  },
  settingsIcon: {
    fontSize: 20,
  },
  readingArea: {
    flex: 1,
  },
  footer: {
    paddingBottom: Spacing.md,
    alignItems: 'center',
  },
  finishButton: {
    marginTop: Spacing.md,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    borderRadius: Radius.md,
    borderWidth: 1,
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
