/**
 * Tabs Layout
 * Bottom tab navigation for main app screens
 */

import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useAppTheme } from '@/hooks/use-app-theme';
import { useTranslation } from '@/hooks/use-translation';

import { useRTL } from '@/hooks/use-rtl';

export default function TabLayout() {
  const { colors } = useAppTheme();
  const { t } = useTranslation();
  const rtl = useRTL();

  const tabs = [
    {
      name: 'index',
      title: t('navigation.home'),
      icon: 'house.fill',
    },
    {
      name: 'explore',
      title: t('navigation.progress'),
      icon: 'chart.bar.fill',
    },
    {
      name: 'settings',
      title: t('navigation.settings'),
      icon: 'gearshape.fill',
    },
  ];

  // Manually reorder tabs for RTL if the system hasn't done it yet
  const orderedTabs = rtl.isRTL && !rtl.isSystemRTL ? [...tabs].reverse() : tabs;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.tabIconDefault,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          backgroundColor: colors.backgroundCard,
          borderTopColor: colors.border,
          borderTopWidth: 0.5,
        },
      }}
    >
      {orderedTabs.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: tab.title,
            tabBarIcon: ({ color }) => (
              <IconSymbol size={28} name={tab.icon as any} color={color} />
            ),
          }}
        />
      ))}
    </Tabs>
  );
}
