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
import { Spacing, TextStyles } from '@/constants/theme';
import { useAppTheme } from '@/hooks/use-app-theme';
import { useRTL } from '@/hooks/use-rtl';

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
  const rtl = useRTL();
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
        { flexDirection: rtl.row },
        !isLast && { borderBottomColor: colors.borderLight, borderBottomWidth: 0.5 },
      ]}
    >
      {/* Left side: Icon + Label */}
      <View style={[styles.leftContent, { flexDirection: rtl.row }]}>
        {icon && (
          <Text style={[
            styles.icon, 
            rtl.isRTL ? { marginLeft: Spacing.md } : { marginRight: Spacing.md }
          ]}>
            {icon}
          </Text>
        )}
        <View style={[styles.labelContainer, { alignItems: rtl.alignStart }]}>
          <Text style={[styles.label, { color: colors.text, textAlign: rtl.textAlign }]}>
            {label}
          </Text>
          {sublabel && (
            <Text style={[styles.sublabel, { color: colors.textTertiary, textAlign: rtl.textAlign }]}>
              {sublabel}
            </Text>
          )}
        </View>
      </View>

      {/* Right side: Value/Control */}
      <View style={[styles.rightContent, { flexDirection: rtl.row }]}>
        {props.type === 'navigation' && (
          <>
            {props.value && (
              <Text style={[
                styles.value, 
                { color: colors.textSecondary, textAlign: rtl.textAlignOpposite },
                rtl.isRTL ? { marginLeft: Spacing.xs } : { marginRight: Spacing.xs }
              ]}>
                {props.value}
              </Text>
            )}
            <Text style={[styles.chevron, { color: colors.textTertiary }]}>
              {rtl.isRTL ? '‹' : '›'}
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
          <Text style={[styles.value, { color: colors.textSecondary, textAlign: rtl.textAlignOpposite }]}>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    minHeight: 52,
  },
  leftContent: {
    alignItems: 'center',
    flex: 1,
  },
  icon: {
    fontSize: 22,
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
    alignItems: 'center',
  },
  value: {
    ...TextStyles.bodyMedium,
  },
  chevron: {
    fontSize: 22,
    fontWeight: '300',
  },
});
