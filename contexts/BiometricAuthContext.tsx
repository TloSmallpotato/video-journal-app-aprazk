
import React, { createContext, useContext, useState, useEffect } from 'react';
import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';

interface BiometricAuthContextType {
  isAuthenticated: boolean;
  isBiometricSupported: boolean;
  isBiometricEnrolled: boolean;
  isLoading: boolean;
  authenticate: () => Promise<boolean>;
  logout: () => Promise<void>;
  checkBiometricSupport: () => Promise<void>;
}

const BiometricAuthContext = createContext<BiometricAuthContextType | undefined>(undefined);

const SESSION_KEY = 'biometric_session';

export function BiometricAuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isBiometricSupported, setIsBiometricSupported] = useState(false);
  const [isBiometricEnrolled, setIsBiometricEnrolled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

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

  const checkExistingSession = async () => {
    try {
      const session = await SecureStore.getItemAsync(SESSION_KEY);
      if (session === 'authenticated') {
        console.log('Found existing session');
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Error checking existing session:', error);
    }
  };

  const authenticate = async (): Promise<boolean> => {
    try {
      // If biometrics are not available, allow access without authentication
      if (!isBiometricSupported || !isBiometricEnrolled) {
        console.log('Biometric not supported or not enrolled, allowing access without authentication');
        setIsAuthenticated(true);
        await SecureStore.setItemAsync(SESSION_KEY, 'authenticated');
        return true;
      }

      // Biometrics ARE available, so we MUST authenticate with Face ID/Touch ID
      console.log('Biometrics available, triggering authentication...');
      
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Authenticate to access your Video Journal',
        fallbackLabel: 'Use Passcode',
        cancelLabel: 'Cancel',
        disableDeviceFallback: false, // Allow fallback to device passcode
      });

      console.log('Authentication result:', result);

      if (result.success) {
        console.log('Authentication successful!');
        setIsAuthenticated(true);
        await SecureStore.setItemAsync(SESSION_KEY, 'authenticated');
        return true;
      } else {
        console.log('Authentication failed:', result.error);
        setIsAuthenticated(false);
        return false;
      }
    } catch (error) {
      console.error('Authentication error:', error);
      setIsAuthenticated(false);
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
    const initialize = async () => {
      setIsLoading(true);
      await checkBiometricSupport();
      await checkExistingSession();
      setIsLoading(false);
    };
    
    initialize();
  }, []);

  return (
    <BiometricAuthContext.Provider
      value={{
        isAuthenticated,
        isBiometricSupported,
        isBiometricEnrolled,
        isLoading,
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
