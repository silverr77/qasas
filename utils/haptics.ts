/**
 * Haptics Utility
 * Standardized haptic feedback patterns for the app
 */

import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

/**
 * Light impact - for subtle interactions
 * Use: Button press, selection changes, toggles
 */
export const lightImpact = () => {
  if (Platform.OS === 'ios') {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }
};

/**
 * Medium impact - for standard interactions
 * Use: Primary button press, navigation, confirmations
 */
export const mediumImpact = () => {
  if (Platform.OS === 'ios') {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  }
};

/**
 * Heavy impact - for significant interactions
 * Use: Important actions, completing tasks
 */
export const heavyImpact = () => {
  if (Platform.OS === 'ios') {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
  }
};

/**
 * Soft impact - for gentle interactions
 * Use: Page turns, subtle feedback
 */
export const softImpact = () => {
  if (Platform.OS === 'ios') {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
  }
};

/**
 * Selection feedback - for selection changes
 * Use: Picker changes, list selections, option changes
 */
export const selection = () => {
  if (Platform.OS === 'ios') {
    Haptics.selectionAsync();
  }
};

/**
 * Success notification - for successful actions
 * Use: Task completion, successful save, achievements
 */
export const success = () => {
  if (Platform.OS === 'ios') {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }
};

/**
 * Warning notification - for warnings
 * Use: Validation errors, warnings, alerts
 */
export const warning = () => {
  if (Platform.OS === 'ios') {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
  }
};

/**
 * Error notification - for errors
 * Use: Errors, failed actions, destructive confirmations
 */
export const error = () => {
  if (Platform.OS === 'ios') {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
  }
};

/**
 * Page flip haptic - for reading experience
 * Use: Turning pages in the reader
 */
export const pageFlip = () => {
  if (Platform.OS === 'ios') {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
  }
};

/**
 * Card press haptic - for card interactions
 * Use: Pressing cards, list items
 */
export const cardPress = () => {
  if (Platform.OS === 'ios') {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }
};

// Export as a single object for convenience
export const AppHaptics = {
  light: lightImpact,
  medium: mediumImpact,
  heavy: heavyImpact,
  soft: softImpact,
  selection,
  success,
  warning,
  error,
  pageFlip,
  cardPress,
};

export default AppHaptics;
