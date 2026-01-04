
import { SafeAreaView } from 'react-native-safe-area-context';
import { HapticFeedback } from '../utils/haptics';
import { IconSymbol } from '../components/IconSymbol';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  useColorScheme,
  ActivityIndicator,
} from 'react-native';
import { useBiometricAuth } from '../contexts/BiometricAuthContext';
import React, { useEffect, useState } from 'react';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginBottom: 60,
  },
  button: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 30,
    marginBottom: 16,
    minWidth: 200,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#007AFF',
  },
  skipButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  skipButtonText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
  },
});

export default function AuthScreen() {
  const { authenticate, isLoading, isAuthenticated, hasAttemptedAuth } = useBiometricAuth();
  const [localLoading, setLocalLoading] = useState(false);
  const colorScheme = useColorScheme();

  // Redirect to web on web platform
  useEffect(() => {
    if (Platform.OS === 'web') {
      router.replace('/(tabs)/profile');
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated && hasAttemptedAuth) {
      router.replace('/(tabs)/profile');
    }
  }, [isAuthenticated, hasAttemptedAuth]);

  const handleAuthenticate = async () => {
    setLocalLoading(true);
    await HapticFeedback.medium();
    await authenticate();
    setLocalLoading(false);
  };

  const handleSkip = async () => {
    await HapticFeedback.light();
    router.replace('/(tabs)/profile');
  };

  const getBiometricIcon = () => {
    if (Platform.OS === 'ios') {
      return 'faceid';
    }
    return 'fingerprint';
  };

  const getBiometricText = () => {
    if (Platform.OS === 'ios') {
      return 'Face ID';
    }
    return 'Fingerprint';
  };

  // Don't render on web
  if (Platform.OS === 'web') {
    return null;
  }

  return (
    <LinearGradient
      colors={colorScheme === 'dark' ? ['#1a1a2e', '#16213e', '#0f3460'] : ['#667eea', '#764ba2', '#f093fb']}
      style={styles.container}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <IconSymbol
              ios_icon_name={getBiometricIcon()}
              android_material_icon_name={getBiometricIcon()}
              size={60}
              color="#FFFFFF"
            />
          </View>

          <Text style={styles.title}>Unlock with {getBiometricText()}</Text>
          <Text style={styles.subtitle}>
            Use {getBiometricText()} to securely access your account
          </Text>

          <TouchableOpacity
            style={styles.button}
            onPress={handleAuthenticate}
            disabled={isLoading || localLoading}
          >
            {isLoading || localLoading ? (
              <ActivityIndicator color="#007AFF" />
            ) : (
              <Text style={styles.buttonText}>Authenticate</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
            <Text style={styles.skipButtonText}>Skip for now</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}
