/**
 * ConfirmationModal Component
 * Modal for confirming user actions
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
} from 'react-native';
import Animated, { FadeIn, FadeOut, SlideInDown, SlideOutDown } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Button } from '@/components/ui/button';
import { Colors, Spacing, Radius, TextStyles, Shadows } from '@/constants/theme';
import { useAppTheme } from '@/hooks/use-app-theme';

interface ConfirmationModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  icon?: string;
  variant?: 'default' | 'warning';
}

export function ConfirmationModal({
  visible,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  icon,
  variant = 'default',
}: ConfirmationModalProps) {
  const { colors } = useAppTheme();

  const handleConfirm = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onConfirm();
  };

  const handleCancel = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={onClose}
        />
        <Animated.View
          entering={SlideInDown.springify().damping(20)}
          exiting={SlideOutDown.duration(200)}
          style={[
            styles.modal,
            {
              backgroundColor: colors.backgroundCard,
            },
            Shadows.lg,
          ]}
        >
          {/* Icon */}
          {icon && (
            <View style={styles.iconContainer}>
              <Text style={styles.icon}>{icon}</Text>
            </View>
          )}

          {/* Title */}
          <Text style={[styles.title, { color: colors.text }]}>
            {title}
          </Text>

          {/* Message */}
          <Text style={[styles.message, { color: colors.textSecondary }]}>
            {message}
          </Text>

          {/* Actions */}
          <View style={styles.actions}>
            <Button
              title={confirmLabel}
              onPress={handleConfirm}
              variant="primary"
              fullWidth
              style={styles.confirmButton}
            />
            <Pressable
              onPress={handleCancel}
              style={styles.cancelButton}
              accessibilityRole="button"
              accessibilityLabel={cancelLabel}
            >
              <Text style={[styles.cancelText, { color: colors.textSecondary }]}>
                {cancelLabel}
              </Text>
            </Pressable>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  modal: {
    width: '100%',
    maxWidth: 340,
    borderRadius: Radius.xl,
    padding: Spacing.xl,
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: Spacing.md,
  },
  icon: {
    fontSize: 48,
  },
  title: {
    ...TextStyles.headingMedium,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  message: {
    ...TextStyles.bodyMedium,
    textAlign: 'center',
    marginBottom: Spacing.xl,
    lineHeight: 24,
  },
  actions: {
    width: '100%',
  },
  confirmButton: {
    marginBottom: Spacing.md,
  },
  cancelButton: {
    padding: Spacing.sm,
    alignItems: 'center',
  },
  cancelText: {
    ...TextStyles.labelMedium,
  },
});
