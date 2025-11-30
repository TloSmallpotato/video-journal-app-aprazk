
import React, { createContext, useContext, useState, useEffect } from 'react';
import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';

interface BiometricAuthContextType {
  isAuthenticated: boolean;
  isBiometricSupported: boolean;
  isBiometricEnrolled: boolean;
  authenticate: () => Promise<boolean>;
  logout: () => Promise<void>;
  checkBiometricSupport: () => Promise<void>;
}

const BiometricAuthContext = createContext<BiometricAuthContextType | undefined>(undefined);

const AUTH_KEY = 'biometric_auth_enabled';
const SESSION_KEY = 'biometric_session';

export function BiometricAuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isBiometricSupported, setIsBiometricSupported] = useState(false);
  const [isBiometricEnrolled, setIsBiometricEnrolled] = useState(false);

  const checkBiometricSupport = async () => {
    try {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      setIsBiometricSupported(compatible);
      console.log('Biometric hardware available:', compatible);

      if (compatible) {
        const enrolled = await LocalAuthentication.isEnrolledAsync();
        setIsBiometricEnrolled(enrolled);
        console.log('Biometric enrolled:', enrolled);

        const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
        console.log('Supported authentication types:', types);
      }
    } catch (error) {
      console.error('Error checking biometric support:', error);
      setIsBiometricSupported(false);
      setIsBiometricEnrolled(false);
    }
  };

  const authenticate = async (): Promise<boolean> => {
    try {
      if (!isBiometricSupported || !isBiometricEnrolled) {
        console.log('Biometric not supported or not enrolled, allowing access');
        setIsAuthenticated(true);
        await SecureStore.setItemAsync(SESSION_KEY, 'authenticated');
        return true;
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Authenticate to access your Video Journal',
        fallbackLabel: 'Use Passcode',
        cancelLabel: 'Cancel',
        disableDeviceFallback: false,
      });

      console.log('Authentication result:', result);

      if (result.success) {
        setIsAuthenticated(true);
        await SecureStore.setItemAsync(SESSION_KEY, 'authenticated');
        return true;
      } else {
        console.log('Authentication failed:', result.error);
        return false;
      }
    } catch (error) {
      console.error('Authentication error:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      setIsAuthenticated(false);
      await SecureStore.deleteItemAsync(SESSION_KEY);
      console.log('Logged out successfully');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  useEffect(() => {
    checkBiometricSupport();
  }, []);

  return (
    <BiometricAuthContext.Provider
      value={{
        isAuthenticated,
        isBiometricSupported,
        isBiometricEnrolled,
        authenticate,
        logout,
        checkBiometricSupport,
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
