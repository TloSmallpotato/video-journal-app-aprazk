
import { Redirect } from 'expo-router';
import { useBiometricAuth } from '../contexts/BiometricAuthContext';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

export default function Index() {
  const { isAuthenticated, isLoading } = useBiometricAuth();

  // Show loading indicator while checking authentication status
  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#2E2A8B" />
      </View>
    );
  }

  if (isAuthenticated) {
    return <Redirect href="/(tabs)/profile" />;
  }

  return <Redirect href="/auth" />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F1ED',
  },
});
