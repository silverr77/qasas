/**
 * EmptyState Component
 * Displays a friendly message when lists are empty
 */

import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { Spacing, TextStyles, Radius } from '@/constants/theme';
import { useAppTheme } from '@/hooks/use-app-theme';
import AppHaptics from '@/utils/haptics';

interface EmptyStateProps {
  icon: string;
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  variant?: 'default' | 'locked';
  countdown?: string;
}

export function EmptyState({
  icon,
  title,
  message,
  actionLabel,
  onAction,
  variant = 'default',
  countdown,
}: EmptyStateProps) {
  const { colors } = useAppTheme();

  const handleAction = () => {
    AppHaptics.medium();
    onAction?.();
  };

  return (
    <Animated.View
      entering={FadeIn.duration(500)}
      style={styles.container}
    >
      {/* Icon */}
      <Text style={styles.icon}>{icon}</Text>

      {/* Title */}
      <Text style={[styles.title, { color: colors.text }]}>
        {title}
      </Text>

      {/* Message */}
      <Text style={[styles.message, { color: colors.textSecondary }]}>
        {message}
      </Text>

      {/* Countdown (for locked state) */}
      {countdown && variant === 'locked' && (
        <View
          style={[
            styles.countdownContainer,
            { backgroundColor: colors.accentLight },
          ]}
        >
          <Text style={[styles.countdownText, { color: colors.text }]}>
            {countdown}
          </Text>
        </View>
      )}

      {/* Action Button */}
      {actionLabel && onAction && (
        <Pressable
          onPress={handleAction}
          style={({ pressed }) => [
            styles.actionButton,
            { backgroundColor: colors.primary },
            pressed && styles.actionButtonPressed,
          ]}
          accessibilityRole="button"
          accessibilityLabel={actionLabel}
        >
          <Text style={[styles.actionButtonText, { color: colors.textInverse }]}>
            {actionLabel}
          </Text>
        </Pressable>
      )}
    </Animated.View>
  );
}

/**
 * No Chapters Started Empty State
 */
export function NoChaptersEmptyState({ onStartReading }: { onStartReading?: () => void }) {
  return (
    <EmptyState
      icon="🌙"
      title="Your journey awaits"
      message="Begin reading the stories of the prophets and discover timeless wisdom."
      actionLabel="Start Reading"
      onAction={onStartReading}
    />
  );
}

/**
 * All Chapters Locked Empty State
 */
export function AllChaptersLockedEmptyState({ earliestUnlock }: { earliestUnlock?: string }) {
  return (
    <EmptyState
      icon="🌿"
      title="Time for patience"
      message="All your chapters are resting. Return tomorrow to continue your journey."
      variant="locked"
      countdown={earliestUnlock ? `Earliest unlock: ${earliestUnlock}` : undefined}
    />
  );
}

/**
 * No Progress Empty State
 */
export function NoProgressEmptyState({ onStartReading }: { onStartReading?: () => void }) {
  return (
    <EmptyState
      icon="🌱"
      title="Begin your journey"
      message="Start reading the stories of the prophets and track your progress here."
      actionLabel="Choose a Prophet"
      onAction={onStartReading}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.xxxl,
  },
  icon: {
    fontSize: 64,
    marginBottom: Spacing.lg,
  },
  title: {
    ...TextStyles.headingMedium,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  message: {
    ...TextStyles.bodyMedium,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: Spacing.lg,
    paddingHorizontal: Spacing.md,
  },
  countdownContainer: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    borderRadius: Radius.md,
    marginBottom: Spacing.lg,
  },
  countdownText: {
    ...TextStyles.labelMedium,
  },
  actionButton: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    borderRadius: Radius.lg,
  },
  actionButtonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  actionButtonText: {
    ...TextStyles.labelLarge,
  },
});
