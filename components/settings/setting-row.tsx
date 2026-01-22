/**
 * SettingRow Component
 * Individual setting row with various control types
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Switch,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { Colors, Spacing, TextStyles } from '@/constants/theme';
import { useAppTheme } from '@/hooks/use-app-theme';

interface BaseSettingRowProps {
  label: string;
  sublabel?: string;
  icon?: string;
  isLast?: boolean;
}

interface NavigationRowProps extends BaseSettingRowProps {
  type: 'navigation';
  value?: string;
  onPress: () => void;
}

interface ToggleRowProps extends BaseSettingRowProps {
  type: 'toggle';
  value: boolean;
  onValueChange: (value: boolean) => void;
}

interface StaticRowProps extends BaseSettingRowProps {
  type: 'static';
  value: string;
}

type SettingRowProps = NavigationRowProps | ToggleRowProps | StaticRowProps;

export function SettingRow(props: SettingRowProps) {
  const { colors } = useAppTheme();
  const { label, sublabel, icon, isLast = false } = props;

  const handlePress = () => {
    if (props.type === 'navigation') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      props.onPress();
    }
  };

  const handleToggle = (value: boolean) => {
    if (props.type === 'toggle') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      props.onValueChange(value);
    }
  };

  const content = (
    <View
      style={[
        styles.container,
        !isLast && { borderBottomColor: colors.borderLight, borderBottomWidth: 0.5 },
      ]}
    >
      {/* Left side: Icon + Label */}
      <View style={styles.leftContent}>
        {icon && <Text style={styles.icon}>{icon}</Text>}
        <View style={styles.labelContainer}>
          <Text style={[styles.label, { color: colors.text }]}>
            {label}
          </Text>
          {sublabel && (
            <Text style={[styles.sublabel, { color: colors.textTertiary }]}>
              {sublabel}
            </Text>
          )}
        </View>
      </View>

      {/* Right side: Value/Control */}
      <View style={styles.rightContent}>
        {props.type === 'navigation' && (
          <>
            {props.value && (
              <Text style={[styles.value, { color: colors.textSecondary }]}>
                {props.value}
              </Text>
            )}
            <Text style={[styles.chevron, { color: colors.textTertiary }]}>
              ›
            </Text>
          </>
        )}

        {props.type === 'toggle' && (
          <Switch
            value={props.value}
            onValueChange={handleToggle}
            trackColor={{
              false: colors.borderLight,
              true: colors.primary,
            }}
            thumbColor="#FFFFFF"
            ios_backgroundColor={colors.borderLight}
          />
        )}

        {props.type === 'static' && (
          <Text style={[styles.value, { color: colors.textSecondary }]}>
            {props.value}
          </Text>
        )}
      </View>
    </View>
  );

  if (props.type === 'navigation') {
    return (
      <Pressable
        onPress={handlePress}
        style={({ pressed }) => [
          { opacity: pressed ? 0.7 : 1 },
        ]}
        accessibilityRole="button"
        accessibilityLabel={label}
        accessibilityHint={`Navigate to ${label} settings`}
      >
        {content}
      </Pressable>
    );
  }

  return content;
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    minHeight: 52,
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  icon: {
    fontSize: 22,
    marginRight: Spacing.md,
  },
  labelContainer: {
    flex: 1,
  },
  label: {
    ...TextStyles.bodyMedium,
  },
  sublabel: {
    ...TextStyles.bodySmall,
    marginTop: 2,
  },
  rightContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  value: {
    ...TextStyles.bodyMedium,
    marginRight: Spacing.xs,
  },
  chevron: {
    fontSize: 22,
    fontWeight: '300',
  },
});
