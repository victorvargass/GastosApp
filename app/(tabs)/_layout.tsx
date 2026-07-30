import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="period"
        options={{
          title: 'Período',
          tabBarLabel: 'Período',
          tabBarIcon: ({ color }) => <Ionicons name="pie-chart" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="incomes"
        options={{
          title: 'Ingresos',
          tabBarLabel: 'Ingresos',
          tabBarIcon: ({ color }) => <Ionicons name="cash" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="expenses"
        options={{
          title: 'Gastos',
          tabBarLabel: 'Gastos',
          tabBarIcon: ({ color }) => <Ionicons name="cash-outline" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="categories"
        options={{
          title: 'Categorías',
          tabBarLabel: 'Categorías',
          tabBarIcon: ({ color }) => <Ionicons name="pricetag" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="summary"
        options={{
          title: 'Resumen',
          tabBarLabel: 'Resumen',
          tabBarIcon: ({ color }) => <Ionicons name="bar-chart" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
