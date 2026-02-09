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
import { useTranslation } from '@/hooks/use-translation';
import { useRTL } from '@/hooks/use-rtl';
import { useReadingStore } from '@/store/reading-store';
import { useUserStore } from '@/store/user-store';
import { getChapterById } from '@/data/chapters';

export default function ReflectionScreen() {
  const { colors } = useAppTheme();
  const { t } = useTranslation();
  const rtl = useRTL();
  const router = useRouter();
  const { chapterId } = useLocalSearchParams<{ chapterId: string }>();

  const { completeSession } = useReadingStore();
  const language = useUserStore((state) => state.language);

  const chapter = chapterId ? getChapterById(chapterId) : null;

  const quote = chapter && language === 'ar' && chapter.relatedAyahOrQuoteAr
    ? chapter.relatedAyahOrQuoteAr
    : chapter?.relatedAyahOrQuote ?? '';
  const prompt = chapter && language === 'ar' && chapter.reflectionPromptAr
    ? chapter.reflectionPromptAr
    : chapter?.reflectionPrompt ?? '';

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
                {t('reflection.title')}
              </Text>
              <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
                {t('reflection.subtitle')}
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
                rtl.isRTL ? { borderRightWidth: 4, borderLeftWidth: 0 } : { borderLeftWidth: 4, borderRightWidth: 0 },
              ]}
            >
              <Text style={[styles.quoteText, { color: colors.text, textAlign: rtl.textAlign }]}>
                "{quote}"
              </Text>
            </Animated.View>

            {/* Reflection prompt */}
            <Animated.View
              entering={FadeInDown.duration(500).delay(400)}
              style={[styles.promptSection, { alignItems: rtl.alignStart }]}
            >
              <Text style={[styles.promptLabel, { color: colors.textSecondary, textAlign: rtl.textAlign }]}>
                {t('reflection.reflectionQuestion')}
              </Text>
              <Text style={[styles.promptText, { color: colors.text, textAlign: rtl.textAlign }]}>
                {prompt}
              </Text>
            </Animated.View>

            {/* Notes input */}
            <Animated.View
              entering={FadeInDown.duration(500).delay(600)}
              style={[styles.notesSection, { alignItems: rtl.alignStart }]}
            >
              <Text style={[styles.notesLabel, { color: colors.textSecondary, textAlign: rtl.textAlign }]}>
                {t('reflection.yourThoughts')}
              </Text>
              <TextInput
                style={[
                  styles.notesInput,
                  {
                    backgroundColor: colors.backgroundCard,
                    borderColor: colors.border,
                    color: colors.text,
                    textAlign: rtl.textAlign,
                    writingDirection: rtl.writingDirection,
                  },
                ]}
                placeholder={t('reflection.placeholder')}
                placeholderTextColor={colors.textTertiary}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                value={notes}
                onChangeText={setNotes}
                maxLength={500}
              />
              <Text style={[styles.charCount, { color: colors.textTertiary, textAlign: rtl.textAlignOpposite }]}>
                {t('reflection.charCount', { current: notes.length })}
              </Text>
            </Animated.View>

            {/* Completion message */}
            <Animated.View
              entering={FadeInDown.duration(500).delay(800)}
              style={[
                styles.completionCard,
                { backgroundColor: colors.accentLight, flexDirection: rtl.row },
              ]}
            >
              <Text style={[styles.completionEmoji, rtl.marginEnd(Spacing.md)]}>✨</Text>
              <View style={styles.completionTextContainer}>
                <Text style={[styles.completionTitle, { color: colors.text, textAlign: rtl.textAlign }]}>
                  {t('reflection.sessionComplete')}
                </Text>
                <Text style={[styles.completionMessage, { color: colors.textSecondary, textAlign: rtl.textAlign }]}>
                  {t('reflection.unlockMessage')}
                </Text>
              </View>
            </Animated.View>

            {/* Complete button */}
            <Animated.View
              entering={FadeInDown.duration(500).delay(1000)}
              style={styles.buttonContainer}
            >
              <Button
                title={t('reflection.complete')}
                onPress={handleComplete}
                size="large"
                fullWidth
                loading={isCompleting}
              />
            </Animated.View>

            {/* Closing message */}
            <Animated.View
              entering={FadeInDown.duration(500).delay(1200)}
              style={[styles.closingMessage, { alignItems: rtl.alignStart }]}
            >
              <Text style={[styles.closingText, { color: colors.textTertiary, textAlign: rtl.textAlign }]}>
                {t('reflection.jazakAllah')}
              </Text>
              <Text style={[styles.closingSubtext, { color: colors.textTertiary, textAlign: rtl.textAlign }]}>
                {t('reflection.jazakAllahEn')}
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
    alignSelf: 'stretch',
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
    alignSelf: 'stretch',
    width: '100%',
    ...TextStyles.bodyMedium,
  },
  charCount: {
    ...TextStyles.labelSmall,
    marginTop: Spacing.xs,
  },
  completionCard: {
    padding: Spacing.md,
    borderRadius: Radius.md,
    marginBottom: Spacing.xl,
  },
  completionEmoji: {
    fontSize: 24,
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
