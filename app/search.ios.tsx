
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, StyleSheet, TouchableOpacity, useColorScheme, ActivityIndicator } from "react-native";
import { HapticFeedback } from "../utils/haptics";
import * as Notifications from 'expo-notifications';

const NOTIFICATION_MESSAGES = [
  "💛 Celebrate the little moments that matter.",
  "New word? New book? New moment? Log it now!",
  "Every word counts! Log a new one today and watch them grow.",
  "Time to capture today's tiny win! 💛  Add a new word, book, or magical moment.",
];

export default function SearchScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
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
    <SafeAreaView 
      style={[styles.safeArea, { backgroundColor: isDark ? '#1a1a2e' : '#F5F1ED' }]} 
      edges={['top']}
    >
      <View style={styles.container}>
        <Text style={[styles.searchText, isDark && styles.searchTextDark]}>Search</Text>
        
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
          <Text style={[styles.statusText, isDark && styles.statusTextDark]}>{statusMessage}</Text>
        ) : null}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  searchText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#2E2A8B',
    marginBottom: 40,
  },
  searchTextDark: {
    color: '#FFFFFF',
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
    color: '#2E2A8B',
    marginTop: 20,
    textAlign: 'center',
    fontWeight: '500',
  },
  statusTextDark: {
    color: '#FFD60A',
  },
  loader: {
    marginLeft: 10,
  },
});
