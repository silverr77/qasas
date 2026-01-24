/**
 * Category Button Component
 * Individual category button for home screen
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
import { Spacing, Radius, Shadows } from '@/constants/theme';
import { StoryCategory } from '@/types';

interface CategoryButtonProps {
  category: StoryCategory | 'all';
  onPress: () => void;
}

const categoryConfig: Record<StoryCategory | 'all', {
  icon: string;
  color: string;
  lightColor: string;
  labelKey: string;
}> = {
  prophets: {
    icon: '🌙',
    color: '#739A7B',
    lightColor: '#E8F0EA',
    labelKey: 'categories.prophets',
  },
  sahabah: {
    icon: '⭐',
    color: '#E8B130',
    lightColor: '#FDF8E8',
    labelKey: 'categories.sahabah',
  },
  educational: {
    icon: '📚',
    color: '#4A7C7E',
    lightColor: '#E8F0F2',
    labelKey: 'categories.educational',
  },
  all: {
    icon: '📖',
    color: '#FF6B35',
    lightColor: '#FFF4F0',
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
    scale.value = withSpring(0.95, { damping: 15, stiffness: 150 });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 150 });
  };

  const handlePress = () => {
    onPress();
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const bgColor = isDark
    ? (category === 'prophets' ? colors.categoryProphetsLight :
       category === 'sahabah' ? colors.categorySahabahLight :
       category === 'educational' ? colors.categoryEducationalLight :
       colors.accentLight)
    : config.lightColor;

  return (
    <AnimatedPressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[styles.container, animatedStyle, rtl.marginEnd(Spacing.md)]}
    >
      <View
        style={[
          styles.button,
          {
            backgroundColor: bgColor,
          },
        ]}
      >
        <Text style={styles.icon}>{config.icon}</Text>
        <Text
          style={[
            styles.label,
            { color: colors.text },
          ]}
          numberOfLines={1}
        >
          {t(config.labelKey)}
        </Text>
      </View>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  container: {
    // marginEnd is applied dynamically via rtl.marginEnd
  },
  button: {
    width: 100,
    height: 120,
    borderRadius: Radius.md,
    padding: Spacing.lg,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.sm,
  },
  icon: {
    fontSize: 48,
    marginBottom: Spacing.sm,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
});
