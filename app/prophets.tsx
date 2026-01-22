/**
 * ProphetsScreen
 * List of all prophets to choose from
 */

import React from 'react';
import {
  View,
  StyleSheet,
  FlatList,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from '@/components/ui/safe-area-view';
import { ScreenHeader } from '@/components/ui/screen-header';
import { ProphetCard } from '@/components/prophet-card';
import { Spacing } from '@/constants/theme';
import { useAppTheme } from '@/hooks/use-app-theme';
import { prophets } from '@/data/prophets';
import { getChaptersByProphetId } from '@/data/chapters';
import { Prophet } from '@/types';

export default function ProphetsScreen() {
  const { colors } = useAppTheme();
  const router = useRouter();

  const handleProphetPress = (prophet: Prophet) => {
    router.push(`/chapters/${prophet.id}`);
  };

  const renderProphet = ({ item }: { item: Prophet }) => {
    const chapters = getChaptersByProphetId(item.id);
    return (
      <ProphetCard
        prophet={item}
        onPress={() => handleProphetPress(item)}
        chaptersCount={chapters.length}
      />
    );
  };

  return (
    <SafeAreaView edges={['top']}>
      <ScreenHeader
        title="Prophets"
        titleAr="الأنبياء"
        showBack
      />

      <FlatList
        data={prophets}
        keyExtractor={(item) => item.id}
        renderItem={renderProphet}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  listContent: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xxxl,
  },
});
