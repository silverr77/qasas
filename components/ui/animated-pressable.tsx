/**
 * AnimatedPressable Component
 * Pressable with scale animation feedback
 */

import React from 'react';
import { Pressable, PressableProps, ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import AppHaptics from '@/utils/haptics';

const AnimatedPressableView = Animated.createAnimatedComponent(Pressable);

interface AnimatedPressableProps extends PressableProps {
  children: React.ReactNode;
  style?: ViewStyle;
  scaleValue?: number;
  haptic?: 'light' | 'medium' | 'selection' | 'none';
}

export function AnimatedPressable({
  children,
  style,
  onPress,
  scaleValue = 0.98,
  haptic = 'light',
  ...props
}: AnimatedPressableProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(scaleValue, {
      damping: 15,
      stiffness: 400,
    });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, {
      damping: 15,
      stiffness: 400,
    });
  };

  const handlePress = (event: any) => {
    if (haptic !== 'none') {
      switch (haptic) {
        case 'light':
          AppHaptics.light();
          break;
        case 'medium':
          AppHaptics.medium();
          break;
        case 'selection':
          AppHaptics.selection();
          break;
      }
    }
    onPress?.(event);
  };

  return (
    <AnimatedPressableView
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
      style={[style, animatedStyle]}
      {...props}
    >
      {children}
    </AnimatedPressableView>
  );
}
