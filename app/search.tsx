
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, StyleSheet, TouchableOpacity, useColorScheme, ActivityIndicator } from "react-native";
import { HapticFeedback } from "../utils/haptics";
import * as Notifications from 'expo-notifications';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 40,
  },
  button: {
    backgroundColor: '#FFD60A',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 12,
    marginVertical: 10,
    width: '100%',
    maxWidth: 300,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    textAlign: 'center',
  },
  statusText: {
    fontSize: 14,
    color: '#FFD60A',
    marginTop: 20,
    textAlign: 'center',
  },
  loader: {
    marginLeft: 10,
  },
});

const NOTIFICATION_MESSAGES = [
  "💛 Celebrate the little moments that matter.",
  "New word? New book? New moment? Log it now!",
  "Every word counts! Log a new one today and watch them grow.",
  "Time to capture today's tiny win! 💛  Add a new word, book, or magical moment.",
];

export default function SearchScreen() {
  const colorScheme = useColorScheme();
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  const getRandomMessage = () => {
    return NOTIFICATION_MESSAGES[Math.floor(Math.random() * NOTIFICATION_MESSAGES.length)];
  };

  const triggerNotificationNow = async () => {
    if (isLoading) return;
    
    try {
      setIsLoading(true);
      setStatusMessage('');
      await HapticFeedback.medium();
      
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "✨ Moment Reminder",
          body: getRandomMessage(),
          sound: true,
        },
        trigger: null, // Immediate
      });
      
      setStatusMessage('✅ Notification sent!');
      await HapticFeedback.success();
      
      setTimeout(() => setStatusMessage(''), 3000);
    } catch (error) {
      console.error('Error sending notification:', error);
      setStatusMessage('❌ Failed to send notification');
      await HapticFeedback.error();
      setTimeout(() => setStatusMessage(''), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const triggerNotificationDelayed = async () => {
    if (isLoading) return;
    
    try {
      setIsLoading(true);
      setStatusMessage('');
      await HapticFeedback.medium();
      
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "✨ Moment Reminder",
          body: getRandomMessage(),
          sound: true,
        },
        trigger: { seconds: 5 },
      });
      
      setStatusMessage('⏰ Notification scheduled for 5 seconds!');
      await HapticFeedback.success();
      
      setTimeout(() => setStatusMessage(''), 3000);
    } catch (error) {
      console.error('Error scheduling notification:', error);
      setStatusMessage('❌ Failed to schedule notification');
      await HapticFeedback.error();
      setTimeout(() => setStatusMessage(''), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.content}>
        <Text style={styles.title}>Search</Text>
        
        <TouchableOpacity 
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={triggerNotificationNow}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>Send Notification Now</Text>
          {isLoading && <ActivityIndicator size="small" color="#000" style={styles.loader} />}
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={triggerNotificationDelayed}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>Send Notification in 5s</Text>
          {isLoading && <ActivityIndicator size="small" color="#000" style={styles.loader} />}
        </TouchableOpacity>

        {statusMessage ? (
          <Text style={styles.statusText}>{statusMessage}</Text>
        ) : null}
      </View>
    </SafeAreaView>
  );
}
