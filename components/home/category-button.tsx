/**
 * Category Button Component
 * Circular category button for home screen (matching design)
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useAppTheme } from '@/hooks/use-app-theme';
import { useTranslation } from '@/hooks/use-translation';
import { useRTL } from '@/hooks/use-rtl';
import { Spacing, Radius } from '@/constants/theme';
import { StoryCategory } from '@/types';

interface CategoryButtonProps {
  category: StoryCategory | 'all';
  onPress: () => void;
}

const categoryConfig: Record<StoryCategory | 'all', {
  icon: string;
  color: string;
  lightColor: string;
  borderColor: string;
  labelKey: string;
}> = {
  prophets: {
    icon: '🌴',
    color: '#739A7B',
    lightColor: '#E8F5E9',
    borderColor: '#A5D6A7',
    labelKey: 'categories.prophets',
  },
  sahabah: {
    icon: '🐪',
    color: '#F9A825',
    lightColor: '#FFF8E1',
    borderColor: '#FFD54F',
    labelKey: 'categories.sahabah',
  },
  educational: {
    icon: '🌿',
    color: '#26A69A',
    lightColor: '#E0F2F1',
    borderColor: '#80CBC4',
    labelKey: 'categories.educational',
  },
  all: {
    icon: '💖',
    color: '#EC407A',
    lightColor: '#FCE4EC',
    borderColor: '#F48FB1',
    labelKey: 'categories.allStories',
  },
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function CategoryButton({ category, onPress }: CategoryButtonProps) {
  const { colors, isDark } = useAppTheme();
  const { t } = useTranslation();
  const rtl = useRTL();
  const config = categoryConfig[category];
  const scale = useSharedValue(1);

  const handlePressIn = () => {
    scale.value = withSpring(0.92, { damping: 15, stiffness: 150 });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 150 });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const bgColor = isDark ? colors.backgroundCard : config.lightColor;
  const borderColor = isDark ? colors.border : config.borderColor;

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[styles.container, animatedStyle, rtl.marginEnd(Spacing.md)]}
    >
      {/* Circular Icon Container */}
      <View
        style={[
          styles.iconCircle,
          {
            backgroundColor: bgColor,
            borderColor: borderColor,
          },
        ]}
      >
        <Text style={styles.icon}>{config.icon}</Text>
      </View>

      {/* Label */}
      <Text
        style={[styles.label, { color: colors.text }]}
        numberOfLines={1}
      >
        {t(config.labelKey)}
      </Text>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: 80,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    marginBottom: Spacing.xs,
  },
  icon: {
    fontSize: 28,
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
});
