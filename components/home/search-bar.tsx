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
} from 'react-native';
import { useAppTheme } from '@/hooks/use-app-theme';
import { useTranslation } from '@/hooks/use-translation';
import { useRTL } from '@/hooks/use-rtl';
import { Spacing, Radius, TextStyles } from '@/constants/theme';

interface SearchBarProps {
  onSearch?: (query: string) => void;
  onFocus?: () => void;
}

export function SearchBar({ onSearch, onFocus }: SearchBarProps) {
  const { colors } = useAppTheme();
  const { t } = useTranslation();
  const rtl = useRTL();
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
            flexDirection: rtl.row,
          },
        ]}
      >
        <View style={[
          styles.iconWrapper,
          rtl.isRTL ? { marginLeft: Spacing.sm } : { marginRight: Spacing.sm }
        ]}>
          <Text style={[styles.searchIcon, { color: colors.orangeAccent }]}>
            🔍
          </Text>
        </View>
        <TextInput
          style={[
            styles.input, 
            { 
              color: colors.text,
              textAlign: rtl.textAlign,
              writingDirection: rtl.writingDirection,
            }
          ]}
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
    alignItems: 'center',
    height: 48,
    borderRadius: Radius.full,
    borderWidth: 1,
    paddingHorizontal: Spacing.md,
  },
  iconWrapper: {
    // Margin applied dynamically based on RTL
  },
  searchIcon: {
    fontSize: 20,
  },
  input: {
    flex: 1,
    ...TextStyles.bodyMedium,
    fontSize: 16,
    padding: 0,
  },
});
