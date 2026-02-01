/**
 * Story Card Component (Home Screen Version)
 * Compact story card for horizontal story sections
 */

import { StoryImage } from '@/components/ui/image-placeholder';
import { Radius, Shadows, Spacing, TextStyles } from '@/constants/theme';
import { useAppTheme } from '@/hooks/use-app-theme';
import { useRTL } from '@/hooks/use-rtl';
import { useUserStore } from '@/store/user-store';
import { Story } from '@/types';
import * as Haptics from 'expo-haptics';
import React from 'react';
import {
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from 'react-native-reanimated';

interface StoryCardProps {
  story: Story;
  onPress: () => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function StoryCard({ story, onPress }: StoryCardProps) {
  const { colors } = useAppTheme();
  const rtl = useRTL();
  const language = useUserStore((state) => state.language);
  const scale = useSharedValue(1);
  
  const storyName = language === 'ar' ? story.nameAr : story.nameEn;

  const handlePressIn = () => {
    scale.value = withSpring(0.96, { damping: 15, stiffness: 150 });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 150 });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[styles.container, animatedStyle, rtl.marginEnd(Spacing.md)]}
    >
      {/* Illustration */}
      <View style={styles.imageContainer}>
        <StoryImage
          storyId={story.id}
          width={140}
          height={100}
          category={story.category}
          borderRadius={Radius.md}
        />
      </View>

      {/* Story Title */}
      <Text
        style={[styles.storyTitle, { color: colors.text, textAlign: rtl.textAlign }]}
        numberOfLines={2}
      >
        {storyName}
      </Text>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 140,
  },
  imageContainer: {
    width: 140,
    height: 100,
    borderRadius: Radius.md,
    overflow: 'hidden',
    marginBottom: Spacing.xs,
    ...Shadows.sm,
  },
  storyTitle: {
    ...TextStyles.bodySmall,
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 18,
  },
});
