
import React from 'react';
import { NativeTabs, Icon, Label } from 'expo-router/unstable-native-tabs';
import { Platform } from 'react-native';

export default function TabLayout() {
  return (
    <NativeTabs
      backgroundColor="#C8BFDB"
      tintColor="#2E2A8B"
      iconColor="#2E2A8B"
      labelStyle={{
        color: '#2E2A8B',
        fontSize: 10,
      }}
      disableIndicator={false}
      indicatorColor="#2E2A8B"
    >
      <NativeTabs.Trigger key="books" name="books">
        <Icon sf={{ default: 'book', selected: 'book.fill' }} />
        <Label>Books</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger key="words" name="words">
        <Icon sf={{ default: 'bubble.left', selected: 'bubble.left.fill' }} />
        <Label>Words</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger key="add" name="add">
        <Icon sf={{ default: 'plus.circle', selected: 'plus.circle.fill' }} />
        <Label>Add</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger key="play" name="play">
        <Icon sf={{ default: 'basketball', selected: 'basketball.fill' }} />
        <Label>Play</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger key="profile" name="profile">
        <Icon sf={{ default: 'face.smiling', selected: 'face.smiling' }} />
        <Label>Profile</Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
