
import { View, Text, StyleSheet, TouchableOpacity, useColorScheme, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Notifications from 'expo-notifications';
import React, { useState } from "react";
import { HapticFeedback } from "../utils/haptics";

const NOTIFICATION_MESSAGES = [
  "💛 Celebrate the little moments that matter.",
  "New word? New book? New moment? Log it now!",
  "Every word counts! Log a new one today and watch them grow.",
  "Time to capture today's tiny win! 💛 Add a new word, book, or magical moment."
];

export default function SearchScreen() {
  const colorScheme = useColorScheme();
  const [isLoadingNow, setIsLoadingNow] = useState(false);
  const [isLoadingDelayed, setIsLoadingDelayed] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  const getRandomMessage = () => {
    return NOTIFICATION_MESSAGES[Math.floor(Math.random() * NOTIFICATION_MESSAGES.length)];
  };

  const triggerNotificationNow = async () => {
    try {
      setIsLoadingNow(true);
      setStatusMessage('');
      await HapticFeedback.medium();
      
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Natively",
          body: getRandomMessage(),
        },
        trigger: null, // null means immediate
      });
      
      setStatusMessage('✅ Notification sent!');
      await HapticFeedback.success();
      setTimeout(() => setStatusMessage(''), 3000);
    } catch (error) {
      console.error('Error scheduling notification:', error);
      setStatusMessage('❌ Failed to send notification');
      await HapticFeedback.error();
      setTimeout(() => setStatusMessage(''), 3000);
    } finally {
      setIsLoadingNow(false);
    }
  };

  const triggerNotificationDelayed = async () => {
    try {
      setIsLoadingDelayed(true);
      setStatusMessage('');
      await HapticFeedback.medium();
      
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Natively",
          body: getRandomMessage(),
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
          seconds: 5,
        },
      });
      
      setStatusMessage('✅ Notification scheduled for 5s!');
      await HapticFeedback.success();
      setTimeout(() => setStatusMessage(''), 3000);
    } catch (error) {
      console.error('Error scheduling notification:', error);
      setStatusMessage('❌ Failed to schedule notification');
      await HapticFeedback.error();
      setTimeout(() => setStatusMessage(''), 3000);
    } finally {
      setIsLoadingDelayed(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colorScheme === 'dark' ? '#000' : '#fff' }]}>
      <Text style={[styles.title, { color: colorScheme === 'dark' ? '#fff' : '#000' }]}>Search</Text>
      
      {statusMessage ? (
        <Text style={[styles.statusMessage, { color: colorScheme === 'dark' ? '#fff' : '#000' }]}>{statusMessage}</Text>
      ) : null}

      <TouchableOpacity
        style={[styles.notificationButton, { opacity: isLoadingNow ? 0.6 : 1 }]}
        onPress={triggerNotificationNow}
        disabled={isLoadingNow}
      >
        {isLoadingNow ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Send Notification Now</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.notificationButton, { opacity: isLoadingDelayed ? 0.6 : 1 }]}
        onPress={triggerNotificationDelayed}
        disabled={isLoadingDelayed}
      >
        {isLoadingDelayed ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Send Notification in 5s</Text>
        )}
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 32,
  },
  statusMessage: {
    fontSize: 16,
    marginBottom: 16,
    textAlign: 'center',
  },
  notificationButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 16,
    minWidth: 250,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
