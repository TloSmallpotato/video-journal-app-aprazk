
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  useColorScheme,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useBiometricAuth } from '../contexts/BiometricAuthContext';
import { router } from 'expo-router';
import { IconSymbol } from '../components/IconSymbol';
import { LinearGradient } from 'expo-linear-gradient';
import { HapticFeedback } from '../utils/haptics';

export default function AuthScreen() {
  const {
    isAuthenticated,
    isBiometricSupported,
    isBiometricEnrolled,
    isLoading,
    authenticate,
  } = useBiometricAuth();
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [hasAttemptedAuth, setHasAttemptedAuth] = useState(false);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  // Automatically trigger authentication when the screen loads
  useEffect(() => {
    if (!isLoading && !isAuthenticated && !hasAttemptedAuth) {
      console.log('Auto-triggering authentication on screen load');
      setHasAttemptedAuth(true);
      handleAuthenticate();
    }
  }, [isLoading, isAuthenticated, hasAttemptedAuth]);

  useEffect(() => {
    if (isAuthenticated) {
      console.log('User authenticated, navigating to profile');
      router.replace('/(tabs)/profile');
    }
  }, [isAuthenticated]);

  const handleAuthenticate = async () => {
    console.log('handleAuthenticate called');
    HapticFeedback.medium();
    setIsAuthenticating(true);
    setAuthError(null);

    const success = await authenticate();

    if (!success) {
      HapticFeedback.error();
      setAuthError('Authentication failed. Please try again.');
      console.log('Authentication failed in handleAuthenticate');
    } else {
      HapticFeedback.success();
      console.log('Authentication succeeded in handleAuthenticate');
    }

    setIsAuthenticating(false);
  };

  const handleSkip = () => {
    HapticFeedback.light();
    handleAuthenticate();
  };

  const getBiometricIcon = () => {
    if (Platform.OS === 'ios') {
      return 'faceid';
    }
    return 'fingerprint';
  };

  const getBiometricText = () => {
    if (!isBiometricSupported) {
      return 'Biometric authentication not available';
    }
    if (!isBiometricEnrolled) {
      return 'No biometric data enrolled';
    }
    if (Platform.OS === 'ios') {
      return 'Authenticate with Face ID or Touch ID';
    }
    return 'Authenticate with Fingerprint';
  };

  if (isLoading) {
    return (
      <LinearGradient
        colors={isDark ? ['#1a1a2e', '#16213e'] : ['#F5F1ED', '#E8E4DF']}
        style={styles.gradient}
      >
        <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
          <View style={styles.container}>
            <View style={styles.content}>
              <ActivityIndicator size="large" color={isDark ? '#FFFFFF' : '#2E2A8B'} />
              <Text style={[styles.loadingText, isDark && styles.loadingTextDark]}>
                Loading...
              </Text>
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={isDark ? ['#1a1a2e', '#16213e'] : ['#F5F1ED', '#E8E4DF']}
      style={styles.gradient}
    >
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        <View style={styles.container}>
          <View style={styles.content}>
            <View style={styles.iconContainer}>
              <IconSymbol
                ios_icon_name={getBiometricIcon()}
                android_material_icon_name={getBiometricIcon()}
                size={80}
                color={isDark ? '#FFFFFF' : '#2E2A8B'}
              />
            </View>

            <Text style={[styles.title, isDark && styles.titleDark]}>
              Video Journal
            </Text>

            <Text style={[styles.subtitle, isDark && styles.subtitleDark]}>
              {getBiometricText()}
            </Text>

            {authError && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{authError}</Text>
              </View>
            )}

            <TouchableOpacity
              style={[
                styles.button,
                isAuthenticating && styles.buttonDisabled,
                isDark && styles.buttonDark,
              ]}
              onPress={handleAuthenticate}
              disabled={isAuthenticating}
            >
              {isAuthenticating ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <IconSymbol
                  ios_icon_name={getBiometricIcon()}
                  android_material_icon_name={getBiometricIcon()}
                  size={24}
                  color="#FFFFFF"
                />
              )}
              <Text style={styles.buttonText}>
                {isAuthenticating ? 'Authenticating...' : 'Authenticate'}
              </Text>
            </TouchableOpacity>

            {!isBiometricSupported || !isBiometricEnrolled ? (
              <TouchableOpacity
                style={[styles.skipButton, isDark && styles.skipButtonDark]}
                onPress={handleSkip}
              >
                <Text style={[styles.skipButtonText, isDark && styles.skipButtonTextDark]}>
                  Continue without biometrics
                </Text>
              </TouchableOpacity>
            ) : null}
          </View>

          <View style={styles.footer}>
            <Text style={[styles.footerText, isDark && styles.footerTextDark]}>
              Your data is protected with biometric authentication
            </Text>
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? 48 : 0,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#2E2A8B',
  },
  loadingTextDark: {
    color: '#FFFFFF',
  },
  iconContainer: {
    marginBottom: 32,
    padding: 24,
    borderRadius: 100,
    backgroundColor: 'rgba(46, 42, 139, 0.1)',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#2E2A8B',
    marginBottom: 12,
    textAlign: 'center',
  },
  titleDark: {
    color: '#FFFFFF',
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 48,
    paddingHorizontal: 24,
  },
  subtitleDark: {
    color: '#CCCCCC',
  },
  errorContainer: {
    backgroundColor: 'rgba(255, 59, 48, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 24,
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 14,
    textAlign: 'center',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2E2A8B',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 16,
    minWidth: 250,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonDark: {
    backgroundColor: '#4A47A3',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  skipButton: {
    marginTop: 24,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  skipButtonDark: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
  },
  skipButtonText: {
    color: '#666666',
    fontSize: 16,
    textAlign: 'center',
  },
  skipButtonTextDark: {
    color: '#CCCCCC',
  },
  footer: {
    paddingHorizontal: 32,
    paddingBottom: 32,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#999999',
    textAlign: 'center',
  },
  footerTextDark: {
    color: '#888888',
  },
});
