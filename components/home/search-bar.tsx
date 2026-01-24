/**
 * Search Bar Component
 * Search input for finding stories
 */

import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
} from 'react-native';
import { useAppTheme } from '@/hooks/use-app-theme';
import { useTranslation } from '@/hooks/use-translation';
import { Spacing, Radius, TextStyles } from '@/constants/theme';

interface SearchBarProps {
  onSearch?: (query: string) => void;
  onFocus?: () => void;
}

export function SearchBar({ onSearch, onFocus }: SearchBarProps) {
  const { colors } = useAppTheme();
  const { t } = useTranslation();
  const [query, setQuery] = React.useState('');

  const handleChangeText = (text: string) => {
    setQuery(text);
    onSearch?.(text);
  };

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.searchContainer,
          {
            backgroundColor: colors.backgroundCard,
            borderColor: colors.border,
          },
        ]}
      >
        <Text style={[styles.searchIcon, { color: colors.orangeAccent }]}>
          🔍
        </Text>
        <TextInput
          style={[styles.input, { color: colors.text }]}
          placeholder={t('home.searchPlaceholder')}
          placeholderTextColor={colors.textTertiary}
          value={query}
          onChangeText={handleChangeText}
          onFocus={onFocus}
          returnKeyType="search"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.xl,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    borderRadius: Radius.full,
    borderWidth: 1,
    paddingHorizontal: Spacing.md,
  },
  searchIcon: {
    fontSize: 20,
    marginRight: Spacing.sm,
  },
  input: {
    flex: 1,
    ...TextStyles.bodyMedium,
    fontSize: 16,
    padding: 0,
  },
});
