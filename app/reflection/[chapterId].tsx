/**
 * ReflectionScreen
 * Post-reading reflection and notes
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { SafeAreaView } from '@/components/ui/safe-area-view';
import { Button } from '@/components/ui/button';
import { Spacing, TextStyles, Radius } from '@/constants/theme';
import { useAppTheme } from '@/hooks/use-app-theme';
import { useReadingStore } from '@/store/reading-store';
import { getChapterById } from '@/data/chapters';

export default function ReflectionScreen() {
  const { colors } = useAppTheme();
  const router = useRouter();
  const { chapterId } = useLocalSearchParams<{ chapterId: string }>();

  const { completeSession } = useReadingStore();

  const chapter = chapterId ? getChapterById(chapterId) : null;

  const [notes, setNotes] = useState('');
  const [isCompleting, setIsCompleting] = useState(false);

  if (!chapter) {
    return (
      <SafeAreaView>
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: colors.textSecondary }]}>
            Chapter not found
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const handleComplete = async () => {
    setIsCompleting(true);

    // Gentle haptic feedback
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    // Complete the session (this locks the chapter)
    completeSession(notes.trim() || undefined);

    // Small delay for smoother transition
    setTimeout(() => {
      router.replace('/');
    }, 300);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          style={styles.keyboardAvoid}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Header */}
            <Animated.View
              entering={FadeIn.duration(500)}
              style={styles.header}
            >
              <Text style={styles.headerEmoji}>🤍</Text>
              <Text style={[styles.headerTitle, { color: colors.text }]}>
                Time for Reflection
              </Text>
              <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
                Let the wisdom settle in your heart
              </Text>
            </Animated.View>

            {/* Ayah / Quote */}
            <Animated.View
              entering={FadeInDown.duration(500).delay(200)}
              style={[
                styles.quoteCard,
                {
                  backgroundColor: colors.primaryLight,
                  borderColor: colors.primary,
                },
              ]}
            >
              <Text style={[styles.quoteText, { color: colors.text }]}>
                "{chapter.relatedAyahOrQuote}"
              </Text>
            </Animated.View>

            {/* Reflection prompt */}
            <Animated.View
              entering={FadeInDown.duration(500).delay(400)}
              style={styles.promptSection}
            >
              <Text style={[styles.promptLabel, { color: colors.textSecondary }]}>
                Reflection Question
              </Text>
              <Text style={[styles.promptText, { color: colors.text }]}>
                {chapter.reflectionPrompt}
              </Text>
            </Animated.View>

            {/* Notes input */}
            <Animated.View
              entering={FadeInDown.duration(500).delay(600)}
              style={styles.notesSection}
            >
              <Text style={[styles.notesLabel, { color: colors.textSecondary }]}>
                Your Thoughts (Optional)
              </Text>
              <TextInput
                style={[
                  styles.notesInput,
                  {
                    backgroundColor: colors.backgroundCard,
                    borderColor: colors.border,
                    color: colors.text,
                  },
                ]}
                placeholder="Write down any thoughts or reflections..."
                placeholderTextColor={colors.textTertiary}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                value={notes}
                onChangeText={setNotes}
                maxLength={500}
              />
              <Text style={[styles.charCount, { color: colors.textTertiary }]}>
                {notes.length}/500
              </Text>
            </Animated.View>

            {/* Completion message */}
            <Animated.View
              entering={FadeInDown.duration(500).delay(800)}
              style={[
                styles.completionCard,
                { backgroundColor: colors.accentLight },
              ]}
            >
              <Text style={styles.completionEmoji}>✨</Text>
              <View style={styles.completionTextContainer}>
                <Text style={[styles.completionTitle, { color: colors.text }]}>
                  Session Complete
                </Text>
                <Text style={[styles.completionMessage, { color: colors.textSecondary }]}>
                  This chapter will be available again tomorrow. Take time to let today's lesson resonate.
                </Text>
              </View>
            </Animated.View>

            {/* Complete button */}
            <Animated.View
              entering={FadeInDown.duration(500).delay(1000)}
              style={styles.buttonContainer}
            >
              <Button
                title="Complete & Return Home"
                onPress={handleComplete}
                size="large"
                fullWidth
                loading={isCompleting}
              />
            </Animated.View>

            {/* Closing message */}
            <Animated.View
              entering={FadeInDown.duration(500).delay(1200)}
              style={styles.closingMessage}
            >
              <Text style={[styles.closingText, { color: colors.textTertiary }]}>
                جزاك الله خيرا
              </Text>
              <Text style={[styles.closingSubtext, { color: colors.textTertiary }]}>
                May Allah reward you with goodness
              </Text>
            </Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
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
  keyboardAvoid: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xxxl,
  },
  header: {
    alignItems: 'center',
    marginTop: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  headerEmoji: {
    fontSize: 48,
    marginBottom: Spacing.md,
  },
  headerTitle: {
    ...TextStyles.displayMedium,
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  headerSubtitle: {
    ...TextStyles.bodyMedium,
    textAlign: 'center',
  },
  quoteCard: {
    padding: Spacing.lg,
    borderRadius: Radius.lg,
    borderLeftWidth: 4,
    marginBottom: Spacing.xl,
  },
  quoteText: {
    ...TextStyles.bodyLarge,
    fontStyle: 'italic',
    lineHeight: 28,
  },
  promptSection: {
    marginBottom: Spacing.lg,
  },
  promptLabel: {
    ...TextStyles.labelSmall,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: Spacing.sm,
  },
  promptText: {
    ...TextStyles.bodyLarge,
    lineHeight: 28,
  },
  notesSection: {
    marginBottom: Spacing.lg,
  },
  notesLabel: {
    ...TextStyles.labelMedium,
    marginBottom: Spacing.sm,
  },
  notesInput: {
    borderWidth: 1,
    borderRadius: Radius.md,
    padding: Spacing.md,
    minHeight: 120,
    ...TextStyles.bodyMedium,
  },
  charCount: {
    ...TextStyles.labelSmall,
    textAlign: 'right',
    marginTop: Spacing.xs,
  },
  completionCard: {
    flexDirection: 'row',
    padding: Spacing.md,
    borderRadius: Radius.md,
    marginBottom: Spacing.xl,
  },
  completionEmoji: {
    fontSize: 24,
    marginRight: Spacing.md,
  },
  completionTextContainer: {
    flex: 1,
  },
  completionTitle: {
    ...TextStyles.labelMedium,
    marginBottom: Spacing.xs,
  },
  completionMessage: {
    ...TextStyles.bodySmall,
  },
  buttonContainer: {
    marginBottom: Spacing.xl,
  },
  closingMessage: {
    alignItems: 'center',
  },
  closingText: {
    ...TextStyles.arabicMedium,
    marginBottom: Spacing.xs,
  },
  closingSubtext: {
    ...TextStyles.bodySmall,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    ...TextStyles.bodyMedium,
  },
});
