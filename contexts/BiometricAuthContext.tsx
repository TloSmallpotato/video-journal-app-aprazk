
import React, { createContext, useContext, useState, useEffect } from 'react';
import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';
import { Platform, Alert } from 'react-native';

interface BiometricAuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  hasAttemptedAuth: boolean;
  authenticate: () => Promise<boolean>;
  isBiometricAvailable: boolean;
  biometricType: string | null;
}

const BiometricAuthContext = createContext<BiometricAuthContextType | undefined>(undefined);

export function BiometricAuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasAttemptedAuth, setHasAttemptedAuth] = useState(false);
  const [isBiometricAvailable, setIsBiometricAvailable] = useState(false);
  const [biometricType, setBiometricType] = useState<string | null>(null);

  useEffect(() => {
    checkBiometricAvailability();
  }, []);

  const checkBiometricAvailability = async () => {
    // Biometrics not available on web
    if (Platform.OS === 'web') {
      setIsBiometricAvailable(false);
      return;
    }

    try {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      const enrolled = await LocalAuthentication.isEnrolledAsync();
      const available = compatible && enrolled;
      
      setIsBiometricAvailable(available);

      if (available) {
        const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
        if (types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
          setBiometricType('Face ID');
        } else if (types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
          setBiometricType('Touch ID');
        } else {
          setBiometricType('Biometric');
        }
      }
    } catch (error) {
      console.error('Error checking biometric availability:', error);
      setIsBiometricAvailable(false);
    }
  };

  const authenticate = async (): Promise<boolean> => {
    // Skip biometric auth on web
    if (Platform.OS === 'web') {
      setIsAuthenticated(true);
      setHasAttemptedAuth(true);
      return true;
    }

    if (!isBiometricAvailable) {
      Alert.alert(
        'Biometric Authentication Unavailable',
        'Please set up Face ID or Touch ID in your device settings.'
      );
      return false;
    }

    setIsLoading(true);
    setHasAttemptedAuth(true);

    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Authenticate to continue',
        fallbackLabel: 'Use Passcode',
        disableDeviceFallback: false,
      });

      if (result.success) {
        setIsAuthenticated(true);
        await SecureStore.setItemAsync('biometric_authenticated', 'true');
        setIsLoading(false);
        return true;
      } else {
        setIsAuthenticated(false);
        setIsLoading(false);
        return false;
      }
    } catch (error) {
      console.error('Biometric authentication error:', error);
      setIsAuthenticated(false);
      setIsLoading(false);
      return false;
    }
  };

  return (
    <BiometricAuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        hasAttemptedAuth,
        authenticate,
        isBiometricAvailable,
        biometricType,
      }}
    >
      {children}
    </BiometricAuthContext.Provider>
  );
}

export function useBiometricAuth() {
  const context = useContext(BiometricAuthContext);
  if (context === undefined) {
    throw new Error('useBiometricAuth must be used within a BiometricAuthProvider');
  }
  return context;
}
