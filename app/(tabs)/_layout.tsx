
import React from 'react';
import { Stack } from 'expo-router';
import FloatingTabBar, { TabBarItem } from '@/components/FloatingTabBar';

export default function TabLayout() {
  // Define the tabs configuration matching the design
  const tabs: TabBarItem[] = [
    {
      name: 'books',
      route: '/(tabs)/books',
      icon: 'menu-book',
      label: 'Books',
    },
    {
      name: 'words',
      route: '/(tabs)/words',
      icon: 'chat-bubble-outline',
      label: 'Words',
    },
    {
      name: 'add',
      route: '/(tabs)/add',
      icon: 'add',
      label: 'Add',
      isCenter: true,
    },
    {
      name: 'play',
      route: '/(tabs)/play',
      icon: 'sports-basketball',
      label: 'Play',
    },
    {
      name: 'profile',
      route: '/(tabs)/profile',
      icon: 'emoji-emotions',
      label: 'Profile',
    },
  ];

  // For Android and Web, use Stack navigation with custom floating tab bar
  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'none',
        }}
        initialRouteName="profile"
      >
        <Stack.Screen key="books" name="books" />
        <Stack.Screen key="words" name="words" />
        <Stack.Screen key="add" name="add" />
        <Stack.Screen key="play" name="play" />
        <Stack.Screen key="profile" name="profile" />
      </Stack>
      <FloatingTabBar tabs={tabs} />
    </>
  );
}
